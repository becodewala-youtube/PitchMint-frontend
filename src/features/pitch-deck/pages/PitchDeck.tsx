import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from '@/shared/hooks';
import {
  getIdea,
  generatePitchDeck,
  clearError,
} from '@/features/ideas/store/ideaSlice';
import { RootState } from '@/app/store';

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
import { exportAllSlidesToPDF } from '@/shared/utils/pdfExport';
import { motion } from "framer-motion";
import InsufficientCreditsModal from '@/features/credits/components/InsufficientCreditsModal';
import Markdown from "react-markdown";
import PitchDeckSkeleton from '@/features/pitch-deck/components/PitchDeckSkeleton';
import SlideThumbnails from '@/features/pitch-deck/components/SlideThumbnails';
import BackButton from '@/shared/components/ui/BackButton';

const PitchDeck = () => {
  const { id } = useParams();
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
    if (id && (!idea || idea._id !== id)) {
      dispatch(getIdea(id));
    }
  }, [dispatch, id, idea]);

  const handleRegeneratePitchDeck = useCallback(async () => {
    if (id && !isGenerating && !loading) {
      try {
        setIsGenerating(true);
        await dispatch(generatePitchDeck(id));
      } finally {
        setIsGenerating(false);
      }
    }
  }, [id, isGenerating, loading, dispatch]);

  useEffect(() => {
    if (idea && !idea.pitchDeckContent && !loading && !isGenerating) {
      handleRegeneratePitchDeck();
    }
  }, [idea, loading, handleRegeneratePitchDeck, isGenerating]);

  const handleExportPDF = async () => {
    if (!slides.length) return;

    try {
      setExportLoading(true);
      await exportAllSlidesToPDF(slides, `pitch-deck-${id}`, true);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Failed to export PDF:", error);
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

  if (loading || isGenerating || (idea && idea._id !== id)) {
    return (
      <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 selection:bg-[#7c3aed]/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <PitchDeckSkeleton />
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
    <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 selection:bg-[#7c3aed]/30">
      {/* Subtle Dot Grid Background Pattern like Dashboard */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <BackButton fallbackUrl="/saved-ideas" label="Back to Saved Ideas" />

        {/* Header */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-inner flex-shrink-0">
                <Presentation className="w-4 h-4 text-[#7c3aed]" />
              </div>
              <div>
                <h1 className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-white">
                  Pitch Deck
                </h1>
                <p className="text-[11px] sm:text-[12px] text-gray-400 font-normal flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#7c3aed]" />
                  Professional investor presentation
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
              <button
                onClick={handleExportPDF}
                disabled={loading || exportLoading || !slides.length}
                className="flex-1 sm:flex-initial px-3.5 py-1.5 sm:py-2 bg-[#141414] hover:bg-[#1a1a1a] text-white border border-white/10 text-[11px] sm:text-[12px] font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Download className={`w-3.5 h-3.5 ${exportLoading ? "animate-spin" : ""}`} />
                <span>{exportLoading ? "Exporting..." : "Export PDF"}</span>
              </button>

              <button
                onClick={handleRegeneratePitchDeck}
                disabled={loading || isGenerating}
                className="btn-primary flex-1 sm:flex-initial px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-[12px] font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                <span>{isGenerating ? "Generating..." : "Regenerate"}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {slides.length > 0 ? (
          <motion.div
            id="pitch-deck-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Main Slide Card */}
            <div className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden mb-4">
              {/* Slide Navigation Header */}
              <div className="flex justify-between items-center px-4 sm:px-6 py-2.5 border-b border-white/10 bg-[#141414]/50">
                <button
                  onClick={prevSlide}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] text-gray-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="text-center">
                  <div className="text-[11px] sm:text-[12px] font-medium text-gray-400 mb-0.5">
                    Slide {currentSlide + 1} of {slides.length}
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-[#7c3aed]/15 text-[#a78bfa] border border-[#7c3aed]/30">
                    {slides[currentSlide].title}
                  </span>
                </div>

                <button
                  onClick={nextSlide}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] text-gray-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Current Slide Content */}
              <div className="px-5 sm:px-8 py-5 sm:py-6 min-h-[260px] sm:min-h-[300px]">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35 }}
                  className="relative"
                >
                  {/* Slide Title with Accent Bar */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-1 h-5 sm:h-6 rounded-full bg-[#7c3aed]" />
                    <h2 className="text-[16px] sm:text-[18px] font-semibold text-white tracking-tight">
                      {slides[currentSlide].title}
                    </h2>
                  </div>

                  {/* Slide Content */}
                  <div className="prose prose-invert max-w-none text-[12px] sm:text-[13px] leading-relaxed text-gray-300 font-normal">
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
            className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-8 sm:p-12 text-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#141414] border border-white/10 flex items-center justify-center mx-auto mb-3 text-[#7c3aed] shadow-inner">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-[16px] sm:text-[18px] font-semibold mb-1.5 text-white">
              {isGenerating
                ? "Generating Your Pitch Deck..."
                : "No Pitch Deck Available"}
            </h3>
            <p className="text-[11px] sm:text-[12px] mb-5 text-gray-400 max-w-md mx-auto leading-relaxed">
              {isGenerating
                ? "Please wait while we create your professional pitch deck with AI-powered insights."
                : "Generate a comprehensive, investor-ready pitch presentation for this idea."}
            </p>
            {!isGenerating && (
              <button
                onClick={handleRegeneratePitchDeck}
                disabled={loading}
                className="btn-primary inline-flex items-center py-2 px-5 rounded-lg text-[12px] font-semibold gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Pitch Deck (1 Credit)</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
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
