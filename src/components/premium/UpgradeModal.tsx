import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../../utils/constants';
import { RootState } from '../../store';
import { useTheme } from '../../contexts/ThemeContext';
import { Star, X } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeModal = ({ isOpen, onClose }: UpgradeModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useTheme();

  const handleUpgrade = async () => {
    if (!window.Razorpay) {
      setError('Payment gateway not loaded. Please refresh the page.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      
      const response = await axios.post(
        `${API_URL}/api/payment/create-checkout-session`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     
      const { orderId, amount, currency, keyId, userEmail, userName } = response.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'PitchMint',
        description: 'Premium Upgrade',
        order_id: orderId,
        prefill: {
          name: userName || user?.name || '',
          email: userEmail || user?.email || '',
        },
        theme: {
          color: '#8B5CF6'
        },
        handler: async function (response: any) {
          
          try {
            setLoading(true);
            // Verify payment on backend
            const verifyResponse = await axios.post(
              `${API_URL}/api/payment/verify-premium`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { 
                headers: { Authorization: `Bearer ${token}` },
                timeout: 15000
              }
            );
            
            
            // Show success message
            alert('Premium upgrade successful! Page will reload to reflect changes.');
            
            // Close modal and refresh page
            onClose();
            window.location.reload();
            
          } catch (verifyError: any) {
            console.error('Premium payment verification failed:', verifyError);
            setError(
              verifyError.response?.data?.message || 
              'Payment verification failed. Please contact support if amount was debited.'
            );
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
          
            setLoading(false);
          }
        }
      };

      
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error('Premium payment failed:', response.error);
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      rzp.open();

    } catch (err: any) {
      console.error('Premium upgrade failed:', err);
      
      let errorMessage = 'Failed to create payment order';
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Load Razorpay script on component mount
  useState(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        
        <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-lg w-full p-6`}>
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 ${
              darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="h-6 w-6" />
          </button>

          <div className="text-center">
            <Star className={`mx-auto h-12 w-12 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
            <h3 className={`mt-4 text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Upgrade to Premium
            </h3>
            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Get access to exclusive features and investor contacts
            </p>
          </div>

          <div className="mt-6">
            <h4 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Premium Features Include:
            </h4>
            <ul className={`mt-4 space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Access to investor directory
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Unlimited pitch deck generations
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Priority support
              </li>
            </ul>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              <div className="flex justify-between items-start">
                <span>{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Upgrade Now - ₹29' 
              )}
            </button>
          </div>

          <p className={`mt-4 text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Secure payment powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;