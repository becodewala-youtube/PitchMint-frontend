import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { AlertCircle, Search, TrendingUp, Target, Shield, Zap, X, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import InsufficientCreditsModal from '../components/modals/InsufficientCreditsModal';
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
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        
       

        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-cyan-200/10 to-transparent'}`} />
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        <div className="absolute top-20 left-[10%] w-2 h-2 bg-cyan-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4 text-center">
              
              <div>
                <h1 className={`text-xl md:text-2xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Competitor{" "}
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                    Analysis
                  </span>
                </h1>
                <p className={`text-xs md:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} font-medium flex items-center gap-2 justify-center`}>
                  <Zap className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
                  Analyze competition and understand market landscape
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div 
            className={`mb-6 p-4 rounded-2xl ${darkMode ? 'bg-red-900/30 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-white" />
                </div>
                <span className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'}`}>{error}</span>
              </div>
              <button 
                onClick={() => setError(null)}
                className={`text-sm font-bold ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition-colors`}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        {/* Main Form */}
        <motion.div 
          className={`${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-3 md:px-4 md:py-4 mb-8`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center shadow-xl">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h2 className={`text-sm sm:text-md font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Enter Your Startup Idea
            </h2>
          </div>

          <form onSubmit={handleAnalyze}>
            <div className="mb-4 sm:mb-6">
              
              <textarea
                id="idea"
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                rows={5}
                className={`w-full px-4 py-3 text-sm rounded-2xl border-2 transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-800/50 text-white border-gray-700 placeholder-gray-500 focus:border-cyan-500 focus:bg-gray-800'
                    : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:border-cyan-500 focus:bg-gray-50'
                } focus:ring-4 focus:ring-cyan-500/20 focus:outline-none`}
                placeholder="Describe your startup idea in detail. Include your target market, unique value proposition, and key features..."
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading || !ideaText.trim()}
              className={`w-full py-2 px-8 rounded-2xl text-xs font-bold text-white transition-all duration-300 ${
                loading || !ideaText.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 hover:shadow-xl hover:shadow-cyan-500/50'
              }`}
              whileHover={!(loading || !ideaText.trim()) ? { scale: 1.02 } : {}}
              whileTap={!(loading || !ideaText.trim()) ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                  Analyzing Competitors...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Search className="w-4 h-4 mr-3" />
                  Analyze Competitors (1 Credit)
                </div>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Results */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Results Header */}
            <motion.div 
              className={`${darkMode ? 'bg-gradient-to-r from-cyan-600/10 via-teal-600/10 to-emerald-600/10 border border-cyan-500/20' : 'bg-gradient-to-r from-cyan-100 via-teal-100 to-emerald-100 border border-cyan-200'} rounded-3xl p-6 text-center mb-8`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Analysis Complete!
                </h2>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Comprehensive competitive landscape and SWOT analysis
              </p>
            </motion.div>
            
            {/* Market Overview */}
            <motion.div 
              className={`${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 mb-8`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Market Overview
                </h3>
              </div>
              <div className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Markdown>{analysis.summary}</Markdown>
              </div>
            </motion.div>

            {/* Competitors Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analysis.competitors.map((competitor, index) => (
                <motion.div
                  key={index}
                  className={`group relative overflow-hidden ${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-6 hover:scale-[1.02] transition-all duration-500`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                >
                  {/* Gradient Glow */}
                  <div className={`absolute -inset-1 bg-gradient-to-br from-cyan-600 to-teal-600 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

                  <div className="relative">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center shadow-xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <span className="text-xl font-black text-white">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className={`text-lg font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {competitor.name}
                        </h3>
                        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {competitor.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                      {/* Strengths */}
                      <div className={`p-4 rounded-2xl ${darkMode ? 'bg-green-900/20 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                        <h4 className="font-bold mb-3 text-green-500 flex items-center text-sm">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Strengths
                        </h4>
                        <ul className="space-y-2">
                          {competitor.swot.strengths.map((strength, i) => (
                            <li key={i} className={`text-xs flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <span className="text-green-500 mr-2 mt-1">•</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Weaknesses */}
                      <div className={`p-4 rounded-2xl ${darkMode ? 'bg-red-900/20 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
                        <h4 className="font-bold mb-3 text-red-500 flex items-center text-sm">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Weaknesses
                        </h4>
                        <ul className="space-y-2">
                          {competitor.swot.weaknesses.map((weakness, i) => (
                            <li key={i} className={`text-xs flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <span className="text-red-500 mr-2 mt-1">•</span>
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Opportunities */}
                      <div className={`p-4 rounded-2xl ${darkMode ? 'bg-blue-900/20 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                        <h4 className="font-bold mb-3 text-blue-500 flex items-center text-sm">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Opportunities
                        </h4>
                        <ul className="space-y-2">
                          {competitor.swot.opportunities.map((opportunity, i) => (
                            <li key={i} className={`text-xs flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <span className="text-blue-500 mr-2 mt-1">•</span>
                              <span>{opportunity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Threats */}
                      <div className={`p-4 rounded-2xl ${darkMode ? 'bg-orange-900/20 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'}`}>
                        <h4 className="font-bold mb-3 text-orange-500 flex items-center text-sm">
                          <Shield className="w-4 h-4 mr-2" />
                          Threats
                        </h4>
                        <ul className="space-y-2">
                          {competitor.swot.threats.map((threat, i) => (
                            <li key={i} className={`text-xs flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <span className="text-orange-500 mr-2 mt-1">•</span>
                              <span>{threat}</span>
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