import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Brain, Users, MessageSquare, TrendingUp, Target, Filter, Calendar, Eye } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/constants';

interface ActivityRecord {
  _id: string;
  userId: string;
  serviceType: 'idea_validation' | 'competitor_analysis' | 'pitch_simulator' | 'market_research' | 'investor_matching';
  title: string;
  description: string;
  data: any;
  creditsUsed: number;
  createdAt: string;
}

const History = () => {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityRecord | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { token } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useTheme();

  const serviceTypes = [
    { value: 'all', label: 'All Activities', icon: HistoryIcon },
    { value: 'idea_validation', label: 'Idea Validation', icon: Brain },
    { value: 'competitor_analysis', label: 'Competitor Analysis', icon: Users },
    { value: 'pitch_simulator', label: 'Pitch Arena', icon: MessageSquare },
    { value: 'market_research', label: 'Market Research', icon: TrendingUp },
    { value: 'investor_matching', label: 'Investor Matching', icon: Target }
  ];

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter(activity => activity.serviceType === selectedFilter));
    }
  }, [activities, selectedFilter]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (serviceType: string) => {
    const service = serviceTypes.find(s => s.value === serviceType);
    return service ? service.icon : HistoryIcon;
  };

  const getServiceColor = (serviceType: string) => {
    const colors = {
      idea_validation: 'from-purple-500 to-pink-500',
      competitor_analysis: 'from-blue-500 to-cyan-500',
      pitch_simulator: 'from-orange-500 to-red-500',
      market_research: 'from-green-500 to-emerald-500',
      investor_matching: 'from-indigo-500 to-purple-500'
    };
    return colors[serviceType as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const handleViewDetails = (activity: ActivityRecord) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const renderActivityDetails = (activity: ActivityRecord) => {
          switch (activity.serviceType) {

            case 'idea_validation':
  return (
    <div className="space-y-6">
      {/* Idea Description */}
      <div>
        <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Idea Overview
        </h4>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {activity.data.ideaText}
        </p>
      </div>

      {/* Scores Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/50' : 'bg-blue-50'}`}>
          <h5 className="font-bold text-blue-500">Market Demand</h5>
          <p className="text-lg font-bold">{activity.data.marketDemandScore}/100</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-red-900/50' : 'bg-red-50'}`}>
          <h5 className="font-bold text-red-500">Competition</h5>
          <p className="text-lg font-bold">{activity.data.competitionScore}/100</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/50' : 'bg-green-50'}`}>
          <h5 className="font-bold text-green-500">Monetization</h5>
          <p className="text-lg font-bold">{activity.data.monetizationFeasibilityScore}/100</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-purple-900/50' : 'bg-purple-50'}`}>
          <h5 className="font-bold text-purple-500">Overall</h5>
          <p className="text-lg font-bold">{activity.data.overallScore}/100</p>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="space-y-6">
        <div>
          <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Market Demand
          </h4>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {activity.data.analysis?.marketDemand?.text}
          </p>
        </div>
        <div>
          <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Competition
          </h4>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {activity.data.analysis?.competition?.text}
          </p>
        </div>
        <div>
          <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Monetization
          </h4>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {activity.data.analysis?.monetization?.text}
          </p>
        </div>
        <div>
          <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Overall
          </h4>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {activity.data.analysis?.overall?.text}
          </p>
        </div>
      </div>
    </div>
  );

            case 'investor_matching':
              return (
                <div className="space-y-6">
                  <div>
                    <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Search Criteria</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium">Industry:</span> {activity.data.criteria?.industry}</div>
                      <div><span className="font-medium">Stage:</span> {activity.data.criteria?.stage}</div>
                      <div><span className="font-medium">Funding:</span> {activity.data.criteria?.fundingAmount}</div>
                      <div><span className="font-medium">Location:</span> {activity.data.criteria?.location}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Investor Matches</h4>
                    <div className="space-y-4">
                      {activity.data.matches?.map((match: any, index: number) => (
                        <div key={index} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-600/50' : 'bg-gray-100'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{match.name}</h5>
                            <span className="text-green-500 font-bold">{match.matchScore}%</span>
                          </div>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>{match.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {match.industryFocus?.map((industry: string, i: number) => (
                              <span key={i} className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                                {industry}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            
            case 'competitor_analysis':
              return (
                <div className="space-y-6">
                  <div>
                    <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Market Overview</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{activity.data.summary}</p>
                  </div>
                  <div>
                    <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Competitors</h4>
                    <div className="space-y-4">
                      {activity.data.competitors?.map((competitor: any, index: number) => (
                        <div key={index} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-600/50' : 'bg-gray-100'}`}>
                          <h5 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{competitor.name}</h5>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>{competitor.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-green-500 font-medium">Strengths:</span>
                              <ul className="mt-1 space-y-1">
                                {competitor.swot?.strengths?.map((strength: string, i: number) => (
                                  <li key={i} className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>• {strength}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="text-red-500 font-medium">Weaknesses:</span>
                              <ul className="mt-1 space-y-1">
                                {competitor.swot?.weaknesses?.map((weakness: string, i: number) => (
                                  <li key={i} className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>• {weakness}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            
            case 'market_research':
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/50' : 'bg-blue-50'}`}>
                      <h5 className="font-bold text-blue-500">TAM</h5>
                      <p className="text-lg font-bold">${(activity.data.tam?.value / 1000000000).toFixed(1)}B</p>
                    </div>
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/50' : 'bg-green-50'}`}>
                      <h5 className="font-bold text-green-500">SAM</h5>
                      <p className="text-lg font-bold">${(activity.data.sam?.value / 1000000000).toFixed(1)}B</p>
                    </div>
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-purple-900/50' : 'bg-purple-50'}`}>
                      <h5 className="font-bold text-purple-500">SOM</h5>
                      <p className="text-lg font-bold">${(activity.data.som?.value / 1000000).toFixed(0)}M</p>
                    </div>
                  </div>
                  <div>
                    <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Customer Personas</h4>
                    <div className="space-y-3">
                      {activity.data.personas?.map((persona: any, index: number) => (
                        <div key={index} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-600/50' : 'bg-gray-100'}`}>
                          <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{persona.name}</h5>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {persona.demographics?.age} • {persona.demographics?.income} • {persona.demographics?.location}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
           case 'pitch_simulator':
  return (
    <div className="space-y-6">
      <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Q&A Session
      </h4>

      {/* Case 1: Multiple generated questions */}
      {activity.data.questions?.map((qa: any, index: number) => (
        <div
          key={index}
          className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}
        >
          {/* Question */}
          <div
            className={`p-3 rounded-xl mb-3 ${
              darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'
            }`}
          >
            <h5 className="font-bold text-indigo-500">Q: {qa.question}</h5>
          </div>

          {/* Answer */}
          {qa.answer && (
            <div
              className={`p-3 rounded-xl mb-3 ${
                darkMode ? 'bg-green-900/50' : 'bg-green-50'
              }`}
            >
              <h5 className="font-bold text-green-500">A: {qa.answer}</h5>
            </div>
          )}

          {/* Feedback (if exists in array mode) */}
          {qa.feedback && (
            <div className="text-sm space-y-2">
              <p>
                <span className="font-semibold">Rating:</span> ⭐ {qa.feedback.rating}/5
              </p>
              {qa.feedback.strengths?.length > 0 && (
                <div>
                  <h6 className="font-semibold text-green-500">Strengths</h6>
                  <ul className="list-disc list-inside space-y-1">
                    {qa.feedback.strengths.map((point: string, idx: number) => (
                      <li
                        key={idx}
                        className={darkMode ? 'text-gray-300' : 'text-gray-700'}
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {qa.feedback.improvements?.length > 0 && (
                <div>
                  <h6 className="font-semibold text-red-500">Improvements</h6>
                  <ul className="list-disc list-inside space-y-1">
                    {qa.feedback.improvements.map((point: string, idx: number) => (
                      <li
                        key={idx}
                        className={darkMode ? 'text-gray-300' : 'text-gray-700'}
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {qa.feedback.additionalAdvice && (
                <div>
                  <h6 className="font-semibold text-blue-500">Additional Advice</h6>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {qa.feedback.additionalAdvice}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Case 2: Single answered question with feedback */}
      {activity.data.question && (
        <div
          className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}
        >
          {/* Question */}
          <div
            className={`p-3 rounded-xl mb-3 ${
              darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'
            }`}
          >
            <h5 className="font-bold text-indigo-500">Q: {activity.data.question}</h5>
          </div>

          {/* Answer */}
          {activity.data.answer && (
            <div
              className={`p-3 rounded-xl mb-3 ${
                darkMode ? 'bg-green-900/50' : 'bg-green-50'
              }`}
            >
              <h5 className="font-bold text-green-500 mb-2">Your Answer</h5>
              <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                {activity.data.answer}
              </p>
            </div>
          )}

          {/* Feedback */}
          {activity.data.feedback && (
            <div
              className={`p-4 rounded-xl ${
                darkMode ? 'bg-gray-800/70' : 'bg-gray-100'
              }`}
            >
              <h5 className="font-bold mb-3 text-yellow-500">Investor Feedback</h5>

              <p className="mb-2">
                <span className="font-semibold">Rating:</span> ⭐ {activity.data.feedback.rating}/5
              </p>

              {activity.data.feedback.strengths?.length > 0 && (
                <div className="mb-3">
                  <h6 className="font-semibold text-green-500">Strengths</h6>
                  <ul className="list-disc list-inside space-y-1">
                    {activity.data.feedback.strengths.map((point: string, idx: number) => (
                      <li
                        key={idx}
                        className={darkMode ? 'text-gray-300' : 'text-gray-700'}
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activity.data.feedback.improvements?.length > 0 && (
                <div className="mb-3">
                  <h6 className="font-semibold text-red-500">Improvements</h6>
                  <ul className="list-disc list-inside space-y-1">
                    {activity.data.feedback.improvements.map(
                      (point: string, idx: number) => (
                        <li
                          key={idx}
                          className={darkMode ? 'text-gray-300' : 'text-gray-700'}
                        >
                          {point}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {activity.data.feedback.additionalAdvice && (
                <div>
                  <h6 className="font-semibold text-blue-500">Additional Advice</h6>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {activity.data.feedback.additionalAdvice}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

            
            default:
              return (
                <pre className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} whitespace-pre-wrap`}>
                  {JSON.stringify(activity.data, null, 2)}
                </pre>
              );
          }
        };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className={`page-container ${darkMode ? 'page-container-dark' : 'page-container-light'}`}>
      <div className="bg-animated">
        <div className={`bg-orb ${darkMode ? 'bg-orb-1' : 'bg-orb-light-1'}`}></div>
        <div className={`bg-orb ${darkMode ? 'bg-orb-2' : 'bg-orb-light-2'}`}></div>
      </div>

      <div className="content-wrapper">
        <div className="max-container">
          {/* Header */}
          <motion.div 
            className="page-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="icon-container icon-purple mx-auto mb-8">
              <HistoryIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className={`page-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Activity
              <span className="ml-2 text-gradient-primary">
                History
              </span>
            </h1>
            <p className={`page-subtitle ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Track your startup validation journey
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-6 mb-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 text-purple-500 mr-3" />
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Filter Activities
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {serviceTypes.map((service) => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.value}
                    onClick={() => setSelectedFilter(service.value)}
                    className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedFilter === service.value
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : darkMode
                          ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {service.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Activities List */}
          {filteredActivities.length > 0 ? (
            <div className="space-y-6">
              {filteredActivities.map((activity, index) => {
                const Icon = getServiceIcon(activity.serviceType);
                return (
                  <motion.div
                    key={activity._id}
                    className={`group card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} card-hover p-6`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className={`card-hover-effect bg-gradient-to-br ${getServiceColor(activity.serviceType)}`}></div>
                    <div className="relative flex items-start justify-between">
                      <div className="flex items-start flex-1">
                        <div className={`icon-container bg-gradient-to-br ${getServiceColor(activity.serviceType)} mr-4`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-purple-500 transition-colors duration-300`}>
                            {activity.title}
                          </h3>
                          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {activity.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {new Date(activity.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800'
                              }`}>
                                -{activity.creditsUsed} Credits
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewDetails(activity)}
                        className="btn-primary btn-primary-blue text-sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-12 text-center`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="icon-container-lg bg-gray-500 mx-auto mb-8">
                <HistoryIcon className="h-12 w-12 text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                No Activity Found
              </h3>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {selectedFilter === 'all' 
                  ? 'You haven\'t used any services yet. Start validating your ideas!'
                  : `No ${serviceTypes.find(s => s.value === selectedFilter)?.label} activities found.`
                }
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Activity Details Modal */}
      {showModal && selectedActivity && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowModal(false)}></div>
            
            <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto p-8`}>
              <div className="flex justify-between items-start mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedActivity.title}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-2 rounded-xl ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  ✕
                </button>
              </div>
              
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} max-h-96 overflow-y-auto`}>
                {renderActivityDetails(selectedActivity)}
              </div>
            </div>
          </div>
        </div>
      )}

     
    </div>
  );
};

export default History;