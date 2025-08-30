import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getIdea, generateCanvas, clearError } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { RefreshCw, AlertCircle, Layout } from 'lucide-react';
import CanvasSkeleton from '../components/skeleton/CanvasSkeleton';
import { motion } from 'framer-motion';
import InsufficientCreditsModal from '../components/modals/InsufficientCreditsModal';
import ReactMarkdown from 'react-markdown';

const Canvas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  
  const { currentIdea: idea, loading, error, creditError } = useSelector((state: RootState) => state.idea);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getIdea(id) as any);
    }
  }, [dispatch, id]);

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
      <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-8 py-12">
        {[...Array(6)].map((_, idx) => (
          <CanvasSkeleton key={idx} />
        ))}
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

  if (!idea) {
    return null;
  }

  const canvasContent = idea.canvasContent || {};

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
                <div className={`w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mr-4`}>
                  <Layout className="h-4 w-4 text-white" />
                </div>
                <h1 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Business Model Canvas
                </h1>
              </div>
              <p className={`text-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Lean startup methodology visualization
              </p>
            </div>
            <motion.button
              onClick={handleGenerateCanvas}
              disabled={loading || isGenerating}
              className="inline-flex items-center px-6 py-3 rounded-2xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`mr-2 h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating... (1 Credit)' : 'Regenerate (1 Credit)'}
            </motion.button>
          </motion.div>

          {Object.keys(canvasContent).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Problem & Customer Segments */}
              <motion.div 
                className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm p-8 rounded-3xl shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-red-500/50 transition-all duration-500 hover:scale-105`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Problem
                    </h2>
                  </div>
             <p
  className={`prose prose-sm md:prose-base max-w-none text-justify leading-relaxed ${
    darkMode ? 'prose-invert text-gray-300' : 'text-gray-700'
  }`}
>
  <ReactMarkdown>
    {canvasContent.problem }
  </ReactMarkdown>
</p>


                  
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Customer Segments
                    </h2>
                  </div>
                  <p className={`text-justify text-sm md:text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    
                      <ReactMarkdown>
    {canvasContent.customerSegments}
  </ReactMarkdown>
                  </p>
                </div>
              </motion.div>

              {/* Solution & Value Proposition */}
              <motion.div 
                className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm p-8 rounded-3xl shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-green-500/50 transition-all duration-500 hover:scale-105`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Solution
                    </h2>
                  </div>
                  <p className={`mb-8 text-justify text-sm md:text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <ReactMarkdown>{canvasContent.solution}</ReactMarkdown>
                  </p>
                  
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Unique Value Proposition
                    </h2>
                  </div>
                  <p className={`text-justify text-sm md:text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <ReactMarkdown>{canvasContent.uniqueValueProposition}</ReactMarkdown>
                  </p>
                </div>
              </motion.div>

              {/* Key Metrics & Channels */}
              <motion.div 
                className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm p-8 rounded-3xl shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-yellow-500/50 transition-all duration-500 hover:scale-105`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></div>
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Key Metrics
                    </h2>
                  </div>
                  <p className={`mb-8 text-justify text-sm md:text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <ReactMarkdown>{canvasContent.keyMetrics}</ReactMarkdown>
                  </p>
                  
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 mr-3"></div>
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Channels
                    </h2>
                  </div>
                  <p className={`text-justify text-sm md:text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                   <ReactMarkdown>{canvasContent.channels}</ReactMarkdown>
                  </p>
                </div>
              </motion.div>

              {/* Cost Structure & Revenue Streams */}
              <motion.div 
                className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm p-8 rounded-3xl shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-orange-500/50 transition-all duration-500 hover:scale-105 md:col-span-2`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-3"></div>
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Cost Structure
                    </h2>
                  </div>
                  <p className={`mb-8 text-justify text-sm md:text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <ReactMarkdown>{canvasContent.costStructure}</ReactMarkdown>
                  </p>
                  
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-3"></div>
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Revenue Streams
                    </h2>
                  </div>
                  <p className={`text-justify text-sm md:text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <ReactMarkdown>{canvasContent.revenueStreams}</ReactMarkdown>
                  </p>
                </div>
              </motion.div>

              {/* Unfair Advantage */}
              <motion.div 
                className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm p-8 rounded-3xl shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-pink-500/50 transition-all duration-500 hover:scale-105`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 rounded-full bg-pink-500 mr-3"></div>
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Unfair Advantage
                    </h2>
                  </div>
                  <p className={`text-justify text-sm md:text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <ReactMarkdown>{canvasContent.unfairAdvantage}</ReactMarkdown>
                  </p>
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div 
              className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-8`}>
                <Layout className="h-12 w-12 text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {isGenerating ? 'Generating Canvas...' : 'No Business Model Canvas Available'}
              </h3>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {isGenerating ? 'Please wait while we create your business model canvas.' : 'Click the generate button to create your canvas.'}
              </p>
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