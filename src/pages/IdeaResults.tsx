import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import IdeaAnalysisSkeleton from '../components/skeleton/IdeaAnalysisSkeleton';
import { FileText, Layout, BarChart as ChartBar, AlertCircle, Users, MessageSquare } from 'lucide-react';

const IdeaResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  
  const { currentIdea: idea, loading, error } = useSelector((state: RootState) => state.idea);

  useEffect(() => {
    if (id) {
      dispatch(getIdea(id) as any);
    }
  }, [dispatch, id]);

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
      <>
      <div className='px-8'>
        <IdeaAnalysisSkeleton />
      </div>
      </>
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

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Idea Overview */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8`}>
          <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Idea Analysis Results
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {idea?.ideaText}
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <button
              onClick={handleGeneratePitchDeck}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FileText className="mr-2 h-5 w-5" />
              Generate Pitch Deck
            </button>
            <button
              onClick={handleGenerateCanvas}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              <Layout className="mr-2 h-5 w-5" />
              Create Business Canvas
            </button>
            <button
              onClick={handleCompetitorAnalysis}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Users className="mr-2 h-5 w-5" />
              Analyze Competitors
            </button>
            <button
              onClick={handlePitchSimulator}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Practice Pitch
            </button>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Overall Score
            </h3>
            <p className={`text-4xl font-bold ${scoreColor(idea.overallScore)}`}>
              {idea.overallScore}%
            </p>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Market Demand
            </h3>
            <p className={`text-4xl font-bold ${scoreColor(idea.marketDemandScore)}`}>
              {idea.marketDemandScore}%
            </p>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Competition
            </h3>
            <p className={`text-4xl font-bold ${scoreColor(idea.competitionScore)}`}>
              {idea.competitionScore}%
            </p>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Monetization
            </h3>
            <p className={`text-4xl font-bold ${scoreColor(idea.monetizationFeasibilityScore)}`}>
              {idea.monetizationFeasibilityScore}%
            </p>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Detailed Analysis
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Market Demand Analysis
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {idea.analysis.marketDemand.text}
              </p>
            </div>
            
            <div>
              <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Competition Analysis
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {idea.analysis.competition.text}
              </p>
            </div>
            
            <div>
              <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Monetization Analysis
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {idea.analysis.monetization.text}
              </p>
            </div>
            
            <div>
              <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Overall Assessment
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {idea.analysis.overall.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaResults;