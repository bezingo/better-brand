import { NextResponse } from 'next/server';
import crypto from 'crypto';

// HMAC verification function
const verifyHmacSignature = (
  notificationRequestItem: any,
  hmacKey: string
): boolean => {
  if (!hmacKey) {
    console.warn('HMAC key not configured, skipping verification');
    return true; // Skip verification if key not provided
  }

  try {
    // Get the HMAC signature from the notification
    const notificationHmac = notificationRequestItem.additionalData?.hmacSignature;
    
    if (!notificationHmac) {
      console.error('No HMAC signature found in notification');
      return false;
    }

    // Create the signing data string by concatenating the required fields
    const signatureData = [
      notificationRequestItem.pspReference,
      notificationRequestItem.originalReference || '',
      notificationRequestItem.merchantAccountCode,
      notificationRequestItem.merchantReference,
      notificationRequestItem.amount.value,
      notificationRequestItem.amount.currency,
      notificationRequestItem.eventCode,
      notificationRequestItem.success
    ].join(':');

    // Calculate the HMAC
    const calculatedHmac = crypto
      .createHmac('sha256', hmacKey)
      .update(signatureData)
      .digest('base64');

    // Compare the calculated HMAC with the one from the notification
    return calculatedHmac === notificationHmac;
  } catch (error) {
    console.error('Error verifying HMAC signature:', error);
    return false;
  }
};

export async function POST(request: Request) {
  try {
    // Get the webhook payload
    const payload = await request.json();
    console.log('Received Adyen webhook:', JSON.stringify(payload, null, 2));

    // Basic authentication
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Basic ${Buffer.from(
      `${process.env.ADYEN_WEBHOOK_USERNAME}:${process.env.ADYEN_WEBHOOK_PASSWORD}`
    ).toString('base64')}`;

    if (!authHeader || authHeader !== expectedAuth) {
      console.error('Authentication failed for Adyen webhook');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Process each notification item
    const notificationItems = payload.notificationItems || [];
    
    for (const item of notificationItems) {
      const notificationItem = item.NotificationRequestItem;
      
      if (!notificationItem) {
        console.warn('Invalid notification item format');
        continue;
      }

      // Verify HMAC signature
      const isValidHmac = verifyHmacSignature(
        notificationItem,
        process.env.ADYEN_HMAC_KEY || ''
      );

      if (!isValidHmac) {
        console.error('Invalid HMAC signature for notification:', notificationItem.pspReference);
        continue;
      }

      // Process the notification based on event code
      const { eventCode, success, pspReference, merchantReference } = notificationItem;
      
      console.log(`Processing ${eventCode} event for ${merchantReference} (${pspReference}): ${success ? 'SUCCESS' : 'FAILURE'}`);

      switch (eventCode) {
        case 'AUTHORISATION':
          // Payment was authorized
          if (success === 'true') {
            // Update order status to authorized
            console.log(`Payment authorized for order ${merchantReference}`);
            // Here you would update your database to mark the order as paid
            // await updateOrderStatus(merchantReference, 'PAID');
          } else {
            // Payment authorization failed
            console.log(`Payment authorization failed for order ${merchantReference}`);
            // await updateOrderStatus(merchantReference, 'FAILED');
          }
          break;

        case 'CANCELLATION':
          // Payment was cancelled
          console.log(`Payment cancelled for order ${merchantReference}`);
          // await updateOrderStatus(merchantReference, 'CANCELLED');
          break;

        case 'CAPTURE':
          // Payment was captured (funds transferred)
          if (success === 'true') {
            console.log(`Payment captured for order ${merchantReference}`);
            // await updateOrderStatus(merchantReference, 'CAPTURED');
          }
          break;

        case 'REFUND':
          // Payment was refunded
          if (success === 'true') {
            console.log(`Payment refunded for order ${merchantReference}`);
            // await updateOrderStatus(merchantReference, 'REFUNDED');
          }
          break;

        case 'CHARGEBACK':
          // Chargeback was issued
          console.log(`Chargeback issued for order ${merchantReference}`);
          // await updateOrderStatus(merchantReference, 'CHARGEBACK');
          break;

        default:
          console.log(`Unhandled event type ${eventCode} for order ${merchantReference}`);
      }
    }

    // Always acknowledge receipt of the webhook
    return NextResponse.json({ notificationResponse: '[accepted]' });
  } catch (error: any) {
    console.error('Error processing Adyen webhook:', error);
    
    // Still return 200 to acknowledge receipt, even if processing failed
    // This prevents Adyen from retrying unnecessarily
    return NextResponse.json(
      { notificationResponse: '[accepted]' },
      { status: 200 }
    );
  }
}