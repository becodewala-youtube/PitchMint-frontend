import { useTheme } from '../../contexts/ThemeContext';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, loading }: DeleteConfirmationModalProps) => {
  const { darkMode } = useTheme();

  if (!isOpen) return null;

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
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className={`mt-4 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Delete Idea
            </h3>
            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to delete this idea? This action cannot be undone.
            </p>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;