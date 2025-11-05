import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSavedIdeas, deleteIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, Layout, Trash2, AlertCircle, Users, MessageSquare, Brain, Star, Sparkles, TrendingUp, Calendar, ArrowRight, Plus } from 'lucide-react';
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
  if (ideas.length === 0) {
    dispatch(getSavedIdeas() as any)
  }
}, [dispatch, ideas.length])

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

  if (loading) {
    return (   
      <div className='px-8 py-6'>
        <SavedIdeasSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/50">
            <AlertCircle className="h-10 w-10 text-white" />
          </div>
          <h3 className={`text-2xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Oops! Something went wrong</h3>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary Gradient Orbs */}
        <div
          className={`absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-violet-600/30 via-purple-600/20 to-fuchsia-600/30"
              : "bg-gradient-to-br from-violet-300/40 via-purple-300/30 to-fuchsia-300/40"
          }`}
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className={`absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-cyan-600/30 via-blue-600/20 to-indigo-600/30"
              : "bg-gradient-to-br from-cyan-300/40 via-blue-300/30 to-indigo-300/40"
          }`}
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        ></div>
        <div
          className={`absolute top-1/2 right-1/3 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-cyan-600/20"
              : "bg-gradient-to-br from-emerald-300/30 via-teal-300/20 to-cyan-300/30"
          }`}
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        ></div>

        {/* Mesh Gradient Overlay */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-purple-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-purple-200/10 to-transparent'}`} />
        
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        {/* Floating Elements */}
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-violet-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-fuchsia-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-2xl ${darkMode ? 'shadow-violet-500/50' : 'shadow-violet-500/30'}`}>
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-2xl md:text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Your{" "}
                    <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                      Startup Ideas
                    </span>
                  </h1>
                </div>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium flex items-center gap-2 ml-15`}>
                <TrendingUp className="w-4 h-4 text-violet-400" />
                Manage and track your validated concepts
              </p>
            </div>
            <motion.button
              onClick={() => navigate('/submit-idea')}
              className="group px-6 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-bold text-sm rounded-xl shadow-xl hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Submit New Idea
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </div>

          {/* Stats Summary Bar */}
          {ideas.length > 0 && (
            <div className={`relative overflow-hidden rounded-2xl p-4 ${darkMode ? 'bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-fuchsia-600/10 border border-violet-500/20' : 'bg-gradient-to-r from-violet-100 via-purple-100 to-fuchsia-100 border border-violet-200'}`}>
              <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-violet-600/5 via-purple-600/5 to-fuchsia-600/5' : 'bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50'} backdrop-blur-3xl`} />
              <div className="relative flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {ideas.length} {ideas.length === 1 ? 'Idea' : 'Ideas'} Validated
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Avg Score: {ideas.length ? Math.round(ideas.reduce((acc, idea) => acc + idea.overallScore, 0) / ideas.length) : 0}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {ideas.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {ideas.map((idea, index) => (
              <motion.div
                key={idea._id}
                className={`group relative overflow-hidden rounded-3xl p-6 ${
                  darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
                } backdrop-blur-xl hover:scale-[1.01] transition-all duration-500 cursor-pointer`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500" />

                <div className="relative">
                  {/* Header Section */}
                  <div className="flex justify-between items-start mb-6">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => navigate(`/idea/${idea._id}`)}
                    >
                      <h2 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 group-hover:bg-clip-text transition-all duration-300`}>
                        {idea.ideaText.length > 150
                          ? `${idea.ideaText.substring(0, 150)}...`
                          : idea.ideaText}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4">
                        {/* Score Badge */}
                        <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${
                          idea.overallScore >= 80
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/50'
                            : idea.overallScore >= 60
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/50'
                            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/50'
                        }`}>
                          <Star className="w-4 h-4 mr-2" />
                          {idea.overallScore}% Score
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {new Date(idea.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <motion.button
                      onClick={() => navigate(`/pitch-deck/${idea._id}`)}
                      className={`group/btn inline-flex items-center justify-center px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                        darkMode
                          ? 'bg-gray-800/50 text-gray-300 hover:bg-gradient-to-r hover:from-violet-600 hover:to-purple-600 hover:text-white border border-gray-700/50 hover:border-violet-500/50'
                          : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-violet-600 hover:to-purple-600 hover:text-white border border-gray-200 hover:border-violet-300'
                      } hover:scale-105 hover:shadow-lg`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FileText className="h-4 w-4 mr-2 group-hover/btn:animate-pulse" />
                      {idea.pitchDeckContent ? 'View Deck' : 'Create Deck'}
                    </motion.button>

                    <motion.button
                      onClick={() => navigate(`/canvas/${idea._id}`)}
                      className={`group/btn inline-flex items-center justify-center px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                        darkMode
                          ? 'bg-gray-800/50 text-gray-300 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 hover:text-white border border-gray-700/50 hover:border-cyan-500/50'
                          : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 hover:text-white border border-gray-200 hover:border-cyan-300'
                      } hover:scale-105 hover:shadow-lg`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Layout className="h-4 w-4 mr-2 group-hover/btn:animate-pulse" />
                      {idea.canvasContent ? 'View Canvas' : 'Create Canvas'}
                    </motion.button>

                    <motion.button
                      onClick={() => navigate(`/competitors/${idea._id}`)}
                      className={`group/btn inline-flex items-center justify-center px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                        darkMode
                          ? 'bg-gray-800/50 text-gray-300 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 hover:text-white border border-gray-700/50 hover:border-emerald-500/50'
                          : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 hover:text-white border border-gray-200 hover:border-emerald-300'
                      } hover:scale-105 hover:shadow-lg`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Users className="h-4 w-4 mr-2 group-hover/btn:animate-pulse" />
                      {idea.competitorAnalysis ? 'View Analysis' : 'Analyze'}
                    </motion.button>

                    <motion.button
                      onClick={() => navigate(`/pitch-simulator/${idea._id}`)}
                      className={`group/btn inline-flex items-center justify-center px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                        darkMode
                          ? 'bg-gray-800/50 text-gray-300 hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-600 hover:text-white border border-gray-700/50 hover:border-orange-500/50'
                          : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-600 hover:text-white border border-gray-200 hover:border-orange-300'
                      } hover:scale-105 hover:shadow-lg`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2 group-hover/btn:animate-pulse" />
                      {idea.pitchSimulation ? 'Practice' : 'Start Practice'}
                    </motion.button>

                    <motion.button
                      onClick={() => handleDeleteClick(idea._id)}
                      className={`group/btn inline-flex items-center justify-center px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                        darkMode
                          ? 'bg-gray-800/50 text-red-400 hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-600 hover:text-white border border-gray-700/50 hover:border-red-500/50'
                          : 'bg-gray-100 text-red-600 hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-600 hover:text-white border border-gray-200 hover:border-red-300'
                      } hover:scale-105 hover:shadow-lg hover:shadow-red-500/50`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="h-4 w-4 mr-2 group-hover/btn:animate-pulse" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center mx-auto mb-6 shadow-2xl ${darkMode ? 'shadow-violet-500/50' : 'shadow-violet-500/30'}`}>
              <Brain className="h-12 w-12 text-white" />
            </div>
            <h3 className={`text-2xl font-black mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No Ideas Yet
            </h3>
            <p className={`text-lg mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              You haven't submitted any ideas yet. Start your entrepreneurial journey today and get instant AI validation!
            </p>
            <motion.button
              onClick={() => navigate('/submit-idea')}
              className="group px-8 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-bold text-sm rounded-2xl shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5 mr-3" />
              Submit Your First Idea
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>
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