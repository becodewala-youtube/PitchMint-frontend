import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { submitIdea, clearError } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { Brain, AlertCircle, Sparkles, CheckCircle, Target, Users, TrendingUp, DollarSign, ArrowRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import InsufficientCreditsModal from '../components/modals/InsufficientCreditsModal';

const SubmitIdea = () => {
  const [ideaText, setIdeaText] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  
  const { loading, error, creditError } = useSelector((state: RootState) => state.idea);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(submitIdea({ ideaText }) as any);
    if (!result.error) {
      navigate(`/idea/${result.payload._id}`);
    }
  };

  const handleCloseCreditModal = () => {
    dispatch(clearError());
  };

  const tips = [
    {
      icon: Target,
      title: 'Problem & Solution',
      description: 'Be clear about the problem your idea solves',
      gradient: 'from-violet-500 to-fuchsia-500',
    },
    {
      icon: Users,
      title: 'Target Audience',
      description: 'Describe your target audience or market',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: TrendingUp,
      title: 'Unique Value',
      description: 'Explain how your solution is unique or better than alternatives',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: DollarSign,
      title: 'Business Model',
      description: 'Include potential revenue streams or business model ideas',
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className={`relative min-h-screen overflow-hidden ${darkMode ? "bg-[#0a0118]" : "bg-gray-50"} py-4 sm:py-6`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        
        
       
        
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-10 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 shadow-2xl shadow-cyan-500/50 flex items-center justify-center">
              <Brain className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
          </div>
          <h1 className={`text-lg sm:text-xl md:text-xl font-black sm:mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Submit Your
            <span className="ml-2 mt-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Startup Idea
            </span>
          </h1>
          <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Get instant AI-powered validation and analysis
          </p>
        </motion.div>

        {/* Main Form */}
        <motion.div 
          className={`rounded-3xl shadow-2xl backdrop-blur-xl py-3 px-4 sm:p-8 md:px-6 md:py-3 border mb-6 ${
            darkMode
              ? "bg-gray-900/50 border-gray-800/50"
              : "bg-white/80 border-gray-200"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Gradient Glow */}
          <div className={`absolute -inset-1 rounded-3xl opacity-50 blur-2xl pointer-events-none ${
            darkMode
              ? "bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-indigo-600/20"
              : "bg-gradient-to-r from-cyan-300/30 via-blue-300/30 to-indigo-300/30"
          }`} />

          <div className="relative">
            {error && (
              <motion.div 
                className="mb-6 flex items-start p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/50 text-red-500 rounded-xl backdrop-blur-sm" 
                role="alert"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className=" space-y-4 sm:space-y-6">
              <div>
                <label
                  htmlFor="idea"
                  className={`block text-sm md:text-md font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Describe your startup idea
                </label>
                <div className="relative">
                  <textarea
                    id="idea"
                    name="idea"
                    rows={5}
                    value={ideaText}
                    onChange={(e) => setIdeaText(e.target.value)}
                    placeholder="Example: A mobile app that uses AI to help people learn new languages through personalized, interactive conversations. Our platform adapts to each user's learning style and provides real-time feedback..."
                    className={`w-full px-4 py-2 text-sm  rounded-xl border outline-none transition-all duration-300 focus:ring-1 resize-none ${
                      darkMode
                        ? "bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-500 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-cyan-500/50 focus:border-cyan-500"
                    }`}
                  />
                  <div className={`absolute bottom-3 right-3 text-xs font-semibold ${
                    ideaText.length < 50 
                      ? darkMode ? 'text-gray-600' : 'text-gray-400'
                      : darkMode ? 'text-cyan-400' : 'text-cyan-600'
                  }`}>
                    {ideaText.length} characters
                  </div>
                </div>
                <p className={`mt-2 text-xs md:text-sm flex items-start ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Sparkles className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-cyan-400" />
                  <span>Be specific about your idea's value proposition, target market, and how it solves a problem.</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  type="submit"
                  disabled={loading || !ideaText.trim()}
                  className={`flex-1 group relative flex items-center justify-center gap-2 text-xs sm:text-sm font-bold py-1 sm:py-2  rounded-xl transition-all duration-300 shadow-xl overflow-hidden ${
                    (loading || !ideaText.trim())
                      ? "bg-gray-400 cursor-not-allowed"
                      : darkMode
                      ? "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:shadow-cyan-500/50 text-white"
                      : "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:shadow-cyan-500/50 text-white"
                  }`}
                  whileHover={!(loading || !ideaText.trim()) ? { scale: 1.02 } : {}}
                  whileTap={!(loading || !ideaText.trim()) ? { scale: 0.98 } : {}}
                >
                  {!(loading || !ideaText.trim()) && (
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      darkMode
                        ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600"
                        : "bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600"
                    }`} />
                  )}
                  
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Analyzing...
                    </div>
                  ) : (
                    <>
                      <span className="relative z-10">Analyze Idea (1 Credit)</span>
                      <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={() => navigate(-1)}
                  className={`sm:w-auto px-6 py-1 sm:py-2 rounded-xl font-bold text-xs sm:text-sm border-2 transition-all duration-300 ${
                    darkMode
                      ? "border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800/50"
                      : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <X className="w-4 h-4 inline mr-2" />
                  Cancel
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div 
          className={`rounded-3xl shadow-2xl backdrop-blur-xl  p-3 md:p-4 border ${
            darkMode
              ? "bg-gray-900/50 border-gray-800/50"
              : "bg-white/80 border-gray-200"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Gradient Glow */}
          <div className={`absolute -inset-1 rounded-3xl opacity-50 blur-2xl pointer-events-none ${
            darkMode
              ? "bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-fuchsia-600/20"
              : "bg-gradient-to-r from-violet-300/30 via-purple-300/30 to-fuchsia-300/30"
          }`} />

          <div className="relative">
            <div className="flex items-center mb-6 md:mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center mr-3 shadow-lg">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <h2 className={`text-sm md:text-base font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Tips for Better Analysis
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  className={`group relative py-2 px-2 rounded-2xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden ${
                    darkMode ? "bg-gray-800/50 border-gray-700/50" : "bg-white/80 border-gray-200"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* Glow Effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-br ${tip.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                  
                  <div className="relative flex items-start">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${tip.gradient} flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 flex-shrink-0`}>
                      <tip.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-sm font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {tip.title}
                      </h3>
                      <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Info */}
            <motion.div
              className={`mt-8 p-2 rounded-2xl backdrop-blur-sm border ${
                darkMode
                  ? 'bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border-cyan-500/20'
                  : 'bg-gradient-to-r from-cyan-100 to-blue-100 border-cyan-200'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div className="flex items-start">
                <Sparkles className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                <div>
                  <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>
                    Pro Tip
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    The more detailed and specific your description, the better our AI can analyze your idea's potential and provide actionable insights.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Insufficient Credits Modal */}
      <InsufficientCreditsModal
        isOpen={creditError?.show || false}
        onClose={handleCloseCreditModal}
        creditsRequired={creditError?.creditsRequired || 0}
        creditsAvailable={creditError?.creditsAvailable || 0}
      />
    </div>
  );
};

export default SubmitIdea;