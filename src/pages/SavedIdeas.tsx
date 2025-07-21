import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSavedIdeas, deleteIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, Layout, Trash2, AlertCircle, Users, MessageSquare, Brain, Star } from 'lucide-react';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';
import SavedIdeasSkeleton from '../components/skeleton/SavedIdeasSkeleton';
import { motion } from 'framer-motion';

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
      <div className='px-8 py-4'>
        <SavedIdeasSkeleton />
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
  <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
    {/* Animated Background */}
    <div className="absolute inset-0 overflow-hidden">
      <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${darkMode ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-blue-400 to-purple-400'} animate-pulse`}></div>
      <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${darkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-green-400 to-blue-400'} animate-pulse delay-1000`}></div>
    </div>

    <div className="relative z-10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center md:text-left">
            <h1 className={`text-4xl md:text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Your
              <span className="ml-2 bg-gradient-to-r from-purple-400 via-cyan-500 to-cyan-500 bg-clip-text text-transparent">
                Startup Ideas
              </span>
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage and track your validated ideas
            </p>
          </div>
          <motion.button
            onClick={() => navigate('/submit-idea')}
            className="group relative px-8 py-4 btn-primary btn-primary-cyan text-white font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden mt-6 md:mt-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 btn-primary btn-primary-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center">
              <Brain className="h-6 w-6 mr-2" />
              Submit New Idea
            </span>
          </motion.button>
        </motion.div>

        {ideas.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {ideas.map((idea, index) => (
              <motion.div
                key={idea._id}
                className={`group relative p-8 rounded-3xl ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h2
                        className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} cursor-pointer hover:text-cyan-500 transition-colors duration-300 mb-4`}
                        onClick={() => navigate(`/idea/${idea._id}`)}
                      >
                        {idea.ideaText.length > 150
                          ? `${idea.ideaText.substring(0, 150)}...`
                          : idea.ideaText}
                      </h2>
                      <div className="flex items-center space-x-6 mb-6">
                        <div className="flex items-center ">
                          <Star className="w-4 h-4 text-yellow-500 mr-2 text-xs" />
                          <span className={`text-sm font-bold ${
                            idea.overallScore >= 80 ? 'text-green-500' :
                            idea.overallScore >= 60 ? 'text-yellow-500' :
                            'text-red-500'
                          }`}>
                            Score: {idea.overallScore}%
                          </span>
                        </div>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(idea.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      onClick={() => navigate(`/pitch-deck/${idea._id}`)}
                      className={`inline-flex items-center px-4 py-2 rounded-xl text-xs  font-medium transition-all duration-300 ${
                        darkMode
                          ? 'bg-gray-700/50 text-gray-300 hover:bg-purple-600 hover:text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-purple-600 hover:text-white'
                      } hover:scale-105`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {idea.pitchDeckContent ? 'View Pitch Deck' : 'Generate Pitch Deck'}
                    </motion.button>

                    <motion.button
                      onClick={() => navigate(`/canvas/${idea._id}`)}
                      className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                        darkMode
                          ? 'bg-gray-700/50 text-gray-300 hover:bg-blue-600 hover:text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white'
                      } hover:scale-105`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Layout className="h-4 w-4 mr-2" />
                      {idea.canvasContent ? 'View Canvas' : 'Generate Canvas'}
                    </motion.button>

                    <motion.button
                      onClick={() => navigate(`/competitors/${idea._id}`)}
                      className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                        darkMode
                          ? 'bg-gray-700/50 text-gray-300 hover:bg-green-600 hover:text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-green-600 hover:text-white'
                      } hover:scale-105`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {idea.competitorAnalysis ? 'View Competitors' : 'Analyze Competitors'}
                    </motion.button>

                    <motion.button
                      onClick={() => navigate(`/pitch-simulator/${idea._id}`)}
                      className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                        darkMode
                          ? 'bg-gray-700/50 text-gray-300 hover:bg-orange-600 hover:text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-orange-600 hover:text-white'
                      } hover:scale-105`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {idea.pitchSimulation ? 'Practice Pitch' : 'Start Pitch Practice'}
                    </motion.button>

                    <motion.button
                      onClick={() => handleDeleteClick(idea._id)}
                      className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 transition-all duration-300 hover:scale-105"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-8`}>
              <Brain className="h-12 w-12 text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No Ideas Yet
            </h3>
            <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              You haven't submitted any ideas yet. Start your entrepreneurial journey today!
            </p>
            <motion.button
              onClick={() => navigate('/submit-idea')}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Submit Your First Idea
              </span>
            </motion.button>
          </motion.div>
        )}
      </div>
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