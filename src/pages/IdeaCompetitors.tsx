import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';

import api from '../utils/api';

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
  const dispatch = useAppDispatch();
  const hasAnalyzedRef = useRef(false);

  
  const { currentIdea: idea, loading: ideaLoading } = useSelector((state: RootState) => state.idea);
  const { token } = useSelector((state: RootState) => state.auth);
  
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && !idea) {
      dispatch(getIdea(id));
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

      const response = await api.post(
        `/api/competitors/analyze/${idea._id}`,
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
      <div className={`min-h-screen flex items-center justify-center bg-[#0a0118]`}>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/50">
            <AlertCircle className="h-10 w-10 text-white" />
          </div>
          <h3 className={`text-2xl font-black mb-2 text-white`}>Oops! Something went wrong</h3>
          <p className={`text-lg text-gray-400`}>{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!idea) return null;

  return (
    <div className={`min-h-screen relative overflow-hidden bg-[#0a0118]`}>
      <PageBackground theme="violet" />
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
              <div className="flex items-center gap-3 mb-1">
                <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/50`}>
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className={`text-md md:text-xl font-black text-white`}>
                    Competitor{" "}
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                      Analysis
                    </span>
                  </h1>
                </div>
              </div>
              <p className={`text-xs text-gray-400 font-medium flex items-center gap-2 ml-15`}>
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Market landscape and competitive intelligence
              </p>
            </div>

            <motion.button
              onClick={() => analyzeCompetitors(true)}
              disabled={loading}
              className="group px-4 py-1 sm:py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
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
          className={`relative overflow-hidden rounded-3xl p-3 mb-6 ${
            'bg-gray-900/50 border border-gray-800/50'
          } backdrop-blur-xl`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 opacity-50"></div>
          <div className="relative">
            <div className="flex items-start gap-3 mb-4">
              <div className={` hidden  w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 sm:flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h2 className={`text-sm font-bold mb-2 text-violet-400`}>
                  Your Startup Idea
                </h2>
                <p className={`text-xs md:text-sm text-justify leading-relaxed text-gray-300`}>
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
              className={`relative overflow-hidden rounded-3xl p-3 mb-8 ${
                'bg-gray-900/50 border border-gray-800/50'
              } backdrop-blur-xl`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg`}>
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <h2 className={`text-sm sm:text-md font-bold text-white`}>
                    Market Overview
                  </h2>
                </div>
                <p className={`text-xs md:text-sm text-justify leading-relaxed text-gray-300`}>
                  {analysis.summary}
                </p>
              </div>
            </motion.div>

            {/* Competitors Grid */}
            <div className="mb-6">
              <h2 className={`text-md md:text-lg font-black mb-1 text-white`}>
                Key{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Competitors
                </span>
              </h2>
              <p className={`text-xs mb-6 text-gray-400`}>
                Detailed SWOT analysis of {analysis.competitors.length} major competitors
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analysis.competitors.map((competitor, index) => (
                <motion.div
                  key={index}
                  className={`group relative overflow-hidden rounded-3xl p-3 ${
                    'bg-gray-900/50 border border-gray-800/50'
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
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 hidden sm:flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <h3 className={`text-sm font-bold text-white`}>
                        {competitor.name}
                      </h3>
                    </div>

                    <p className={`mb-6 text-xs text-justify leading-relaxed text-gray-300`}>
                      {competitor.description}
                    </p>

                    {/* SWOT Analysis Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Strengths */}
                      <div className={`p-4 rounded-xl bg-emerald-900/20 border border-emerald-500/20`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                            <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                          </div>
                          <h4 className="font-bold text-sm text-emerald-500">
                            Strengths
                          </h4>
                        </div>
                        <ul className="space-y-2">
                          {competitor.swot.strengths.map((strength, i) => (
                            <li key={i} className={`text-xs text-justify flex items-start text-gray-300`}>
                              <Zap className="w-3 h-3 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Weaknesses */}
                      <div className={`p-4 rounded-xl bg-red-900/20 border border-red-500/20`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                            <XCircle className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                          </div>
                          <h4 className="font-bold text-sm text-red-500">
                            Weaknesses
                          </h4>
                        </div>
                        <ul className="space-y-2">
                          {competitor.swot.weaknesses.map((weakness, i) => (
                            <li key={i} className={`text-xs text-justify flex items-start text-gray-300`}>
                              <AlertCircle className="w-3 h-3 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Opportunities */}
                      <div className={`p-4 rounded-xl bg-blue-900/20 border border-blue-500/20`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                            <Lightbulb className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                          </div>
                          <h4 className="font-bold text-sm text-blue-500">
                            Opportunities
                          </h4>
                        </div>
                        <ul className="space-y-2">
                          {competitor.swot.opportunities.map((opportunity, i) => (
                            <li key={i} className={`text-xs text-justify flex items-start text-gray-300`}>
                              <TrendingUp className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                              {opportunity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Threats */}
                      <div className={`p-4 rounded-xl bg-orange-900/20 border border-orange-500/20`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                            <AlertTriangle className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                          </div>
                          <h4 className="font-bold text-sm text-orange-500">
                            Threats
                          </h4>
                        </div>
                        <ul className="space-y-2">
                          {competitor.swot.threats.map((threat, i) => (
                            <li key={i} className={`text-xs text-justify flex items-start text-gray-300`}>
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