import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { getSavedIdeas } from '../store/slices/ideaSlice';
import { useTheme } from '../contexts/ThemeContext';
import { Brain, FileText, Layout, MessageSquare, Star, Users } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { ideas, loading } = useSelector((state: RootState) => state.idea);

  useEffect(() => {
    dispatch(getSavedIdeas() as any);
  }, [dispatch]);

  const stats = [
    {
      name: 'Total Ideas',
      value: ideas.length,
      icon: Brain,
      color: 'bg-blue-500'
    },
    {
      name: 'Pitch Decks',
      value: ideas.filter(idea => idea.pitchDeckContent).length,
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      name: 'Canvases',
      value: ideas.filter(idea => idea.canvasContent).length,
      icon: Layout,
      color: 'bg-purple-500'
    },
    {
      name: 'Competitor Analyses',
      value: ideas.filter(idea => idea.competitorAnalysis).length,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Pitch Simulations',
      value: ideas.filter(idea => idea.pitchSimulation).length,
      icon: MessageSquare,
      color: 'bg-green-500'
    },
    {
      name: 'Average Score',
      value: ideas.length ? Math.round(ideas.reduce((acc, idea) => acc + idea.overallScore, 0) / ideas.length) : 0,
      icon: Star,
      color: 'bg-yellow-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, {user?.name}!
          </h1>
          <p className={`mt-2 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Your startup journey dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden rounded-lg shadow`}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={`text-sm font-medium truncate ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {stat.name}
                      </dt>
                      <dd className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => navigate('/submit-idea')}
              className={`p-6 rounded-lg shadow-sm text-left hover:shadow-md transition-shadow ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <Brain className="h-8 w-8 text-indigo-600 mb-3" />
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Submit New Idea
              </h3>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Get instant AI validation for your startup idea
              </p>
            </button>

            <button
              onClick={() => navigate('/saved-ideas')}
              className={`p-6 rounded-lg shadow-sm text-left hover:shadow-md transition-shadow ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <FileText className="h-8 w-8 text-green-600 mb-3" />
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                View Saved Ideas
              </h3>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Access your previously validated ideas
              </p>
            </button>

            {user?.isPremium && (
              <button
                onClick={() => navigate('/investors')}
                className={`p-6 rounded-lg shadow-sm text-left hover:shadow-md transition-shadow ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <Star className="h-8 w-8 text-yellow-600 mb-3" />
                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Investor Directory
                </h3>
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Browse our curated list of investors
                </p>
              </button>
            )}
          </div>
        </div>

        {/* Recent Ideas */}
        {ideas.length > 0 && (
          <div className="mt-12">
            <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Ideas
            </h2>
            <div className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      Idea
                    </th>
                    <th className={`px-3 py-3.5 text-left text-sm font-semibold ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      Score
                    </th>
                    <th className={`px-3 py-3.5 text-left text-sm font-semibold ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {ideas.slice(0, 5).map((idea) => (
                    <tr
                      key={idea._id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/idea/${idea._id}`)}
                    >
                      <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm ${
                        darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                      }`}>
                        {idea.ideaText.length > 100 ? `${idea.ideaText.substring(0, 100)}...` : idea.ideaText}
                      </td>
                      <td className={`whitespace-nowrap px-3 py-4 text-sm ${
                        darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                      }`}>
                        {idea.overallScore}%
                      </td>
                      <td className={`whitespace-nowrap px-3 py-4 text-sm ${
                        darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                      }`}>
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;