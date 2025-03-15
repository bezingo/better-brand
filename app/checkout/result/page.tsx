'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending' | 'unknown'>('unknown');
  const [error, setError] = useState<string | null>(null);

  // Get result code and redirect result from URL
  const resultCode = searchParams.get('resultCode');
  const redirectResult = searchParams.get('redirectResult');
  const sessionId = searchParams.get('sessionId');

  useEffect(() => {
    // If we have a result code directly in the URL, use it
    if (resultCode) {
      handleResultCode(resultCode);
      return;
    }

    // If we have a redirect result or session ID, process it
    if (redirectResult || sessionId) {
      processPaymentResult();
    } else {
      // No payment information found
      setIsProcessing(false);
      setPaymentStatus('unknown');
      setError('No payment information found');
    }
  }, [resultCode, redirectResult, sessionId]);

  // Process payment result by calling the API
  const processPaymentResult = async () => {
    try {
      setIsProcessing(true);

      // Prepare request body
      const requestBody: any = {};
      if (redirectResult) {
        requestBody.redirectResult = redirectResult;
      } else if (sessionId) {
        requestBody.sessionId = sessionId;
      }

      // Call the API to process the payment result
      const response = await fetch('/api/payment/adyen-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process payment result');
      }

      const data = await response.json();
      
      // Handle the result
      handleResultCode(data.resultCode);
    } catch (err: any) {
      console.error('Error processing payment result:', err);
      setPaymentStatus('failed');
      setError(err.message || 'Failed to process payment result');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle the result code
  const handleResultCode = (code: string) => {
    switch (code) {
      case 'Authorised':
      case 'Received':
      case 'Pending':
        setPaymentStatus('success');
        break;
      case 'Cancelled':
      case 'Refused':
      case 'Error':
        setPaymentStatus('failed');
        setError(code === 'Cancelled' ? 'Payment was cancelled' : 'Payment was refused');
        break;
      case 'PendingPayment':
      case 'IdentifyShopper':
      case 'ChallengeShopper':
      case 'RedirectShopper':
        setPaymentStatus('pending');
        break;
      default:
        setPaymentStatus('unknown');
        setError('Unknown payment status');
    }
  };

  // Render based on payment status
  const renderContent = () => {
    if (isProcessing) {
      return (
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Processing Payment</h2>
          <p className="text-muted-foreground">Please wait while we process your payment...</p>
        </div>
      );
    }

    switch (paymentStatus) {
      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <div className="bg-muted p-4 rounded-md mb-6 max-w-md mx-auto">
              <p className="font-medium">Order Reference</p>
              <p className="text-muted-foreground">{`ORD-${Date.now().toString().substring(0, 10)}`}</p>
            </div>
            <div className="flex justify-center space-x-4">
              <Link
                href="/account/orders"
                className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
              >
                View Order
              </Link>
              <Link
                href="/"
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Payment Failed</h2>
            <p className="text-muted-foreground mb-6">
              {error || 'There was an issue processing your payment. Please try again.'}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.back()}
                className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/contact"
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Payment Pending</h2>
            <p className="text-muted-foreground mb-6">
              Your payment is being processed. We'll update you once it's complete.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/account/orders"
                className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
              >
                View Order Status
              </Link>
              <Link
                href="/"
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Payment Status Unknown</h2>
            <p className="text-muted-foreground mb-6">
              {error || 'We couldn\'t determine the status of your payment.'}
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/checkout"
                className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
              >
                Return to Checkout
              </Link>
              <Link
                href="/contact"
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Payment Result</h1>
        {renderContent()}
      </div>
    </div>
  );
}