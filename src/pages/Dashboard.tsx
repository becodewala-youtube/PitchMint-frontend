import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSavedIdeas } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import DashboardSkeleton from '../components/skeleton/DashboardSkelton';
import { Brain, FileText, Layout, MessageSquare, Star, ChevronRight, Sparkles, Users } from 'lucide-react';
import { motion } from 'framer-motion';

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
      color: 'icon-blue'
    },
    {
      name: 'Pitch Decks',
      value: ideas.filter(idea => idea.pitchDeckContent).length,
      icon: FileText,
      color: 'icon-green'
    },
    {
      name: 'Canvases',
      value: ideas.filter(idea => idea.canvasContent).length,
      icon: Layout,
      color: 'icon-purple'
    },
    {
      name: 'Competitor Analyses',
      value: ideas.filter(idea => idea.competitorAnalysis).length,
      icon: Users,
      color: 'icon-blue'
    },
    {
      name: 'Pitch Simulations',
      value: ideas.filter(idea => idea.pitchSimulation).length,
      icon: MessageSquare,
      color: 'icon-green'
    },
    {
      name: 'Average Score',
      value: ideas.length ? Math.round(ideas.reduce((acc, idea) => acc + idea.overallScore, 0) / ideas.length) : 0,
      icon: Star,
      color: 'icon-yellow'
    }
  ];

  if (loading) {
    return (
      <div className='px-8 py-6'>
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className={`page-container ${darkMode ? 'page-container-dark' : 'page-container-light'}`}>
      {/* Animated Background */}
      <div className="bg-animated">
        <div className={`bg-orb ${darkMode ? 'bg-orb-1' : 'bg-orb-light-1'}`}></div>
        <div className={`bg-orb ${darkMode ? 'bg-orb-2' : 'bg-orb-light-2'}`}></div>
      </div>

      <div className="content-wrapper">
        <div className="max-container">
          {/* Welcome Header */}
          <motion.div 
            className="page-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={`page-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome back,
              <span className="block text-gradient-primary">
                {user?.name}!
              </span>
            </h1>
            <p className={`page-subtitle ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Your startup journey dashboard
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                className={`group card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} card-hover p-8`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="card-hover-effect"></div>
                <div className="relative flex items-center">
                  <div className={`icon-container ${stat.color} group-hover:scale-110 transition-transform duration-300 mr-6`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="w-0 flex-1">
                    <dl>
                      <dt className={`text-sm font-medium truncate ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {stat.name}
                      </dt>
                      <dd className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-purple-500 transition-colors duration-300`}>
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <motion.button
                onClick={() => navigate('/submit-idea')}
                className={`group card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} card-hover p-8 text-left`}
                whileHover={{ y: -5 }}
              >
                <div className="card-hover-effect"></div>
                <div className="relative">
                  <div className="icon-container icon-purple mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-purple-500 transition-colors duration-300`}>
                    Submit New Idea
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Get instant AI validation for your startup idea
                  </p>
                </div>
              </motion.button>

              <motion.button
                onClick={() => navigate('/saved-ideas')}
                className={`group card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} card-hover p-8 text-left`}
                whileHover={{ y: -5 }}
              >
                <div className="card-hover-effect bg-gradient-to-br from-green-500/10 to-blue-500/10"></div>
                <div className="relative">
                  <div className="icon-container icon-green mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-green-500 transition-colors duration-300`}>
                    View Saved Ideas
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Access your previously validated ideas
                  </p>
                </div>
              </motion.button>

              {user?.isPremium && (
                <motion.button
                  onClick={() => navigate('/investors')}
                  className={`group card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} card-hover p-8 text-left`}
                  whileHover={{ y: -5 }}
                >
                  <div className="card-hover-effect bg-gradient-to-br from-yellow-500/10 to-orange-500/10"></div>
                  <div className="relative">
                    <div className="icon-container icon-yellow mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-yellow-500 transition-colors duration-300`}>
                      Investor Directory
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Browse our curated list of investors
                    </p>
                  </div>
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Recent Ideas */}
          {ideas.length > 0 && (
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Ideas
              </h2>
              <div className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50/50'}`}>
                      <tr>
                        <th className={`py-4 px-6 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          Idea
                        </th>
                        <th className={`py-4 px-6 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          Score
                        </th>
                        <th className={`py-4 px-6 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {ideas.slice(0, 5).map((idea, index) => (
                        <motion.tr
                          key={idea._id}
                          className={`cursor-pointer hover-lift ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50/50'}`}
                          onClick={() => navigate(`/idea/${idea._id}`)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <td className={`py-4 px-6 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {idea.ideaText.length > 100 ? `${idea.ideaText.substring(0, 100)}...` : idea.ideaText}
                          </td>
                          <td className={`py-4 px-6 text-sm font-bold`}>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              idea.overallScore >= 80 ? 'bg-green-100 text-green-800' :
                              idea.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {idea.overallScore}%
                            </span>
                          </td>
                          <td className={`py-4 px-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {new Date(idea.createdAt).toLocaleDateString()}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;