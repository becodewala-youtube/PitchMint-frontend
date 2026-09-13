import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { getIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';

import IdeaAnalysisSkeleton from '../components/skeleton/IdeaAnalysisSkeleton';
import { FileText, Layout, AlertCircle, Users, MessageSquare, Sparkles, Target, TrendingUp, DollarSign, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const IdeaResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentIdea: idea, loading, error } = useSelector((state: RootState) => state.idea);

  useEffect(() => {
    if (id && !idea) {
      dispatch(getIdea(id));
    }
  }, [dispatch, id, idea]);

  const handleGeneratePitchDeck = () => {
    if (id) {
      navigate(`/pitch-deck/${id}`);
    }
  };

  const handleGenerateCanvas = () => {
    if (id) {
      navigate(`/canvas/${id}`);
    }
  };

  const handleCompetitorAnalysis = () => {
    if (id) {
      navigate(`/competitors/${id}`);
    }
  };

  const handlePitchSimulator = () => {
    if (id) {
      navigate(`/pitch-simulator/${id}`);
    }
  };

  if (loading) {
    return (
      <div className='px-8 py-6'>
        <IdeaAnalysisSkeleton />
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

  if (!idea) {
    return null;
  }

  const scoreData = [
    { 
      label: 'Overall Score', 
      value: idea.overallScore, 
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
      bgGradient: 'from-violet-500/10 to-fuchsia-500/10',
      icon: Award,
      description: 'Total viability rating'
    },
    { 
      label: 'Market Demand', 
      value: idea.marketDemandScore, 
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      bgGradient: 'from-emerald-500/10 to-cyan-500/10',
      icon: TrendingUp,
      description: 'Market opportunity score'
    },
    { 
      label: 'Competition', 
      value: idea.competitionScore, 
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      bgGradient: 'from-amber-500/10 to-red-500/10',
      icon: Target,
      description: 'Competitive landscape'
    },
    { 
      label: 'Monetization', 
      value: idea.monetizationFeasibilityScore, 
      gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
      bgGradient: 'from-cyan-500/10 to-indigo-500/10',
      icon: DollarSign,
      description: 'Revenue potential'
    }
  ];

  const analysisData = [
    { 
      title: 'Market Demand Analysis', 
      content: idea.analysis.marketDemand.text, 
      gradient: 'from-emerald-500 to-teal-500',
      icon: TrendingUp
    },
    { 
      title: 'Competition Analysis', 
      content: idea.analysis.competition.text, 
      gradient: 'from-amber-500 to-orange-500',
      icon: Target
    },
    { 
      title: 'Monetization Analysis', 
      content: idea.analysis.monetization.text, 
      gradient: 'from-cyan-500 to-indigo-500',
      icon: DollarSign
    },
    { 
      title: 'Overall Assessment', 
      content: idea.analysis.overall.text, 
      gradient: 'from-violet-500 to-fuchsia-500',
      icon: Award
    }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden bg-[#0a0118]`}>
      <PageBackground theme="violet" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header Section */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-2xl shadow-violet-500/50`}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className={`text-mf md:text-lg font-black text-white`}>
                Idea Analysis{" "}
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Results
                </span>
              </h1>
              <p className={`text-xs text-gray-400 font-medium`}>
                Comprehensive validation and insights
              </p>
            </div>
          </div>

          {/* Idea Card */}
          <div className={`relative overflow-hidden rounded-3xl p-2 sm:p-3 mb-6 ${
            'bg-gray-900/50 border border-gray-800/50'
          } backdrop-blur-xl`}>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 opacity-50"></div>
            <div className="relative">
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-bold mb-1 text-violet-400`}>
                    Your Startup Idea
                  </h3>
                  <p className={`text-xs md:text-sm text-justify leading-relaxed text-gray-300`}>
                    {idea?.ideaText}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                <motion.button
                  onClick={handleGeneratePitchDeck}
                  className={`group/btn inline-flex items-center justify-center px-4 py-1 sm:py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    'bg-gray-800/50 text-gray-300 hover:bg-gradient-to-r hover:from-violet-600 hover:to-purple-600 hover:text-white border border-gray-700/50 hover:border-violet-500/50'
                  } hover:scale-105 hover:shadow-lg`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FileText className="h-4 w-4 mr-2 group-hover/btn:animate-pulse" />
                  Pitch Deck
                </motion.button>

                <motion.button
                  onClick={handleGenerateCanvas}
                  className={`group/btn inline-flex items-center justify-center px-4 py-1 sm:py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    'bg-gray-800/50 text-gray-300 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 hover:text-white border border-gray-700/50 hover:border-cyan-500/50'
                  } hover:scale-105 hover:shadow-lg`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Layout className="h-4 w-4 mr-2 group-hover/btn:animate-pulse" />
                  Canvas
                </motion.button>

                <motion.button
                  onClick={handleCompetitorAnalysis}
                  className={`group/btn inline-flex items-center justify-center px-4 py-1 sm:py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    'bg-gray-800/50 text-gray-300 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 hover:text-white border border-gray-700/50 hover:border-emerald-500/50'
                  } hover:scale-105 hover:shadow-lg`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Users className="h-4 w-4 mr-2 group-hover/btn:animate-pulse" />
                  Competitors
                </motion.button>

                <motion.button
                  onClick={handlePitchSimulator}
                  className={`group/btn inline-flex items-center justify-center px-4 py-1 sm:py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    'bg-gray-800/50 text-gray-300 hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-600 hover:text-white border border-gray-700/50 hover:border-orange-500/50'
                  } hover:scale-105 hover:shadow-lg`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageSquare className="h-4 w-4 mr-2 group-hover/btn:animate-pulse" />
                  Practice
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Score Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {scoreData.map((score, index) => (
            <motion.div
              key={score.label}
              className={`group relative overflow-hidden rounded-2xl md:rounded-3xl p-4 ${
                'bg-gray-900/50 border border-gray-800/50'
              } backdrop-blur-xl hover:scale-105 transition-all duration-500 cursor-pointer`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              {/* Gradient Background on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${score.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>

              {/* Glow Effect */}
              <div
                className={`absolute -inset-1 bg-gradient-to-br ${score.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-2">
                  <div
                    className={`w-6 sm:w-8 h-6 sm:h-8 rounded-xl bg-gradient-to-br ${score.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                  >
                    <score.icon className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                  </div>
                </div>

                <h3 className={`text-xs font-semibold mb-1 text-gray-400`}>
                  {score.label}
                </h3>
                <p className={`text-md sm:text-xl font-black mb-1 text-white`}>
                  {score.value}%
                </p>
                <p className={`text-xs text-gray-500`}>
                  {score.description}
                </p>

                {/* Progress Bar */}
                <div className={`w-full mt-2 sm:mt-4 rounded-full h-1 sm:h-2 bg-gray-800 overflow-hidden`}>
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${score.gradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score.value}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Detailed Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="mb-6">
            <h2 className={`text-md md:text-lg font-black mb-1 text-white`}>
              Detailed{" "}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                Analysis
              </span>
            </h2>
            <p className={`text-xs text-gray-400`}>
              In-depth breakdown of your startup idea
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analysisData.map((analysis, index) => (
              <motion.div
                key={analysis.title}
                className={`group relative overflow-hidden rounded-2xl p-3 ${
                  'bg-gray-900/50 border border-gray-800/50'
                } backdrop-blur-xl hover:scale-[1.02] transition-all duration-500`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Hover Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${analysis.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                <div className="relative">
                  <div className="flex items-center mb-2">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${analysis.gradient} flex items-center justify-center mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <analysis.icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className={`text-sm font-bold text-white`}>
                      {analysis.title}
                    </h3>
                  </div>
                  <p className={`text-xs text-justify leading-relaxed text-gray-300`}>
                    {analysis.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IdeaResults;