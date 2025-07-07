import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import IdeaAnalysisSkeleton from '../components/skeleton/IdeaAnalysisSkeleton';
import { FileText, Layout, BarChart as ChartBar, AlertCircle, Users, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <div className='px-8'>
        <IdeaAnalysisSkeleton />
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

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className={`page-container ${darkMode ? 'page-container-dark' : 'page-container-light'}`}>
      {/* Animated Background */}
      <div className="bg-animated">
        <div className={`bg-orb ${darkMode ? 'bg-orb-1' : 'bg-orb-light-1'}`}></div>
        <div className={`bg-orb ${darkMode ? 'bg-orb-2' : 'bg-orb-light-2'}`}></div>
      </div>

      <div className="content-wrapper">
        <div className="max-container">
          {/* Idea Overview */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8 mb-12`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Idea Analysis
              <span className="block text-gradient-primary">
                Results
              </span>
            </h1>
            <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              {idea?.ideaText}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.button
                onClick={handleGeneratePitchDeck}
                className="group relative p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FileText className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Pitch Deck</span>
              </motion.button>

              <motion.button
                onClick={handleGenerateCanvas}
                className="group relative p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Layout className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Canvas</span>
              </motion.button>

              <motion.button
                onClick={handleCompetitorAnalysis}
                className="group relative p-4 rounded-2xl bg-gradient-to-br from-green-600 to-blue-600 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Competitors</span>
              </motion.button>

              <motion.button
                onClick={handlePitchSimulator}
                className="group relative p-4 rounded-2xl bg-gradient-to-br from-orange-600 to-red-600 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageSquare className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Practice</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              { label: 'Overall Score', value: idea.overallScore, color: 'from-purple-500 to-pink-500' },
              { label: 'Market Demand', value: idea.marketDemandScore, color: 'from-green-500 to-blue-500' },
              { label: 'Competition', value: idea.competitionScore, color: 'from-yellow-500 to-orange-500' },
              { label: 'Monetization', value: idea.monetizationFeasibilityScore, color: 'from-blue-500 to-purple-500' }
            ].map((score, index) => (
              <motion.div
                key={score.label}
                className={`group card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} card-hover p-8`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`card-hover-effect bg-gradient-to-br ${score.color}`}></div>
                <div className="relative text-center">
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {score.label}
                  </h3>
                  <div className={`text-5xl font-bold mb-2 bg-gradient-to-br ${score.color} bg-clip-text text-transparent`}>
                    {score.value}%
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <motion.div
                      className={`h-3 rounded-full bg-gradient-to-r ${score.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${score.value}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detailed Analysis */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Detailed Analysis
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                { title: 'Market Demand Analysis', content: idea.analysis.marketDemand.text, color: 'from-green-500 to-blue-500' },
                { title: 'Competition Analysis', content: idea.analysis.competition.text, color: 'from-yellow-500 to-orange-500' },
                { title: 'Monetization Analysis', content: idea.analysis.monetization.text, color: 'from-blue-500 to-purple-500' },
                { title: 'Overall Assessment', content: idea.analysis.overall.text, color: 'from-purple-500 to-pink-500' }
              ].map((analysis, index) => (
                <motion.div
                  key={analysis.title}
                  className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50/50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                >
                  <div className="flex items-center mb-4">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${analysis.color} mr-3`}></div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {analysis.title}
                    </h3>
                  </div>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    {analysis.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default IdeaResults;