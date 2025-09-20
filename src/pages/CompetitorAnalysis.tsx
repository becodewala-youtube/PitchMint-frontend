import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { AlertCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import InsufficientCreditsModal from '../components/modals/InsufficientCreditsModal';
import { clearError } from '../store/slices/ideaSlice';
import Markdown from 'react-markdown';

interface Competitor {
  name: string;
  description: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

interface Analysis {
  competitors: Competitor[];
  summary: string;
}

const CompetitorAnalysis = () => {
  const [ideaText, setIdeaText] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creditError, setCreditError] = useState<{
    show: boolean;
    creditsRequired: number;
    creditsAvailable: number;
  } | null>(null);
  
  const { token, user } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useTheme();
  const dispatch = useDispatch();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setCreditError(null);

      const response = await axios.post(
        `${API_URL}/api/competitors/analyze`,
        { ideaText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(response.data);
    } catch (err: any) {
      if (err.response?.status === 402) {
        setCreditError({
          show: true,
          creditsRequired: err.response.data.creditsRequired,
          creditsAvailable: err.response.data.creditsAvailable
        });
      } else {
        setError(err.response?.data?.message || 'Failed to analyze competitors');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCreditModal = () => {
    setCreditError(null);
  };

  return (
    <div className={`page-container ${darkMode ? 'page-container-dark' : 'page-container-light'}`}>
      {/* Animated Background */}
      <div className="bg-animated">
        <div className={`bg-orb ${darkMode ? 'bg-orb-1' : 'bg-orb-light-1'}`}></div>
        <div className={`bg-orb ${darkMode ? 'bg-orb-2' : 'bg-orb-light-2'}`}></div>
      </div>

      <div className="content-wrapper">
        <div className="max-container">
          {/* Header */}
          <motion.div 
            className="page-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="icon-container icon-cyan mx-auto mb-4">
              <Search className="h-5 w-5 text-white" />
            </div>
           <h1 className={`page-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>
  Competitor
  <span className="ml-2 text-gradient-primary">
    Analysis
  </span>
</h1>

            <p className={`page-subtitle text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Analyze your competition and understand the market landscape
            </p>
          </motion.div>

          {/* Main Form */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} px-5 py-4 sm:py-5 mb-12`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleAnalyze}>
              <div className="mb-6">
                <label
                  htmlFor="idea"
                  className={`block text-md sm:text-lg font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Describe your startup idea
                </label>
                <textarea
                  id="idea"
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  rows={6}
                  className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
                  placeholder="Enter your startup idea for competitor analysis..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading || !ideaText.trim()}
                className={`w-full btn-primary btn-primary-cyan text-xs sm:text-sm ${
                  (loading || !ideaText.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={!(loading || !ideaText.trim()) ? { scale: 1.05 } : {}}
                whileTap={!(loading || !ideaText.trim()) ? { scale: 0.95 } : {}}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="loading-spinner mr-3" />
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Search className="w-4 sm:w-6 h-4 sm:h-6 mr-3" />
                    Analyze Competitors (1 Credit)
                  </div>
                )}
              </motion.button>
            </form>

            {error && (
              <motion.div 
                className="mt-6 p-4 bg-red-100 text-red-700 rounded-2xl border border-red-200"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Results */}
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Analysis Results
              </h2>
              
              {/* Summary */}
              <motion.div 
                className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} px-6 sm:px-8 py-6 mb-6`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h3 className={`text-md sm:text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                  <div className="dot-indicator bg-blue-500"></div>
                  Market Overview
                </h3>
                <p className={`text-xs sm:text-sm text-justify ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                  <Markdown>{analysis.summary}</Markdown>
                </p>
              </motion.div>

              {/* Competitors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {analysis.competitors.map((competitor, index) => (
                  <motion.div
                    key={index}
                    className={`group card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} card-hover px-8 py-6`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="card-hover-effect"></div>
                    <div className="relative">
                      <h3 className={`text-md sm:text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-green-500 transition-colors duration-300`}>
                        {competitor.name}
                      </h3>
                      <p className={`mb-6 text-xs sm:text-sm text-justify ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                        {competitor.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Strengths */}
                        <div>
                          <h4 className="font-bold mb-3 text-green-500 flex items-center text-sm">
                            <div className="dot-indicator bg-green-500"></div>
                            Strengths
                          </h4>
                          <ul className="space-y-2">
                            {competitor.swot.strengths.map((strength, i) => (
                              <li key={i} className={`text-xs sm:text-sm text-justify ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-start`}>
                                <span className="text-green-500 mr-2">•</span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Weaknesses */}
                        <div>
                          <h4 className="font-bold mb-3 text-red-500 flex items-center text-sm">
                            <div className="dot-indicator bg-red-500"></div>
                            Weaknesses
                          </h4>
                          <ul className="space-y-2">
                            {competitor.swot.weaknesses.map((weakness, i) => (
                              <li key={i} className={`text-xs sm:text-sm text-justify ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-start`}>
                                <span className="text-red-500 mr-2">•</span>
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Opportunities */}
                        <div>
                          <h4 className="font-bold mb-3 text-blue-500 flex items-center text-sm">
                            <div className="dot-indicator bg-blue-500"></div>
                            Opportunities
                          </h4>
                          <ul className="space-y-2">
                            {competitor.swot.opportunities.map((opportunity, i) => (
                              <li key={i} className={`text-xs sm:text-sm text-justify ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-start`}>
                                <span className="text-blue-500 mr-2">•</span>
                                {opportunity}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Threats */}
                        <div>
                          <h4 className="font-bold mb-3 text-orange-500 flex items-center text-sm">
                            <div className="dot-indicator bg-orange-500"></div>
                            Threats
                          </h4>
                          <ul className="space-y-2">
                            {competitor.swot.threats.map((threat, i) => (
                              <li key={i} className={`text-xs sm:text-sm text-justify ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-start`}>
                                <span className="text-orange-500 mr-2">•</span>
                                {threat}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
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

export default CompetitorAnalysis;