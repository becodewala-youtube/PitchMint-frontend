import { useTheme } from '../../contexts/ThemeContext';
import { CreditCard, X, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditsRequired: number;
  creditsAvailable: number;
}

const InsufficientCreditsModal = ({ 
  isOpen, 
  onClose, 
  creditsRequired, 
  creditsAvailable 
}: InsufficientCreditsModalProps) => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleBuyCredits = () => {
    onClose();
    navigate('/credits');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        
        <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}>
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 ${
              darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="h-6 w-6" />
          </button>

          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-orange-500" />
            <h3 className={`mt-4 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Insufficient Credits
            </h3>
            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              You need {creditsRequired} credit{creditsRequired > 1 ? 's' : ''} to use this feature, 
              but you only have {creditsAvailable} credit{creditsAvailable !== 1 ? 's' : ''} available.
            </p>
          </div>

          <div className="mt-6 flex flex-col space-y-3">
            <button
              onClick={handleBuyCredits}
              className="w-full flex items-center justify-center px-4 py-3 rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Buy More Credits
            </button>
            <button
              onClick={onClose}
              className={`w-full px-4 py-2 rounded-md ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsufficientCreditsModal;