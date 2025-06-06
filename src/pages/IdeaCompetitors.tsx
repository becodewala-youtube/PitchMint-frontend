// src/pages/IdeaCompetitors.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { AlertCircle, RefreshCw } from 'lucide-react';
import CompetitorAnalysisSkeleton from '../components/skeleton/CompetitorSkeleton';

interface Competitor {
  name: string;
  description: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

interface Analysis {
  competitors: Competitor[];
  summary: string;
}

const IdeaCompetitors = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  
  const { currentIdea: idea, loading: ideaLoading } = useSelector((state: RootState) => state.idea);
  const { token } = useSelector((state: RootState) => state.auth);
  
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(getIdea(id) as any);
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (idea?.competitorAnalysis) {
      setAnalysis(idea.competitorAnalysis);
    }
  }, [idea]);

  const analyzeCompetitors = async (regenerate = false) => {
    if (!idea?.ideaText) return;
    
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${API_URL}/api/competitors/analyze/${idea._id}`,
        { regenerate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(response.data.competitorAnalysis);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze competitors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idea && !analysis && !loading) {
      analyzeCompetitors(false);
    }
  }, [idea]);

 


  if (ideaLoading || loading) {
    return (
      <>
      <div className='px-4 md:px-16'>
        <CompetitorAnalysisSkeleton />
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

  if (!idea) return null;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-sm md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Competitor Analysis
          </h1>
          <button
            onClick={()=> analyzeCompetitors (true)}
            disabled={loading}
            className="inline-flex items-center px-2 md:px-4 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Regenerate Analysis
          </button>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8`}>
          <h2 className={`md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Your Idea
          </h2>
          <p className={`text-sm md:text-lg text-justify ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {idea.ideaText}
          </p>
        </div>

        {analysis && (
          <>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8`}>
              <h2 className={`md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Market Overview
              </h2>
              <p className={`text-sm text-justify md:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {analysis.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.competitors.map((competitor, index) => (
                <div
                  key={index}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}
                >
                  <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {competitor.name}
                  </h3>
                  <p className={`mb-4 text-sm md:text-lg text-justify ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {competitor.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        Strengths
                      </h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {competitor.swot.strengths.map((strength, i) => (
                          <li key={i} className={`text-sm md:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        Weaknesses
                      </h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {competitor.swot.weaknesses.map((weakness, i) => (
                          <li key={i} className={`text-sm md:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        Opportunities
                      </h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {competitor.swot.opportunities.map((opportunity, i) => (
                          <li key={i} className={`text-sm md:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        Threats
                      </h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {competitor.swot.threats.map((threat, i) => (
                          <li key={i} className={`text-sm md:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {threat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IdeaCompetitors;