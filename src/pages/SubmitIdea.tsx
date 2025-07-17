import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { submitIdea, clearError } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { Brain, AlertCircle } from 'lucide-react';
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

  return (
    <div className={`page-container ${darkMode ? 'page-container-dark' : 'page-container-light'}`}>
      {/* Animated Background */}
      <div className="bg-animated">
        <div className={`bg-orb ${darkMode ? 'bg-orb-1' : 'bg-orb-light-1'}`}></div>
        <div className={`bg-orb ${darkMode ? 'bg-orb-2' : 'bg-orb-light-2'}`}></div>
      </div>

      <div className="content-wrapper">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            className="page-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="icon-container icon-cyan mx-auto mb-8">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className={`page-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Submit Your
              <span className=" ml-2 text-gradient-primary">
                Startup Idea
              </span>
            </h1>
            <p className={`page-subtitle ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Get instant AI-powered validation and analysis
            </p>
          </motion.div>

          {/* Main Form */}
          <motion.div 
            className={`card-glass  ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {error && (
              <motion.div 
                className="mb-6 flex items-center p-4 text-red-700 bg-red-100 rounded-2xl border border-red-200" 
                role="alert"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="h-5 w-5 mr-3" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label
                  htmlFor="idea"
                  className={`block text-lg font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Describe your startup idea
                </label>
                <textarea
                  id="idea"
                  name="idea"
                  rows={6}
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  placeholder="Example: A mobile app that uses AI to help people learn new languages through personalized, interactive conversations..."
                  className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
                />
                <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Be specific about your idea's value proposition, target market, and how it solves a problem.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  type="submit"
                  disabled={loading || !ideaText.trim()}
                  className={`flex-1 btn-primary btn-primary-cyan ${
                    (loading || !ideaText.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  whileHover={!(loading || !ideaText.trim()) ? { scale: 1.05 } : {}}
                  whileTap={!(loading || !ideaText.trim()) ? { scale: 0.95 } : {}}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner mr-3" />
                      Analyzing...
                    </div>
                  ) : (
                    'Analyze Idea (1 Credit)'
                  )}
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={() => navigate(-1)}
                  className={`btn-secondary ${darkMode ? 'btn-secondary-dark' : 'btn-secondary-light'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Tips Section */}
          <motion.div 
            className={`mt-12 card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Tips for Better Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Be clear about the problem your idea solves',
                'Describe your target audience or market',
                'Explain how your solution is unique or better than existing alternatives',
                'Include potential revenue streams or business model ideas'
              ].map((tip, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mr-4 mt-1">
                    <span className="text-white font-bold text-xs">{index + 1}</span>
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {tip}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
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