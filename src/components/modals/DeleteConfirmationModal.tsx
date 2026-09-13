
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, loading }: DeleteConfirmationModalProps) => {

  if (!isOpen) return null;

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
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className={`mt-4 text-xl font-bold text-white`}>
              Delete Idea
            </h3>
            <p className={`mt-2 text-gray-300`}>
              Are you sure you want to delete this idea? This action cannot be undone.
            </p>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md ${
                'bg-gray-700 text-gray-300 hover:bg-gray-600'
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