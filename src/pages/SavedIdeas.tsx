import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSavedIdeas, deleteIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, Layout, Trash2, AlertCircle } from 'lucide-react';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';

const SavedIdeas = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  
  const { ideas, loading, error } = useSelector((state: RootState) => state.idea);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(getSavedIdeas() as any);
  }, [dispatch]);

  const handleDeleteClick = (ideaId: string) => {
    setSelectedIdeaId(ideaId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedIdeaId) {
      setDeleteLoading(true);
      await dispatch(deleteIdea(selectedIdeaId) as any);
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setSelectedIdeaId(null);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-xl font-medium text-red-500">Error</h3>
          <p className="mt-1 text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Saved Ideas
          </h1>
          <button
            onClick={() => navigate('/submit-idea')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Submit New Idea
          </button>
        </div>

        {ideas.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {ideas.map((idea) => (
              <div
                key={idea._id}
                className={`${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } rounded-lg shadow-lg p-6`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2
                      className={`text-xl font-semibold mb-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      } cursor-pointer hover:text-indigo-600`}
                      onClick={() => navigate(`/idea/${idea._id}`)}
                    >
                      {idea.ideaText.length > 100
                        ? `${idea.ideaText.substring(0, 100)}...`
                        : idea.ideaText}
                    </h2>
                    <div className="flex items-center space-x-4 mb-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          scoreColor(idea.overallScore)
                        }`}
                      >
                        Overall Score: {idea.overallScore}%
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-4">
                  <button
                    onClick={() => navigate(`/pitch-deck/${idea._id}`)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${
                      darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {idea.pitchDeckContent ? 'View Pitch Deck' : 'Generate Pitch Deck'}
                  </button>
                  <button
                    onClick={() => navigate(`/canvas/${idea._id}`)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${
                      darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Layout className="h-4 w-4 mr-2" />
                    {idea.canvasContent ? 'View Canvas' : 'Generate Canvas'}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(idea._id)}
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow-lg p-8 text-center`}
          >
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              You haven't submitted any ideas yet.
            </p>
            <button
              onClick={() => navigate('/submit-idea')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Submit Your First Idea
            </button>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedIdeaId(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
};

export default SavedIdeas;