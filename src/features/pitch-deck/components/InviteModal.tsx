import React from 'react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, onInvite }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        
        <div className={`relative bg-gray-800 rounded-xl max-w-md w-full p-6`}>
          <h3 className={`text-xl font-bold mb-4 text-white`}>
            Invite Collaborators
          </h3>
          <p className={`text-sm mb-4 text-gray-300`}>
            Share this link with your team members to collaborate on the pitch deck.
          </p>
          <button
            onClick={onInvite}
            className="w-full px-6 py-3 rounded-2xl text-sm font-medium text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/25"
          >
            Copy Collaboration Link
          </button>
          <button
            onClick={onClose}
            className="w-full mt-3 px-6 py-3 rounded-2xl text-sm font-medium border-2 transition-all duration-300 border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/10"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
