'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  adId: string;
  priceId: string;
  onPaymentSuccess: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ adId, priceId, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    // Create a PaymentIntent on your server
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId, priceId }),
    });

    const { clientSecret, error: backendError } = await response.json();

    if (backendError) {
      setMessage(backendError);
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/ads/${adId}`, // Redirect back to the ad page
      },
    });

    // This point will only be reached if there's an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An unexpected error occurred.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit" className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
        <span id="button-text">
          {isLoading ? "Processing..." : "Top Ad Now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message" className="mt-3 text-red-500 text-sm">{message}</div>}
    </form>
  );
};

interface StripePaymentFormProps {
  adId: string;
  priceId: string;
  onPaymentSuccess: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ adId, priceId, onPaymentSuccess }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId, priceId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setClientSecret(data.clientSecret);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching client secret:", err);
        setError("Failed to initialize payment. Please try again.");
        setLoading(false);
      });
  }, [adId, priceId]);

  const appearance = {
    theme: 'stripe' as const,
  };
  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return <div className="text-center py-4">Loading payment options...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm adId={adId} priceId={priceId} onPaymentSuccess={onPaymentSuccess} />
        </Elements>
      )}
    </div>
  );
};

export default StripePaymentForm;
