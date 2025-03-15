'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import { useLocale } from '../contexts/LocaleContext';

// Import Adyen Web
import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';
import { Dropin } from '@adyen/adyen-web/dist/types/components/Dropin';

interface AdyenPaymentProps {
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  returnUrl?: string;
}

export default function AdyenPayment({
  onSuccess,
  onError,
  returnUrl = `${window.location.origin}/checkout/result`,
}: AdyenPaymentProps) {
  const adyenContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cart, totalPrice, clearCart } = useCart();
  const { locale, currencyCode } = useLocale();
  const router = useRouter();

  // Create a reference to store the checkout instance
  const checkoutRef = useRef<any>(null);
  const dropinRef = useRef<Dropin | null>(null);

  // Function to make the session setup call
  const makeSessionsSetupCall = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Create a unique reference for this payment
      const reference = `order-${Date.now()}`;

      // Make API call to create a session
      const response = await fetch('/api/payment/adyen-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalPrice,
          currency: currencyCode,
          reference,
          returnUrl,
          countryCode: locale.split('-')[1],
          shopperLocale: locale,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment session');
      }

      return await response.json();
    } catch (err: any) {
      console.error('Error creating Adyen session:', err);
      setError(err.message || 'Failed to initialize payment');
      if (onError) onError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Adyen checkout
  useEffect(() => {
    // Don't initialize if cart is empty
    if (cart.length === 0) {
      setError('Your cart is empty');
      setIsLoading(false);
      return;
    }

    // Don't initialize if container ref is not available
    if (!adyenContainerRef.current) return;

    // Clean up function to remove previous instances
    const cleanup = () => {
      if (dropinRef.current) {
        dropinRef.current.unmount();
        dropinRef.current = null;
      }
    };

    // Initialize Adyen checkout
    const initializeCheckout = async () => {
      try {
        cleanup();

        // Create session
        const session = await makeSessionsSetupCall();
        if (!session) return;

        // Configure Adyen checkout
        const checkout = await AdyenCheckout({
          environment: 'test', // Change to 'live' for production
          clientKey: process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY,
          locale: locale,
          analytics: {
            enabled: false,
          },
          session: session,
          onPaymentCompleted: (result: any) => {
            console.log('Payment completed:', result);
            if (onSuccess) onSuccess(result);
            clearCart();
            router.push(`/checkout/result?resultCode=${result.resultCode}`);
          },
          onError: (error: any) => {
            console.error('Adyen error:', error);
            setError(error.message || 'Payment error');
            if (onError) onError(error);
          },
          // Use our proxy for loading resources
          loadingContext: `${window.location.origin}/api/payment/adyen-proxy?url=`,
        });

        // Store checkout instance in ref
        checkoutRef.current = checkout;

        // Configure and mount the Drop-in component
        const dropinConfig = {
          showPayButton: true,
          openFirstPaymentMethod: true,
          openFirstStoredPaymentMethod: false,
          paymentMethodsConfiguration: {
            card: {
              hasHolderName: true,
              holderNameRequired: true,
              enableStoreDetails: true,
              hideCVC: false,
              name: 'Credit or debit card',
            },
          },
        };

        // Create and mount the Drop-in component
        const dropin = new Dropin(checkout, dropinConfig);
        dropin.mount(adyenContainerRef.current);
        dropinRef.current = dropin;
      } catch (err: any) {
        console.error('Error initializing Adyen checkout:', err);
        setError(err.message || 'Failed to initialize payment');
        if (onError) onError(err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCheckout();

    // Cleanup on unmount
    return cleanup;
  }, [cart, locale, currencyCode, totalPrice, returnUrl, onSuccess, onError, clearCart, router]);

  return (
    <div className="adyen-checkout-container">
      {isLoading && <div className="loading">Loading payment methods...</div>}
      {error && <div className="error">{error}</div>}
      <div ref={adyenContainerRef} className="adyen-checkout"></div>
    </div>
  );
}