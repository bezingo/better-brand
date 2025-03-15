import { NextResponse } from 'next/server';

// Define allowed hosts for security
const ALLOWED_HOSTS = [
  'checkoutshopper-live.adyen.com',
  'checkoutshopper-test.adyen.com',
  'checkoutshopper-live-us.adyen.com',
  'checkoutshopper-test-us.adyen.com',
];

export async function GET(request: Request) {
  try {
    // Get the URL from the query parameters
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'Missing URL parameter' },
        { status: 400 }
      );
    }

    // Parse the URL to check the host
    const parsedUrl = new URL(url);
    
    // Security check: only allow requests to Adyen domains
    if (!ALLOWED_HOSTS.includes(parsedUrl.host)) {
      return NextResponse.json(
        { error: 'Invalid host' },
        { status: 403 }
      );
    }

    // Fetch the resource from Adyen
    const response = await fetch(url);
    
    // Get the content type from the response
    const contentType = response.headers.get('content-type') || '';
    
    // Handle different content types
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      // For other content types (like images, CSS, etc.)
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Create a response with the same content type
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
        },
      });
    }
  } catch (error: any) {
    console.error('Adyen proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to proxy request' },
      { status: 500 }
    );
  }
}