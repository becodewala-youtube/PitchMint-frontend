import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { AlertCircle, Search } from 'lucide-react';

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

const CompetitorAnalysis = () => {
  const [ideaText, setIdeaText] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { token } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useTheme();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${API_URL}/api/competitors/analyze`,
        { ideaText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze competitors');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Competitor Analysis
          </h1>
          <p className={`mt-2 text-sm md:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Analyze your competition and understand the market landscape
          </p>
        </div>

        <div className={`mt-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <form onSubmit={handleAnalyze}>
            <div className="mb-4">
              <label
                htmlFor="idea"
                className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Describe your startup idea
              </label>
              <textarea
                id="idea"
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                rows={4}
                className={`px-2 mt-1 block w-full rounded-md shadow-sm ${
                  darkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                } focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter your startup idea for competitor analysis..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || !ideaText.trim()}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text- font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                (loading || !ideaText.trim()) && 'opacity-50 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Analyze Competitors
                </div>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            </div>
          )}

          {analysis && (
            <div className="mt-8">
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Analysis Results
              </h2>
              
              <div className={`p-4 rounded-md mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {analysis.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysis.competitors.map((competitor, index) => (
                  <div
                    key={index}
                    className={`${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    } rounded-lg p-6 shadow-md`}
                  >
                    <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {competitor.name}
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {competitor.description}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Strengths
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {competitor.swot.strengths.map((strength, i) => (
                            <li key={i} className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Weaknesses
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {competitor.swot.weaknesses.map((weakness, i) => (
                            <li key={i} className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Opportunities
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {competitor.swot.opportunities.map((opportunity, i) => (
                            <li key={i} className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              {opportunity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Threats
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {competitor.swot.threats.map((threat, i) => (
                            <li key={i} className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              {threat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetitorAnalysis;