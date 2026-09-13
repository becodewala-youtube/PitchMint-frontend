import { useState, useEffect } from 'react';
import api from '../utils/api';

interface CheckoutSessionData {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  planName?: string;
  userEmail?: string;
  userName?: string;
}

interface UseRazorpayOptions {
  createSessionEndpoint: string;
  verifyPaymentEndpoint: string;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
  onDismiss?: () => void;
  name?: string;
  description?: (data: CheckoutSessionData) => string;
}

export const useRazorpay = ({
  createSessionEndpoint,
  verifyPaymentEndpoint,
  onSuccess,
  onError,
  onDismiss,
  name = 'PitchMint',
  description
}: UseRazorpayOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load script on mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onerror = () => setError('Failed to load payment gateway');
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initiatePayment = async (payload: any = {}) => {
    if (!window.Razorpay) {
      const msg = 'Payment gateway not loaded. Please refresh the page.';
      setError(msg);
      onError(new Error(msg));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post(createSessionEndpoint, payload);
      const data: CheckoutSessionData = response.data;
      const { orderId, amount, currency, keyId, userEmail, userName } = data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: name,
        description: description ? description(data) : 'Premium Upgrade',
        order_id: orderId,
        prefill: {
          name: userName || '',
          email: userEmail || '',
        },
        theme: {
          color: '#8B5CF6'
        },
        handler: async function (paymentResponse: any) {
          try {
            setLoading(true);
            const verifyResponse = await api.post(
              verifyPaymentEndpoint,
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
              { timeout: 15000 }
            );
            
            onSuccess(verifyResponse.data);
          } catch (verifyError: any) { (import.meta.env.DEV) console.error('Payment verification failed:', verifyError);
            const errMsg = verifyError.response?.data?.message || 'Payment verification failed. Please contact support if amount was debited.';
            setError(errMsg);
            onError(verifyError);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            if (onDismiss) onDismiss();
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (paymentResponse: any) { (import.meta.env.DEV) console.error('Premium payment failed:', paymentResponse.error);
        const errMsg = `Payment failed: ${paymentResponse.error.description}`;
        setError(errMsg);
        onError(new Error(errMsg));
        setLoading(false);
      });

      rzp.open();
    } catch (err: any) { (import.meta.env.DEV) console.error('Payment initialization failed:', err);
      let errorMessage = 'Failed to create payment order';
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      setError(errorMessage);
      onError(new Error(errorMessage));
      setLoading(false);
    }
  };

  return { initiatePayment, loading, error, setError };
};
