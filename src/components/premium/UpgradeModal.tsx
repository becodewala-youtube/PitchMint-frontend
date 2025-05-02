import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../../utils/constants';
import { RootState } from '../../store';
import { useTheme } from '../../contexts/ThemeContext';
import { Star, X } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeModal = ({ isOpen, onClose }: UpgradeModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useTheme();

  const handleUpgrade = async () => {
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

      window.location.href = response.data.url;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process upgrade');
    } finally {
      setLoading(false);
    }
  };

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
              {error}
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
              {loading ? 'Processing...' : 'Upgrade Now - $29/month'}
            </button>
          </div>

          <p className={`mt-4 text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;