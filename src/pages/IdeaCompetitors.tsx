import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { AlertCircle, RefreshCw, Users, Target, TrendingUp, Shield, AlertTriangle, Sparkles, CheckCircle2, XCircle, Lightbulb, Zap } from 'lucide-react';
import CompetitorAnalysisSkeleton from '../components/skeleton/CompetitorSkeleton';
import { motion } from 'framer-motion';

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

const IdeaCompetitors = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const hasAnalyzedRef = useRef(false);

  
  const { currentIdea: idea, loading: ideaLoading } = useSelector((state: RootState) => state.idea);
  const { token } = useSelector((state: RootState) => state.auth);
  
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && !idea) {
      dispatch(getIdea(id) as any);
    }
  }, [dispatch, id, idea]);

  useEffect(() => {
    if (idea?.competitorAnalysis) {
      setAnalysis(idea.competitorAnalysis);
    }
  }, [idea]);

  const analyzeCompetitors = async (regenerate = false) => {
    if (!idea?.ideaText) return;
    
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${API_URL}/api/competitors/analyze/${idea._id}`,
        { regenerate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(response.data.competitorAnalysis);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze competitors');
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (!idea || loading) return;

  // If already analyzed once or competitorAnalysis exists, skip
  if (hasAnalyzedRef.current || idea.competitorAnalysis) return;

  hasAnalyzedRef.current = true;
  analyzeCompetitors(false);
}, [idea, loading]);


  if (ideaLoading || loading) {
    return (
      <div className='px-8 py-6'>
        <CompetitorAnalysisSkeleton />
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

  if (!idea) return null;

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary Gradient Orbs */}
        <div
          className={`absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-emerald-600/30 via-teal-600/20 to-cyan-600/30"
              : "bg-gradient-to-br from-emerald-300/40 via-teal-300/30 to-cyan-300/40"
          }`}
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className={`absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-orange-600/30 via-amber-600/20 to-yellow-600/30"
              : "bg-gradient-to-br from-orange-300/40 via-amber-300/30 to-yellow-300/40"
          }`}
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        ></div>
        <div
          className={`absolute top-1/2 right-1/3 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20"
              : "bg-gradient-to-br from-blue-300/30 via-indigo-300/20 to-purple-300/30"
          }`}
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        ></div>

        {/* Mesh Gradient Overlay */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-emerald-200/10 to-transparent'}`} />
        
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        {/* Floating Elements */}
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-emerald-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
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
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-2xl ${darkMode ? 'shadow-emerald-500/50' : 'shadow-emerald-500/30'}`}>
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-2xl md:text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Competitor{" "}
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                      Analysis
                    </span>
                  </h1>
                </div>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium flex items-center gap-2 ml-15`}>
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Market landscape and competitive intelligence
              </p>
            </div>

            <motion.button
              onClick={() => analyzeCompetitors(true)}
              disabled={loading}
              className="group px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Regenerate Analysis
            </motion.button>
          </div>
        </motion.div>

        {/* Your Idea Card */}
        <motion.div 
          className={`relative overflow-hidden rounded-3xl p-6 mb-6 ${
            darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
          } backdrop-blur-xl`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 opacity-50"></div>
          <div className="relative">
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h2 className={`text-sm font-bold mb-2 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                  Your Startup Idea
                </h2>
                <p className={`text-sm md:text-base text-justify leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {idea.ideaText}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {analysis && (
          <>
            {/* Market Overview Card */}
            <motion.div 
              className={`relative overflow-hidden rounded-3xl p-6 mb-8 ${
                darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
              } backdrop-blur-xl`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg`}>
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Market Overview
                  </h2>
                </div>
                <p className={`text-sm md:text-base text-justify leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {analysis.summary}
                </p>
              </div>
            </motion.div>

            {/* Competitors Grid */}
            <div className="mb-6">
              <h2 className={`text-xl md:text-2xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Key{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Competitors
                </span>
              </h2>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Detailed SWOT analysis of {analysis.competitors.length} major competitors
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analysis.competitors.map((competitor, index) => (
                <motion.div
                  key={index}
                  className={`group relative overflow-hidden rounded-3xl p-6 ${
                    darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
                  } backdrop-blur-xl hover:scale-[1.02] transition-all duration-500`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500" />

                  <div className="relative">
                    {/* Competitor Header */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-800/50">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {competitor.name}
                      </h3>
                    </div>

                    <p className={`mb-6 text-sm text-justify leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {competitor.description}
                    </p>

                    {/* SWOT Analysis Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Strengths */}
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-emerald-900/20 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <h4 className="font-bold text-sm text-emerald-500">
                            Strengths
                          </h4>
                        </div>
                        <ul className="space-y-2">
                          {competitor.swot.strengths.map((strength, i) => (
                            <li key={i} className={`text-xs text-justify flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <Zap className="w-3 h-3 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Weaknesses */}
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-red-900/20 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                            <XCircle className="w-4 h-4 text-white" />
                          </div>
                          <h4 className="font-bold text-sm text-red-500">
                            Weaknesses
                          </h4>
                        </div>
                        <ul className="space-y-2">
                          {competitor.swot.weaknesses.map((weakness, i) => (
                            <li key={i} className={`text-xs text-justify flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <AlertCircle className="w-3 h-3 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Opportunities */}
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/20 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                            <Lightbulb className="w-4 h-4 text-white" />
                          </div>
                          <h4 className="font-bold text-sm text-blue-500">
                            Opportunities
                          </h4>
                        </div>
                        <ul className="space-y-2">
                          {competitor.swot.opportunities.map((opportunity, i) => (
                            <li key={i} className={`text-xs text-justify flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <TrendingUp className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                              {opportunity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Threats */}
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-orange-900/20 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                            <AlertTriangle className="w-4 h-4 text-white" />
                          </div>
                          <h4 className="font-bold text-sm text-orange-500">
                            Threats
                          </h4>
                        </div>
                        <ul className="space-y-2">
                          {competitor.swot.threats.map((threat, i) => (
                            <li key={i} className={`text-xs text-justify flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <Shield className="w-3 h-3 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
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
          </>
        )}
      </div>
    </div>
  );
};

export default IdeaCompetitors;