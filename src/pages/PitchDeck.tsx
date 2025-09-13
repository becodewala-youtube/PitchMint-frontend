import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getIdea, generatePitchDeck, clearError } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle, Download, FileText, Users } from 'lucide-react';
import { exportAllSlidesToPDF } from '../utils/pdfExport';
import { motion } from 'framer-motion';
import InsufficientCreditsModal from '../components/modals/InsufficientCreditsModal';
import Markdown from 'react-markdown';
import PitchDeckSkeleton from '../components/skeleton/PitchDeckSkeleton';

const PitchDeck = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  
  const { currentIdea: idea, loading, error, creditError } = useSelector((state: RootState) => state.idea);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getIdea(id) as any);
    }
  }, [dispatch, id]);

  const handleRegeneratePitchDeck = async () => {
    if (id && !isGenerating && !loading) {
      try {
        setIsGenerating(true);
        await dispatch(generatePitchDeck(id) as any);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  useEffect(() => {
    if (idea && !idea.pitchDeckContent && !loading && !isGenerating) {
      handleRegeneratePitchDeck();
    }
  }, [idea, loading]);

  const handleExportPDF = async () => {
    if (!slides.length) return;
    
    try {
      setExportLoading(true);
      await exportAllSlidesToPDF(slides, `pitch-deck-${id}`, darkMode);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const nextSlide = () => {
    if (slides.length) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };

  const prevSlide = () => {
    if (slides.length) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const handleCloseCreditModal = () => {
    dispatch(clearError());
  };

  if (loading || isGenerating) {
    return (
      <div className='px-8 py-4'>
        <PitchDeckSkeleton />
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

  const slides = idea.pitchDeckContent ? [
    { title: 'Problem', content: idea.pitchDeckContent.problem },
    { title: 'Solution', content: idea.pitchDeckContent.solution },
    { title: 'Market Size', content: idea.pitchDeckContent.marketSize },
    { title: 'Business Model', content: idea.pitchDeckContent.businessModel },
    { title: 'Competition', content: idea.pitchDeckContent.competitors },
    { title: 'Go-to-Market Strategy', content: idea.pitchDeckContent.goToMarket },
    { title: 'Team', content: idea.pitchDeckContent.team },
    { title: 'Financials', content: idea.pitchDeckContent.financials },
    { title: 'Milestones', content: idea.pitchDeckContent.milestones },
    { title: 'Ask & Use of Funds', content: idea.pitchDeckContent.askAndUse }
  ] : [];

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
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <div className="icon-container icon-purple mr-4">
                  <FileText className="h-8 w-8 text-cyan-400" />
                </div>
                <h1 className={`text-xl md:text-2xl font-bold text-gradient-primary `}>
                  Pitch Deck
                </h1>
              </div>
              <p className={`text-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Professional investor presentation
              </p>
            </div>
            <div className="flex flex-row sm:flex-row gap-4">
              <motion.button
                onClick={handleExportPDF}
                disabled={loading || exportLoading || !slides.length}
                className="btn-primary btn-primary-cyan mt-4 flex disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className={`sm:mr-2  h-5 w-5 ${exportLoading ? 'animate-spin' : ''}`} />
                {exportLoading ? 'Exporting...' : 'Export PDF'}
              </motion.button>

              {/* future enhancement feature and as of now i stopped at tis point of time and will do in later */}
              {/* <motion.button
                onClick={() => navigate(`/collaborative-pitch/${id}`)}
                disabled={loading || !slides.length}
                className="btn-primary btn-primary-green mt-4 flex disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="sm:mr-2 h-5 w-5" />
                Collaborate
              </motion.button> */}
              <motion.button
                onClick={handleRegeneratePitchDeck}
                disabled={loading || isGenerating}
                className="btn-primary btn-primary-cyan flex mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className={`sm:mr-2 mr-1 h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Generating... (1 Credit)' : 'Regenerate (1 Credit)'}
              </motion.button>
            </div>
          </motion.div>

          {slides.length > 0 ? (
            <motion.div 
              id="pitch-deck-content" 
              className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Slide Navigation */}
              <div className="flex justify-between items-center px-6 border-b border-gray-200/20">
                <motion.button
                  onClick={prevSlide}
                  className={`p-3 rounded-2xl hover-lift-sm ${
                    darkMode
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </motion.button>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Slide {currentSlide + 1} of {slides.length}
                </span>
                <motion.button
                  onClick={nextSlide}
                  className={`p-3 rounded-2xl hover-lift-sm ${
                    darkMode
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="h-6 w-6" />
                </motion.button>
              </div>

              {/* Current Slide */}
              <div className="px-8 py-6 min-h-[500px]">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold mb-4 text-gradient-primary">
                    {slides[currentSlide].title}
                  </h2>
                  <div className={`text-md text-justify whitespace-pre-wrap leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Markdown>{slides[currentSlide].content}</Markdown>
                  </div>
                </motion.div>
              </div>

              {/* Slide Thumbnails */}
              <div className="p-6 border-t border-gray-200/20">
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {slides.map((slide, index) => (
                    <motion.button
                      key={slide.title}
                      onClick={() => setCurrentSlide(index)}
                      className={`p-3 text-xs rounded-xl hover-lift-sm ${
                        currentSlide === index
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                          : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {slide.title}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-12 text-center`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="icon-container-lg icon-purple mx-auto mb-8">
                <FileText className="h-12 w-12 text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {isGenerating ? 'Generating Pitch Deck...' : 'No Pitch Deck Available'}
              </h3>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {isGenerating ? 'Please wait while we create your professional pitch deck.' : 'Click the generate button to create your pitch deck.'}
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

export default PitchDeck;