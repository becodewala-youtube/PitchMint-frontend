import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSavedIdeas, deleteIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, Layout, Trash2, AlertCircle, Users, MessageSquare, Brain, Star } from 'lucide-react';
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
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Ideas
            </h1>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage and track your startup ideas
            </p>
          </div>
          <button
            onClick={() => navigate('/submit-idea')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Brain className="h-5 w-5 mr-2" />
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
                } rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h2
                          className={`text-xl font-semibold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          } cursor-pointer hover:text-indigo-600 transition-colors duration-200`}
                          onClick={() => navigate(`/idea/${idea._id}`)}
                        >
                          {idea.ideaText.length > 100
                            ? `${idea.ideaText.substring(0, 100)}...`
                            : idea.ideaText}
                        </h2>
                      </div>
                      <div className="flex items-center space-x-4 mb-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${scoreColor(idea.overallScore)}`}>
                          <Star className="w-4 h-4 mr-1" />
                          Score: {idea.overallScore}%
                        </span>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(idea.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={() => navigate(`/pitch-deck/${idea._id}`)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 ${
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
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 ${
                        darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Layout className="h-4 w-4 mr-2" />
                      {idea.canvasContent ? 'View Canvas' : 'Generate Canvas'}
                    </button>
                    <button
                      onClick={() => navigate(`/competitors/${idea._id}`)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 ${
                        darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {idea.competitorAnalysis ? 'View Competitors' : 'Analyze Competitors'}
                    </button>
                    <button
                      onClick={() => navigate(`/pitch-simulator/${idea._id}`)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 ${
                        darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {idea.pitchSimulation ? 'Practice Pitch' : 'Start Pitch Practice'}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(idea._id)}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-xl shadow-lg p-8 text-center`}
          >
            <Brain className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`} />
            <p className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              You haven't submitted any ideas yet
            </p>
            <button
              onClick={() => navigate('/submit-idea')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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