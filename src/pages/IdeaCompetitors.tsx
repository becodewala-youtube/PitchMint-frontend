import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { AlertCircle, RefreshCw, Users } from 'lucide-react';
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
  
  const { currentIdea: idea, loading: ideaLoading } = useSelector((state: RootState) => state.idea);
  const { token } = useSelector((state: RootState) => state.auth);
  
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(getIdea(id) as any);
    }
  }, [dispatch, id]);

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
    if (idea && !analysis && !loading) {
      analyzeCompetitors(false);
    }
  }, [idea]);

  if (ideaLoading || loading) {
    return (
      <div className='px-4 md:px-16'>
        <CompetitorAnalysisSkeleton />
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

  if (!idea) return null;

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
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center mr-4`}>
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Competitor Analysis
                </h1>
              </div>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Market landscape and competitive intelligence
              </p>
            </div>
            <motion.button
              onClick={() => analyzeCompetitors(true)}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 rounded-2xl text-sm font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-green-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              Regenerate Analysis
            </motion.button>
          </motion.div>

          {/* Your Idea */}
          <motion.div 
            className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-12 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
              Your Idea
            </h2>
            <p className={`text-sm md:text-lg text-justify leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {idea.ideaText}
            </p>
          </motion.div>

          {analysis && (
            <>
              {/* Market Overview */}
              <motion.div 
                className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-12 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                  Market Overview
                </h2>
                <p className={`text-sm md:text-lg text-justify leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {analysis.summary}
                </p>
              </motion.div>

              {/* Competitors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {analysis.competitors.map((competitor, index) => (
                  <motion.div
                    key={index}
                    className={`group relative ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-3xl shadow-2xl p-8 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-green-500/50 transition-all duration-500 hover:scale-105`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                      <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-green-500 transition-colors duration-300`}>
                        {competitor.name}
                      </h3>
                      <p className={`mb-8 text-sm md:text-base text-justify leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {competitor.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Strengths */}
                        <div>
                          <h4 className={`font-bold mb-3 text-green-500 flex items-center`}>
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            Strengths
                          </h4>
                          <ul className="space-y-2">
                            {competitor.swot.strengths.map((strength, i) => (
                              <li key={i} className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'} flex items-start`}>
                                <span className="text-green-500 mr-2">•</span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Weaknesses */}
                        <div>
                          <h4 className={`font-bold mb-3 text-red-500 flex items-center`}>
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            Weaknesses
                          </h4>
                          <ul className="space-y-2">
                            {competitor.swot.weaknesses.map((weakness, i) => (
                              <li key={i} className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'} flex items-start`}>
                                <span className="text-red-500 mr-2">•</span>
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Opportunities */}
                        <div>
                          <h4 className={`font-bold mb-3 text-blue-500 flex items-center`}>
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                            Opportunities
                          </h4>
                          <ul className="space-y-2">
                            {competitor.swot.opportunities.map((opportunity, i) => (
                              <li key={i} className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'} flex items-start`}>
                                <span className="text-blue-500 mr-2">•</span>
                                {opportunity}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Threats */}
                        <div>
                          <h4 className={`font-bold mb-3 text-orange-500 flex items-center`}>
                            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                            Threats
                          </h4>
                          <ul className="space-y-2">
                            {competitor.swot.threats.map((threat, i) => (
                              <li key={i} className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'} flex items-start`}>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaCompetitors;