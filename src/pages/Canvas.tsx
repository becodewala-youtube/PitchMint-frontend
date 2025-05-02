import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getIdea, generateCanvas } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { RefreshCw, AlertCircle } from 'lucide-react';
import PitchDeckSkeleton from '../components/skeleton/CanvasSkeleton';

const Canvas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  
  const { currentIdea: idea, loading, error } = useSelector((state: RootState) => state.idea);
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

  if (loading || isGenerating) {
    return (
      <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(4)].map((_, idx) => (
          <PitchDeckSkeleton key={idx} />
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Business Model Canvas
          </h1>
          <button
            onClick={handleGenerateCanvas}
            disabled={loading || isGenerating}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`mr-2 h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Regenerate'}
          </button>
        </div>

        {Object.keys(canvasContent).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Problem & Customer Segments */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Problem
              </h2>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {canvasContent.problem}
              </p>
              
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Customer Segments
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {canvasContent.customerSegments}
              </p>
            </div>

            {/* Solution & Value Proposition */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Solution
              </h2>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {canvasContent.solution}
              </p>
              
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Unique Value Proposition
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {canvasContent.uniqueValueProposition}
              </p>
            </div>

            {/* Key Metrics & Channels */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Key Metrics
              </h2>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {canvasContent.keyMetrics}
              </p>
              
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Channels
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {canvasContent.channels}
              </p>
            </div>

            {/* Cost Structure & Revenue Streams */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg md:col-span-2`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Cost Structure
              </h2>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {canvasContent.costStructure}
              </p>
              
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Revenue Streams
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {canvasContent.revenueStreams}
              </p>
            </div>

            {/* Unfair Advantage */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Unfair Advantage
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {canvasContent.unfairAdvantage}
              </p>
            </div>
          </div>
        ) : (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 text-center`}>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {isGenerating ? 'Generating canvas...' : 'No business model canvas generated yet. Click the generate button to create one.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;