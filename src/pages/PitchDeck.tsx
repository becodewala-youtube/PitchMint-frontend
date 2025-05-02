import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getIdea, generatePitchDeck } from "../store/slices/ideaSlice";
import { RootState } from "../store";
import { useTheme } from "../contexts/ThemeContext";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Download,
} from "lucide-react";
import { exportToPDF } from "../utils/pdfExport";
import ReactMarkdown from "react-markdown";
import PitchDeckSkeleton from "../components/skeleton/PitchDeckSkeleton";

const PitchDeck = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();

  const {
    currentIdea: idea,
    loading,
    error,
  } = useSelector((state: RootState) => state.idea);
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
    if (!idea?.pitchDeckContent) return;

    try {
      setExportLoading(true);
      await exportToPDF("pitch-deck-content", `pitch-deck-${id}`);
    } catch (error) {
      console.error("Failed to export PDF:", error);
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

  if (loading || isGenerating) {
    return (
      <div>
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

  const slides = idea.pitchDeckContent
    ? [
        {
          title: "Problem",
          content: idea.pitchDeckContent.problem,
        },
        {
          title: "Solution",
          content: idea.pitchDeckContent.solution,
        },
        {
          title: "Market Size",
          content: idea.pitchDeckContent.marketSize,
        },
        {
          title: "Business Model",
          content: idea.pitchDeckContent.businessModel,
        },
        {
          title: "Competition",
          content: idea.pitchDeckContent.competitors,
        },
        {
          title: "Go-to-Market Strategy",
          content: idea.pitchDeckContent.goToMarket,
        },
        {
          title: "Team",
          content: idea.pitchDeckContent.team,
        },
        {
          title: "Financials",
          content: idea.pitchDeckContent.financials,
        },
        {
          title: "Milestones",
          content: idea.pitchDeckContent.milestones,
        },
        {
          title: "Ask & Use of Funds",
          content: idea.pitchDeckContent.askAndUse,
        },
      ]
    : [];

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } py-12`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Pitch Deck
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={handleExportPDF}
              disabled={loading || exportLoading || !slides.length}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download
                className={`mr-2 h-5 w-5 ${
                  exportLoading ? "animate-spin" : ""
                }`}
              />
              {exportLoading ? "Exporting..." : "Export PDF"}
            </button>
            <button
              onClick={handleRegeneratePitchDeck}
              disabled={loading || isGenerating}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`mr-2 h-5 w-5 ${isGenerating ? "animate-spin" : ""}`}
              />
              {isGenerating ? "Generating..." : "Regenerate"}
            </button>
          </div>
        </div>

        {slides.length > 0 ? (
          <div
            id="pitch-deck-content"
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-lg p-8`}
          >
            {/* Slide Navigation */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={prevSlide}
                className={`p-2 rounded-full ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Slide {currentSlide + 1} of {slides.length}
              </span>
              <button
                onClick={nextSlide}
                className={`p-2 rounded-full ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Current Slide */}
            <div className="min-h-[400px]">
              <h2
                className={`text-2xl font-bold mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {slides[currentSlide].title}
              </h2>
              <div
                className={`text-sm whitespace-pre-wrap ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <ReactMarkdown>{slides[currentSlide].content}</ReactMarkdown>
              </div>
            </div>

            {/* Slide Thumbnails */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  onClick={() => setCurrentSlide(index)}
                  className={`p-2 text-xs rounded ${
                    currentSlide === index
                      ? "bg-indigo-600 text-white"
                      : darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {slide.title}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-lg p-8 text-center`}
          >
            <p
              className={`text-lg ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {isGenerating
                ? "Generating pitch deck..."
                : "No pitch deck generated yet. Click the generate button to create one."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PitchDeck;
