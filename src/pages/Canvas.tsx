import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getIdea, generateCanvas, clearError } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { RefreshCw, AlertCircle, Layout, Target, Users, Lightbulb, TrendingUp, MessageSquare, DollarSign, Zap } from 'lucide-react';
import CanvasSkeleton from '../components/skeleton/CanvasSkeleton';
import { motion } from 'framer-motion';
import InsufficientCreditsModal from '../components/modals/InsufficientCreditsModal';
import ReactMarkdown from 'react-markdown';

const Canvas = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  
  const { currentIdea: idea, loading, error, creditError } = useSelector((state: RootState) => state.idea);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (id && !idea) {
      dispatch(getIdea(id) as any);
    }
  }, [dispatch, id, idea]);

  const handleGenerateCanvas = async () => {
    if (id && !isGenerating && !loading) {
      try {
        setIsGenerating(true);
        await dispatch(generateCanvas(id) as any);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  useEffect(() => {
    if (idea && !idea.canvasContent && !loading && !isGenerating) {
      handleGenerateCanvas();
    }
  }, [idea, loading]);

  const handleCloseCreditModal = () => {
    dispatch(clearError());
  };

  if (loading || isGenerating) {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-8 py-12">
        {[...Array(6)].map((_, idx) => (
          <CanvasSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <AlertCircle className="h-10 w-10 text-white" />
          </div>
          <h3 className={`text-2xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Error</h3>
          <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!idea) {
    return null;
  }

  const canvasContent = idea.canvasContent || {};

  const canvasSections = [
    {
      title: 'Problem',
      content: canvasContent.problem,
      icon: Target,
      gradient: 'from-red-500 via-rose-500 to-pink-500',
      color: 'bg-red-500',
      span: 'md:col-span-1',
    },
    {
      title: 'Customer Segments',
      content: canvasContent.customerSegments,
      icon: Users,
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      color: 'bg-blue-500',
      span: 'md:col-span-1',
    },
    {
      title: 'Solution',
      content: canvasContent.solution,
      icon: Lightbulb,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      color: 'bg-emerald-500',
      span: 'md:col-span-1',
    },
    {
      title: 'Unique Value Proposition',
      content: canvasContent.uniqueValueProposition,
      icon: Zap,
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
      color: 'bg-violet-500',
      span: 'md:col-span-1',
    },
    {
      title: 'Key Metrics',
      content: canvasContent.keyMetrics,
      icon: TrendingUp,
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      color: 'bg-amber-500',
      span: 'md:col-span-1',
    },
    {
      title: 'Channels',
      content: canvasContent.channels,
      icon: MessageSquare,
      gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
      color: 'bg-cyan-500',
      span: 'md:col-span-1',
    },
    {
      title: 'Cost Structure',
      content: canvasContent.costStructure,
      icon: DollarSign,
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      color: 'bg-orange-500',
      span: 'md:col-span-2',
    },
    {
      title: 'Revenue Streams',
      content: canvasContent.revenueStreams,
      icon: DollarSign,
      gradient: 'from-emerald-500 via-green-500 to-teal-500',
      color: 'bg-emerald-500',
      span: 'md:col-span-2',
    },
    {
      title: 'Unfair Advantage',
      content: canvasContent.unfairAdvantage,
      icon: Zap,
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      color: 'bg-pink-500',
      span: 'md:col-span-2',
    },
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-violet-600/30 via-purple-600/20 to-fuchsia-600/30"
              : "bg-gradient-to-br from-violet-300/40 via-purple-300/30 to-fuchsia-300/40"
          }`}
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-cyan-600/30 via-blue-600/20 to-indigo-600/30"
              : "bg-gradient-to-br from-cyan-300/40 via-blue-300/30 to-indigo-300/40"
          }`}
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-pulse ${
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
      </div>

      <div className="relative z-10 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-left">
              <div className="flex items-center mb-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-2xl shadow-blue-500/50 flex items-center justify-center mr-4">
                  <Layout className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className={`text-2xl md:text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Business Model Canvas
                  </h1>
                  <p className={`text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Lean startup methodology visualization
                  </p>
                </div>
              </div>
            </div>
            <motion.button
              onClick={handleGenerateCanvas}
              disabled={loading || isGenerating}
              className={`group relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 shadow-xl overflow-hidden ${
                loading || isGenerating
                  ? "bg-gray-400 cursor-not-allowed"
                  : darkMode
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-blue-500/50 text-white"
                  : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:shadow-blue-500/50 text-white"
              }`}
              whileHover={!(loading || isGenerating) ? { scale: 1.02 } : {}}
              whileTap={!(loading || isGenerating) ? { scale: 0.98 } : {}}
            >
              {!(loading || isGenerating) && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600" />
              )}
              <RefreshCw className={`relative z-10 h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span className="relative z-10">
                {isGenerating ? 'Generating...' : 'Regenerate'} (1 Credit)
              </span>
            </motion.button>
          </motion.div>

          {Object.keys(canvasContent).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {canvasSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  className={`group relative p-6 md:p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden ${section.span} ${
                    darkMode ? "bg-gray-900/50 border-gray-800/50" : "bg-white/80 border-gray-200"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  {/* Gradient Glow */}
                  <div className={`absolute -inset-1 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                  
                  <div className="relative">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center mr-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <section.icon className="w-6 h-6 text-white" />
                      </div>
                      <h2 className={`text-base md:text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {section.title}
                      </h2>
                    </div>
                    
                    <div className={`prose prose-sm md:prose-base max-w-none text-justify leading-relaxed ${
                      darkMode ? 'prose-invert text-gray-300' : 'text-gray-700'
                    }`}>
                      <ReactMarkdown>{section.content || 'No content available'}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className={`rounded-3xl shadow-2xl backdrop-blur-xl p-12 md:p-16 text-center border ${
                darkMode
                  ? "bg-gray-900/50 border-gray-800/50"
                  : "bg-white/80 border-gray-200"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Gradient Glow */}
              <div className={`absolute -inset-1 rounded-3xl opacity-50 blur-2xl pointer-events-none ${
                darkMode
                  ? "bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20"
                  : "bg-gradient-to-r from-blue-300/30 via-indigo-300/30 to-purple-300/30"
              }`} />

              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-2xl shadow-blue-500/50 flex items-center justify-center mx-auto mb-8">
                  <Layout className="h-12 w-12 md:h-16 md:w-16 text-white" />
                </div>
                <h3 className={`text-2xl md:text-3xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {isGenerating ? 'Generating Canvas...' : 'No Business Model Canvas Available'}
                </h3>
                <p className={`text-base md:text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {isGenerating ? 'Please wait while we create your business model canvas.' : 'Click the generate button to create your canvas.'}
                </p>

                {isGenerating && (
                  <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
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

export default Canvas;