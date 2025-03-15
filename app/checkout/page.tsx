'use client';

import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useLocale } from '../contexts/LocaleContext';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

// Dynamically import the Adyen checkout component to avoid SSR issues
const AdyenCheckout = dynamic(() => import('../components/AdyenCheckout'), {
  ssr: false,
  loading: () => <div className="loading">Loading payment component...</div>,
});

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const { formatCurrency } = useLocale();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment'>('cart');

  // Handle quantity change
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  // Handle payment success
  const handlePaymentSuccess = (result: any) => {
    console.log('Payment successful:', result);
  };

  // Handle payment error
  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
  };

  // Calculate shipping cost (free for orders over $100)
  const shippingCost = totalPrice > 100 ? 0 : 10;
  
  // Calculate tax (10% of subtotal)
  const taxAmount = totalPrice * 0.1;
  
  // Calculate order total
  const orderTotal = totalPrice + shippingCost + taxAmount;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            href="/shop" 
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart and Customer Info */}
          <div className="lg:col-span-2">
            {checkoutStep === 'cart' ? (
              <>
                <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Your Cart ({totalItems} items)</h2>
                  
                  <div className="divide-y">
                    {cart.map((item) => (
                      <div key={item.id} className="py-4 flex items-center">
                        <div className="w-20 h-20 bg-muted rounded-md overflow-hidden mr-4">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-muted-foreground">{formatCurrency(item.price)}</p>
                        </div>
                        
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border rounded-l-md"
                          >
                            -
                          </button>
                          <span className="w-10 h-8 flex items-center justify-center border-t border-b">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border rounded-r-md"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="ml-4 text-right">
                          <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 mt-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input 
                        type="email" 
                        className="w-full p-2 border rounded-md" 
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md" 
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md" 
                        placeholder="Doe"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md" 
                        placeholder="123 Main St"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md" 
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Postal Code</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md" 
                        placeholder="10001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Country</label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input 
                        type="tel" 
                        className="w-full p-2 border rounded-md" 
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </form>
                </div>
                
                <div className="flex justify-between">
                  <Link 
                    href="/shop" 
                    className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                  <button
                    onClick={() => setCheckoutStep('payment')}
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Payment</h2>
                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="text-primary hover:underline"
                  >
                    Back to Cart
                  </button>
                </div>
                
                <AdyenCheckout 
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(orderTotal)}</span>
                </div>
              </div>
              
              {checkoutStep === 'cart' ? (
                <button
                  onClick={() => setCheckoutStep('payment')}
                  className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Proceed to Payment
                </button>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  Please complete the payment form to place your order.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}