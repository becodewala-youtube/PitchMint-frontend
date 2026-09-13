import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/hooks";
import {
  getIdea,
  generatePitchDeck,
  clearError,
} from "../store/slices/ideaSlice";
import { RootState } from "../store";

import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Download,
  FileText,
  Sparkles,
  Presentation,
  ArrowRight,
} from "lucide-react";
import { exportAllSlidesToPDF } from "../utils/pdfExport";
import { motion } from "framer-motion";
import InsufficientCreditsModal from "../components/modals/InsufficientCreditsModal";
import Markdown from "react-markdown";
import PitchDeckSkeleton from "../components/skeleton/PitchDeckSkeleton";
import SlideThumbnails from "../components/pitch-deck/SlideThumbnails";

const PitchDeck = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    currentIdea: idea,
    loading,
    error,
    creditError,
  } = useSelector((state: RootState) => state.idea);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (id && !idea) {
      dispatch(getIdea(id));
    }
  }, [dispatch, id, idea]);

  const handleRegeneratePitchDeck = async () => {
    if (id && !isGenerating && !loading) {
      try {
        setIsGenerating(true);
        await dispatch(generatePitchDeck(id));
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
    } catch (error) { if (import.meta.env.DEV) console.error("Failed to export PDF:", error);
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
      <div className="px-8 py-6">
        <PitchDeckSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center bg-[#0a0118]`}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/50">
            <AlertCircle className="h-10 w-10 text-white" />
          </div>
          <h3
            className={`text-2xl font-black mb-2 text-white`}
          >
            Oops! Something went wrong
          </h3>
          <p
            className={`text-lg text-gray-400`}
          >
            {error}
          </p>
        </motion.div>
      </div>
    );
  }

  if (!idea) {
    return null;
  }

  const slides = idea.pitchDeckContent
    ? [
        {
          title: "Problem",
          content: idea.pitchDeckContent.problem,
          gradient: "from-red-500 to-pink-500",
        },
        {
          title: "Solution",
          content: idea.pitchDeckContent.solution,
          gradient: "from-emerald-500 to-teal-500",
        },
        {
          title: "Market Size",
          content: idea.pitchDeckContent.marketSize,
          gradient: "from-blue-500 to-indigo-500",
        },
        {
          title: "Business Model",
          content: idea.pitchDeckContent.businessModel,
          gradient: "from-purple-500 to-fuchsia-500",
        },
        {
          title: "Competition",
          content: idea.pitchDeckContent.competitors,
          gradient: "from-orange-500 to-amber-500",
        },
        {
          title: "Go-to-Market Strategy",
          content: idea.pitchDeckContent.goToMarket,
          gradient: "from-cyan-500 to-blue-500",
        },
        {
          title: "Team",
          content: idea.pitchDeckContent.team,
          gradient: "from-violet-500 to-purple-500",
        },
        {
          title: "Financials",
          content: idea.pitchDeckContent.financials,
          gradient: "from-green-500 to-emerald-500",
        },
        {
          title: "Milestones",
          content: idea.pitchDeckContent.milestones,
          gradient: "from-pink-500 to-rose-500",
        },
        {
          title: "Ask & Use of Funds",
          content: idea.pitchDeckContent.askAndUse,
          gradient: "from-indigo-500 to-violet-500",
        },
      ]
    : [];

  return (
    <div
      className={`min-h-screen relative overflow-hidden bg-[#0a0118]`}
    >
      <PageBackground theme="violet" />

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
                <div
                  className={`w-6 sm:w-8 h-6 sm:h-8 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-2xl shadow-violet-500/50`}
                >
                  <Presentation className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1
                    className={`text-lg md:text-xl font-black text-white`}
                  >
                    Pitch{" "}
                    <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                      Deck
                    </span>
                  </h1>
                </div>
              </div>
              <p
                className={`text-xs text-gray-400 font-medium flex items-center gap-2 ml-15`}
              >
                <Sparkles className="w-4 h-4 text-violet-400" />
                Professional investor presentation
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <motion.button
                onClick={handleExportPDF}
                disabled={loading || exportLoading || !slides.length}
                className="group px-4 py-21 sm:py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold sm:font-bold text-xs rounded-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download
                  className={`w-4 h-4 mr-2 ${exportLoading ? "animate-spin" : ""}`}
                />
                {exportLoading ? "Exporting..." : "Export PDF"}
              </motion.button>

              <motion.button
                onClick={handleRegeneratePitchDeck}
                disabled={loading || isGenerating}
                className="group px-4 py-1 sm:py-2 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-semibold sm:font-bold text-xs rounded-xl shadow-lg hover:shadow-xl hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`}
                />
                {isGenerating ? "Generating..." : "Regenerate (1 Credit)"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {slides.length > 0 ? (
          <motion.div
            id="pitch-deck-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Main Slide Card */}
            <div
              className={`relative overflow-hidden rounded-3xl mb-4 ${
                'bg-gray-900/50 border border-gray-800/50'
              } backdrop-blur-xl`}
            >
              {/* Slide Navigation Header */}
              <div
                className={`flex justify-between items-center px-6 py-1 border-b border-gray-800`}
              >
                <motion.button
                  onClick={prevSlide}
                  className={`group w-6 sm:w-8 h-6 sm:h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    'bg-gray-800/50 hover:bg-gradient-to-r hover:from-violet-600 hover:to-purple-600 text-gray-300 hover:text-white border border-gray-700/50'
                  } hover:scale-110`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </motion.button>

                <div className="text-center">
                  <div
                    className={`text-sm font-bold mb-1 text-white`}
                  >
                    Slide {currentSlide + 1} of {slides.length}
                  </div>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${slides[currentSlide].gradient} text-white`}
                  >
                    {slides[currentSlide].title}
                  </div>
                </div>

                <motion.button
                  onClick={nextSlide}
                  className={`group w-6 sm:w-8 h-6 sm:h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    'bg-gray-800/50 hover:bg-gradient-to-r hover:from-violet-600 hover:to-purple-600 text-gray-300 hover:text-white border border-gray-700/50'
                  } hover:scale-110`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Current Slide Content */}
              <div className="px-4 sm:px-8 py-2 sm:py-4 min-h-[300px]">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  {/* Slide Title with Gradient Accent */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-1 h-4 sm:h-6 rounded-full bg-gradient-to-b ${slides[currentSlide].gradient}`}
                    ></div>
                    <h2
                      className={`text-md md:text-xl font-black text-white`}
                    >
                      {slides[currentSlide].title}
                    </h2>
                  </div>

                  {/* Slide Content */}
                  <div
                    className={`prose prose-lg text-xs sm:text-sm max-w-none text-justify leading-relaxed ${
                      'prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-ul:text-gray-300'
                    }`}
                  >
                    <Markdown>{slides[currentSlide].content}</Markdown>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Slide Thumbnails */}
            <SlideThumbnails 
              slides={slides} 
              currentSlide={currentSlide} 
              setCurrentSlide={setCurrentSlide} 
            />
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className={`w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-500/50`}
            >
              <FileText className="h-12 w-12 text-white" />
            </div>
            <h3
              className={`text-2xl font-black mb-3 text-white`}
            >
              {isGenerating
                ? "Generating Your Pitch Deck..."
                : "No Pitch Deck Available"}
            </h3>
            <p
              className={`text-lg mb-8 text-gray-400 max-w-2xl mx-auto`}
            >
              {isGenerating
                ? "Please wait while we create your professional pitch deck with AI-powered insights."
                : "Click the generate button to create a comprehensive investor presentation."}
            </p>
            {!isGenerating && (
              <motion.button
                onClick={handleRegeneratePitchDeck}
                disabled={loading}
                className="group px-8 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-bold text-sm rounded-2xl shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-5 h-5 mr-3" />
                Generate Pitch Deck (1 Credit)
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            )}
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

export default PitchDeck;
