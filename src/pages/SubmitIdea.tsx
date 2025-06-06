import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { submitIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { Brain, AlertCircle } from 'lucide-react';

const SubmitIdea = () => {
  const [ideaText, setIdeaText] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  
  const { loading, error } = useSelector((state: RootState) => state.idea);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(submitIdea({ ideaText }) as any);
    if (!result.error) {
      navigate(`/idea/${result.payload._id}`);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Brain className={`mx-auto h-12 w-12 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h1 className={`mt-2 text-xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Submit Your Startup Idea
          </h1>
          <p className={`mt-2 text-sm md:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Get instant AI-powered validation and analysis
          </p>
        </div>

        <div className={`mt-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow-lg`}>
          {error && (
            <div className="mb-4 flex items-center p-4 text-red-700 bg-red-100 rounded-lg" role="alert">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="idea"
                className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Describe your startup idea
              </label>
              <div className="mt-1">
                <textarea
                  id="idea"
                  name="idea"
                  rows={6}
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  placeholder="Example: A mobile app that uses AI to help people learn new languages through personalized, interactive conversations..."
                  className={`shadow-sm block w-full sm:text-sm border-gray-300 rounded-md px-2 ${
                    darkMode
                      ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
                      : 'bg-white text-gray-900 placeholder-gray-400'
                  } focus:ring-indigo-500 focus:border-indigo-500`}
                />
              </div>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Be specific about your idea's value proposition, target market, and how it solves a problem.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={loading || !ideaText.trim()}
                className={`flex-1 py-2  md:py-3 md:px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  (loading || !ideaText.trim()) && 'opacity-50 cursor-not-allowed'
                }`}
              >
                {loading ? 'Analyzing...' : 'Analyze Idea'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`py-2 md:py-3 px-4 border rounded-md shadow-sm text-sm font-medium ${
                  darkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className={`mt-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow-lg`}>
          <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Tips for a Better Analysis
          </h2>
          <ul className={`mt-4 space-y-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-indigo-500">•</span>
              <span className="ml-2">Be clear about the problem your idea solves</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-indigo-500">•</span>
              <span className="ml-2">Describe your target audience or market</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-indigo-500">•</span>
              <span className="ml-2">Explain how your solution is unique or better than existing alternatives</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-indigo-500">•</span>
              <span className="ml-2">Include potential revenue streams or business model ideas</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubmitIdea;