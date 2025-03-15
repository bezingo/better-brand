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
    const { amount, currency, reference, returnUrl, countryCode, shopperLocale } = await request.json();

    // Validate required fields
    if (!amount || !currency || !reference || !returnUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create session request
    const sessionRequest = {
      amount: {
        currency,
        value: Math.round(amount * 100), // Convert to minor units (cents)
      },
      reference,
      returnUrl,
      merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT as string,
      countryCode: countryCode || 'US',
      shopperLocale: shopperLocale || 'en-US',
      channel: 'Web',
    };

    // Create session
    const response = await checkout.sessions(sessionRequest);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Adyen session error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Adyen session' },
      { status: 500 }
    );
  }
}