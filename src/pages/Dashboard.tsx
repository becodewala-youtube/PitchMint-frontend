// src/pages/Dashboard.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSavedIdeas } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import DashboardSkeleton from '../components/skeleton/DashboardSkelton';
import { Brain, FileText, Layout, MessageSquare, Star, ChevronRight, Sparkles, Users } from 'lucide-react';

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
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600'
    },
    {
      name: 'Pitch Decks',
      value: ideas.filter(idea => idea.pitchDeckContent).length,
      icon: FileText,
      color: 'bg-gradient-to-r from-emerald-500 to-green-600'
    },
    {
      name: 'Canvases',
      value: ideas.filter(idea => idea.canvasContent).length,
      icon: Layout,
      color: 'bg-gradient-to-r from-purple-500 to-violet-600'
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
      color: 'bg-gradient-to-r from-amber-500 to-yellow-600'
    }
  ];

  if (loading) {
    return (
      <>
     <div className='px-8 py-6'>
       <DashboardSkeleton />
     </div>
      </>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className={`text-4xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'} sm:text-5xl md:text-6xl`}>
              Welcome back, <span className="text-indigo-600">{user?.name}</span>!
            </h1>
            <p className={`mt-3 max-w-md mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-500'} sm:text-xl md:mt-5 md:max-w-3xl`}>
              Transform your ideas into reality with AI-powered validation and professional pitch materials.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200`}
            >
              <div className={`${stat.color} p-1`}>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-5`}>
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
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => navigate('/submit-idea')}
            className={`group p-6 rounded-xl shadow-lg text-left transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700' 
                : 'bg-white hover:bg-gray-50'
            } hover:shadow-xl`}
          >
            <div className="flex items-center justify-between">
              <Sparkles className="h-8 w-8 text-indigo-600" />
              <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:translate-x-1 transition-transform duration-200`} />
            </div>
            <h3 className={`mt-4 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Submit New Idea
            </h3>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Get instant AI validation for your startup idea
            </p>
          </button>


           <button
            onClick={() => navigate('/saved-ideas')}
            className={`group p-6 rounded-xl shadow-lg text-left transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700' 
                : 'bg-white hover:bg-gray-50'
            } hover:shadow-xl`}
          >
            <div className="flex items-center justify-between">
              <FileText className="h-8 w-8 text-green-600" />
              <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:translate-x-1 transition-transform duration-200`} />
            </div>
            <h3 className={`mt-4 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              View Saved Ideas
            </h3>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Access your previously validated ideas
            </p>
          </button>


 <button
            onClick={() => navigate('/investors')}
            className={`group p-6 rounded-xl shadow-lg text-left transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700' 
                : 'bg-white hover:bg-gray-50'
            } hover:shadow-xl`}
          >
            <div className="flex items-center justify-between">
              <Star className="h-8 w-8 text-yellow-600" />
              <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:translate-x-1 transition-transform duration-200`} />
            </div>
            <h3 className={`mt-4 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
             Investor Directory
            </h3>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            Browse our curated list of investors
            </p>
          </button>
          {/* Add more quick action buttons similarly */}
        </div>
      </div>

      {/* Recent Ideas */}
      {ideas.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
            Recent Ideas
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ideas.slice(0, 6).map((idea) => (
              <div
                key={idea._id}
                onClick={() => navigate(`/idea/${idea._id}`)}
                className={`cursor-pointer rounded-xl shadow-lg p-6 transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-gray-50'
                } hover:shadow-xl`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    idea.overallScore >= 80 
                      ? 'bg-green-100 text-green-800' 
                      : idea.overallScore >= 60 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    Score: {idea.overallScore}%
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(idea.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'} line-clamp-2`}>
                  {idea.ideaText}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
