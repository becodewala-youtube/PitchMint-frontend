import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { useRazorpay } from '@/features/credits/hooks/useRazorpay';
import api from '@/shared/lib/api';
import { useAppDispatch } from '@/shared/hooks';
import { loadUser } from '@/features/auth/store/authSlice';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeModal = ({ isOpen, onClose }: UpgradeModalProps) => {
  const dispatch = useAppDispatch();
  const [demoLoading, setDemoLoading] = useState(false);

  const { initiatePayment, loading, error, setError } = useRazorpay({
    createSessionEndpoint: '/api/payment/create-checkout-session',
    verifyPaymentEndpoint: '/api/payment/verify-premium',
    onSuccess: () => {
      alert('Premium upgrade successful! Page will reload to reflect changes.');
      dispatch(loadUser());
      onClose();
      window.location.reload();
    },
    onError: (err) => { 
      if (import.meta.env.DEV) console.error('Premium upgrade failed:', err);
    }
  });

  const handleUpgrade = async () => {
    await initiatePayment();
  };

  const handleDemoUpgrade = async () => {
    try {
      setDemoLoading(true);
      setError(null);
      const res = await api.post('/api/payment/simulate-premium-success');
      alert(res.data.message || 'Successfully upgraded to Premium!');
      await dispatch(loadUser());
      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Demo upgrade failed');
    } finally {
      setDemoLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        
        <div className={`relative bg-gray-800 rounded-lg max-w-lg w-full p-6`}>
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 ${
              'text-gray-400 hover:text-gray-300'
            }`}
          >
            <X className="h-6 w-6" />
          </button>

          <div className="text-center">
            <Star className={`mx-auto h-12 w-12 text-yellow-400`} />
            <h3 className={`mt-4 text-2xl font-bold text-white`}>
              Upgrade to Premium
            </h3>
            <p className={`mt-2 text-gray-300`}>
              Get access to exclusive features and investor contacts
            </p>
          </div>

          <div className="mt-6">
            <h4 className={`text-lg font-medium text-white`}>
              Premium Features Include:
            </h4>
            <ul className={`mt-4 space-y-3 text-gray-300`}>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Access to investor directory
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
              disabled={loading || demoLoading}
              className={`w-full py-3 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer ${
                loading || demoLoading ? 'opacity-50 cursor-not-allowed' : ''
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

          {import.meta.env.DEV && (
            <div className="mt-3">
              <button
                type="button"
                onClick={handleDemoUpgrade}
                disabled={loading || demoLoading}
                className="w-full py-2.5 px-4 rounded-md text-xs font-semibold text-purple-300 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center"
              >
                {demoLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-300 mr-2"></div>
                    Upgrading...
                  </div>
                ) : (
                  'Demo Upgrade (Dev Only)'
                )}
              </button>
            </div>
          )}

          <p className={`mt-4 text-sm text-center text-gray-400`}>
            Secure payment powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;