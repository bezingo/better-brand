import { NextResponse } from 'next/server';
import { Client, CheckoutAPI } from '@adyen/api-library';

// Initialize Adyen client
const initAdyenClient = () => {
  const client = new Client({
    apiKey: process.env.ADYEN_API_KEY as string,
    environment: process.env.ADYEN_ENVIRONMENT as string,
  });
  return new CheckoutAPI(client);
};

export async function POST(request: Request) {
  try {
    const checkout = initAdyenClient();
    const requestBody = await request.json();
    
    // Validate request body
    if (!requestBody.redirectResult && !requestBody.sessionId) {
      return NextResponse.json(
        { error: 'Missing redirectResult or sessionId' },
        { status: 400 }
      );
    }

    let paymentDetailsRequest;
    
    // Handle redirect result
    if (requestBody.redirectResult) {
      paymentDetailsRequest = {
        details: {
          redirectResult: requestBody.redirectResult,
        },
      };
    } 
    // Handle session result
    else if (requestBody.sessionId) {
      paymentDetailsRequest = {
        details: {
          sessionId: requestBody.sessionId,
        },
      };
    }

    // Get payment details
    const response = await checkout.paymentsDetails(paymentDetailsRequest);
    
    // Log payment result for debugging
    console.log('Adyen payment result:', response);
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Adyen payment result error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process payment result' },
      { status: 500 }
    );
  }
}