
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
        
        <div className={`relative bg-gray-800 rounded-lg max-w-md w-full p-6`}>
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 ${
              'text-gray-400 hover:text-gray-300'
            }`}
          >
            <X className="h-6 w-6" />
          </button>

          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-orange-500" />
            <h3 className={`mt-4 text-xl font-bold text-white`}>
              Insufficient Credits
            </h3>
            <p className={`mt-2 text-gray-300`}>
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
                'bg-gray-700 text-gray-300 hover:bg-gray-600'
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