import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { getIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';

import IdeaAnalysisSkeleton from '../components/skeleton/IdeaAnalysisSkeleton';
import { FileText, Layout, AlertCircle, Users, MessageSquare, Sparkles, Target, TrendingUp, DollarSign, Award, CheckCircle2 } from 'lucide-react';
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
      <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 selection:bg-[#7c3aed]/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <IdeaAnalysisSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 flex items-center justify-center selection:bg-[#7c3aed]/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />
        <motion.div 
          className="relative z-10 text-center p-6 rounded-2xl bg-[#0a0a0a]/95 border border-white/10 max-w-sm mx-4 shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-3 text-red-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          <h3 className="text-[15px] font-semibold mb-1 text-white">Oops! Something went wrong</h3>
          <p className="text-[11px] text-gray-400 mb-4">{error}</p>
          <Link
            to="/saved-ideas"
            className="btn-primary inline-block py-1.5 px-4 rounded-lg text-xs font-semibold"
          >
            Back to Saved Ideas
          </Link>
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
      iconColor: 'text-violet-400',
      barColor: 'bg-gradient-to-r from-violet-500 to-purple-500',
      icon: Award,
      description: 'Total viability rating'
    },
    { 
      label: 'Market Demand', 
      value: idea.marketDemandScore, 
      iconColor: 'text-emerald-400',
      barColor: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      icon: TrendingUp,
      description: 'Market opportunity score'
    },
    { 
      label: 'Competition', 
      value: idea.competitionScore, 
      iconColor: 'text-amber-400',
      barColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
      icon: Target,
      description: 'Competitive landscape'
    },
    { 
      label: 'Monetization', 
      value: idea.monetizationFeasibilityScore, 
      iconColor: 'text-cyan-400',
      barColor: 'bg-gradient-to-r from-cyan-500 to-blue-500',
      icon: DollarSign,
      description: 'Revenue potential'
    }
  ];

  const analysisData = [
    { 
      title: 'Market Demand Analysis', 
      content: idea.analysis?.marketDemand?.text || 'No market demand data available.', 
      iconColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
      icon: TrendingUp
    },
    { 
      title: 'Competition Analysis', 
      content: idea.analysis?.competition?.text || 'No competition data available.', 
      iconColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/20',
      icon: Target
    },
    { 
      title: 'Monetization Analysis', 
      content: idea.analysis?.monetization?.text || 'No monetization data available.', 
      iconColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/20',
      icon: DollarSign
    },
    { 
      title: 'Overall Assessment', 
      content: idea.analysis?.overall?.text || 'No overall assessment available.', 
      iconColor: 'text-violet-400',
      badgeBg: 'bg-violet-500/10 border-violet-500/20',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 selection:bg-[#7c3aed]/30">
      {/* Subtle Dot Grid Background Pattern like Dashboard */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <motion.div 
          className="mb-5"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-inner flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[#7c3aed]" />
            </div>
            <div>
              <h1 className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-white">
                Idea Analysis Results
              </h1>
              <p className="text-[11px] sm:text-[12px] text-gray-400 font-normal">
                Comprehensive validation and insights
              </p>
            </div>
          </div>

          {/* Startup Idea Card */}
          <div className="rounded-[16px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-4 sm:p-5 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#7c3aed]/15 border border-[#7c3aed]/30 flex items-center justify-center flex-shrink-0 text-[#a78bfa]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h3 className="text-[13px] font-semibold mb-1 text-[#a78bfa]">
                  Your Startup Idea
                </h3>
                <p className="text-[12px] md:text-[13px] leading-relaxed text-gray-300">
                  {idea?.ideaText}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-white/5">
              <button
                onClick={handleGeneratePitchDeck}
                className="inline-flex items-center justify-center py-2 px-3 rounded-lg text-[11px] sm:text-[12px] font-medium bg-[#141414] hover:bg-[#1a1a1a] text-gray-200 hover:text-white border border-white/10 transition-colors gap-2"
              >
                <FileText className="h-3.5 w-3.5 text-[#7c3aed]" />
                <span>Pitch Deck</span>
              </button>

              <button
                onClick={handleGenerateCanvas}
                className="inline-flex items-center justify-center py-2 px-3 rounded-lg text-[11px] sm:text-[12px] font-medium bg-[#141414] hover:bg-[#1a1a1a] text-gray-200 hover:text-white border border-white/10 transition-colors gap-2"
              >
                <Layout className="h-3.5 w-3.5 text-cyan-400" />
                <span>Canvas</span>
              </button>

              <button
                onClick={handleCompetitorAnalysis}
                className="inline-flex items-center justify-center py-2 px-3 rounded-lg text-[11px] sm:text-[12px] font-medium bg-[#141414] hover:bg-[#1a1a1a] text-gray-200 hover:text-white border border-white/10 transition-colors gap-2"
              >
                <Users className="h-3.5 w-3.5 text-emerald-400" />
                <span>Competitors</span>
              </button>

              <button
                onClick={handlePitchSimulator}
                className="inline-flex items-center justify-center py-2 px-3 rounded-lg text-[11px] sm:text-[12px] font-medium bg-[#141414] hover:bg-[#1a1a1a] text-gray-200 hover:text-white border border-white/10 transition-colors gap-2"
              >
                <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
                <span>Practice</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Score Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {scoreData.map((score, index) => (
            <motion.div
              key={score.label}
              className="rounded-[14px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-3.5 sm:p-4 hover:border-white/20 transition-all shadow-sm"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center ${score.iconColor}`}>
                  <score.icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <h3 className="text-[11px] font-medium text-gray-400 mb-0.5">
                {score.label}
              </h3>
              <p className="text-[20px] sm:text-[22px] font-bold text-white tracking-tight mb-0.5">
                {score.value}%
              </p>
              <p className="text-[10px] sm:text-[11px] text-gray-500">
                {score.description}
              </p>

              {/* Progress Bar */}
              <div className="w-full mt-2.5 rounded-full h-1 bg-white/10 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${score.barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${score.value}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Analysis Section */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-4">
            <h2 className="text-[16px] sm:text-[18px] font-semibold text-white tracking-tight">
              Detailed Analysis
            </h2>
            <p className="text-[11px] sm:text-[12px] text-gray-400">
              In-depth breakdown of your startup idea
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {analysisData.map((analysis, index) => (
              <motion.div
                key={analysis.title}
                className="rounded-[14px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-4 sm:p-5 hover:border-white/20 transition-all shadow-sm"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className={`w-7 h-7 rounded-lg ${analysis.badgeBg} border flex items-center justify-center ${analysis.iconColor} flex-shrink-0`}>
                    <analysis.icon className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-[13px] font-semibold text-white">
                    {analysis.title}
                  </h3>
                </div>
                <p className="text-[11px] sm:text-[12px] leading-relaxed text-gray-300 font-normal">
                  {analysis.content}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IdeaResults;