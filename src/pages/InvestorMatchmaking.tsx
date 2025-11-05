import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  MapPin, 
  DollarSign, 
  Star, 
  ExternalLink, 
  Filter,
  Search,
  TrendingUp,
  Building,
  Calendar,
  Award,
  Sparkles,
  Zap,
  X,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/constants';

interface InvestorMatch {
  _id: string;
  name: string;
  type: string;
  industryFocus: string[];
  description: string;
  location: string;
  contactLink: string;
  investmentRange: {
    min: number;
    max: number;
  };
  matchScore: number;
  matchReasons: string[];
  recentInvestments: string[];
  portfolioSize: number;
}

interface MatchingCriteria {
  industry: string;
  stage: string;
  fundingAmount: string;
  location: string;
  businessModel: string;
}

const InvestorMatchmaking = () => {
  const [matches, setMatches] = useState<InvestorMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [criteria, setCriteria] = useState<MatchingCriteria>({
    industry: '',
    stage: '',
    fundingAmount: '',
    location: '',
    businessModel: ''
  });
  const [hasSearched, setHasSearched] = useState(false);

  const { token } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useTheme();

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education',
    'Entertainment', 'Food & Beverage', 'Transportation', 'Real Estate',
    'Manufacturing', 'Energy', 'Agriculture', 'SaaS', 'Mobile Apps',
    'AI/ML', 'Blockchain', 'IoT', 'Cybersecurity'
  ];

  const stages = [
    'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth'
  ];

  const fundingAmounts = [
    '$50K - $250K', '$250K - $1M', '$1M - $5M', '$5M - $20M', '$20M+'
  ];

  const locations = [
    'Global', 'North America', 'Europe', 'Asia Pacific', 'Silicon Valley',
    'New York', 'London', 'Berlin', 'Singapore', 'Tel Aviv'
  ];

  const businessModels = [
    'SaaS', 'Marketplace', 'E-commerce', 'Subscription', 'Freemium',
    'B2B', 'B2C', 'B2B2C', 'Hardware', 'Platform'
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${API_URL}/api/investors/match`,
        criteria,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMatches(response.data.matches);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to find investor matches');
    } finally {
      setLoading(false);
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMatchScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        {/* Floating Elements */}
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] right-[25%] w-1 h-1 bg-indigo-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4 text-center">
              <div className={`hidden  w-6 sm:w-8 h-6 sm:h-8 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 sm:flex items-center justify-center shadow-2xl ${darkMode ? "shadow-purple-500/50" : "shadow-purple-500/30"}`}>
                <Target className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
              </div>
              <div>
                <h1 className={`text-md md:text-xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Investor{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Matchmaking
                  </span>
                </h1>
                <p className={`text-xs md:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} font-medium flex items-center gap-2 justify-center`}>
                  <Zap className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
                  AI-powered investor matching for your startup
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div 
            className={`mb-6 p-4 rounded-2xl ${darkMode ? 'bg-red-900/30 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-white" />
                </div>
                <span className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'}`}>{error}</span>
              </div>
              <button 
                onClick={() => setError(null)}
                className={`text-sm font-bold ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition-colors`}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        {/* Search Form */}
        <motion.div 
          className={`${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-3 md:p-3 mb-8`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-xl">
              <Filter className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
            </div>
            <h2 className={`text-sm sm:text-md font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Search Criteria
            </h2>
          </div>

          <form onSubmit={handleSearch} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className={`block text-xs sm:text-sm font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Industry *
                </label>
                <select
                  value={criteria.industry}
                  onChange={(e) => setCriteria(prev => ({ ...prev, industry: e.target.value }))}
                  className={`w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-xl border-2 transition-all duration-300 ${
                    darkMode
                      ? 'bg-gray-800/50 text-white border-gray-700 focus:border-purple-500 focus:bg-gray-800'
                      : 'bg-white text-gray-900 border-gray-300 focus:border-purple-500 focus:bg-gray-50'
                  } focus:ring-4 focus:ring-purple-500/20 focus:outline-none`}
                >
                  <option value="">Select Industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Funding Stage *
                </label>
                <select
                  value={criteria.stage}
                  onChange={(e) => setCriteria(prev => ({ ...prev, stage: e.target.value }))}
                  className={`w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-xl border-2 transition-all duration-300 ${
                    darkMode
                      ? 'bg-gray-800/50 text-white border-gray-700 focus:border-purple-500 focus:bg-gray-800'
                      : 'bg-white text-gray-900 border-gray-300 focus:border-purple-500 focus:bg-gray-50'
                  } focus:ring-4 focus:ring-purple-500/20 focus:outline-none`}
                >
                  <option value="">Select Stage</option>
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Funding Amount
                </label>
                <select
                  value={criteria.fundingAmount}
                  onChange={(e) => setCriteria(prev => ({ ...prev, fundingAmount: e.target.value }))}
                  className={`w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-xl border-2 transition-all duration-300 ${
                    darkMode
                      ? 'bg-gray-800/50 text-white border-gray-700 focus:border-purple-500 focus:bg-gray-800'
                      : 'bg-white text-gray-900 border-gray-300 focus:border-purple-500 focus:bg-gray-50'
                  } focus:ring-4 focus:ring-purple-500/20 focus:outline-none`}
                >
                  <option value="">Select Amount</option>
                  {fundingAmounts.map((amount) => (
                    <option key={amount} value={amount}>{amount}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Location
                </label>
                <select
                  value={criteria.location}
                  onChange={(e) => setCriteria(prev => ({ ...prev, location: e.target.value }))}
                  className={`w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-xl border-2 transition-all duration-300 ${
                    darkMode
                      ? 'bg-gray-800/50 text-white border-gray-700 focus:border-purple-500 focus:bg-gray-800'
                      : 'bg-white text-gray-900 border-gray-300 focus:border-purple-500 focus:bg-gray-50'
                  } focus:ring-4 focus:ring-purple-500/20 focus:outline-none`}
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Business Model
                </label>
                <select
                  value={criteria.businessModel}
                  onChange={(e) => setCriteria(prev => ({ ...prev, businessModel: e.target.value }))}
                  className={`w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-xl border-2 transition-all duration-300 ${
                    darkMode
                      ? 'bg-gray-800/50 text-white border-gray-700 focus:border-purple-500 focus:bg-gray-800'
                      : 'bg-white text-gray-900 border-gray-300 focus:border-purple-500 focus:bg-gray-50'
                  } focus:ring-4 focus:ring-purple-500/20 focus:outline-none`}
                >
                  <option value="">Select Model</option>
                  {businessModels.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading || !criteria.industry || !criteria.stage}
              className={`w-full py-1 sm:py-2 px-8 rounded-2xl text-xs sm:text-sm font-bold text-white transition-all duration-300 ${
                loading || !criteria.industry || !criteria.stage
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl hover:shadow-purple-500/50'
              }`}
              whileHover={!(loading || !criteria.industry || !criteria.stage) ? { scale: 1.02 } : {}}
              whileTap={!(loading || !criteria.industry || !criteria.stage) ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                  Finding Matches...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Search className="w-3 sm:w-5 h-5 mr-3" />
                  Find Investor Matches (2 Credits)
                </div>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Results */}
        {hasSearched && (
          <div>
            {matches.length > 0 ? (
              <div className="space-y-4">
                {/* Results Header */}
                <motion.div 
                  className={`${darkMode ? 'bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-fuchsia-600/10 border border-purple-500/20' : 'bg-gradient-to-r from-purple-100 via-pink-100 to-fuchsia-100 border border-purple-200'} rounded-3xl p-3 text-center`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <CheckCircle2 className="w-4 sm:w-6 h-4 sm:h-6 text-green-500" />
                    <h2 className={`text-sm sm:text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Found {matches.length} Perfect Match{matches.length !== 1 ? 'es' : ''}!
                    </h2>
                  </div>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Ranked by compatibility with your startup criteria
                  </p>
                </motion.div>

                {/* Investor Matches */}
                <div className="grid grid-cols-1 gap-5">
                  {matches.map((investor, index) => (
                    <motion.div
                      key={investor._id}
                      className={`group relative overflow-hidden ${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-4 hover:scale-[1.02] transition-all duration-500`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                    >
                      {/* Gradient Glow */}
                      <div className={`absolute -inset-1 bg-gradient-to-br from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

                      <div className="relative">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h3 className={`text-sm md:text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {investor.name}
                              </h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                                darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {investor.type}
                              </span>
                            </div>
                            
                            <p className={`text-xs sm:text-sm text-justify leading-relaxed mb-2 sm:mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {investor.description}
                            </p>
                          </div>

                          {/* Match Score */}
                          <div className="flex lg:flex-col items-center lg:items-end gap-2">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getMatchScoreBg(investor.matchScore)} flex items-center justify-center shadow-2xl`}>
                              <div className="text-center">
                                <div className="text-md sm:text-xl font-black text-white">
                                  {investor.matchScore}
                                </div>
                                <div className="text-xs font-semibold text-white/80">
                                  %
                                </div>
                              </div>
                            </div>
                            <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Match Score
                            </span>
                          </div>
                        </div>

                        {/* Match Reasons */}
                        <div className={`p-3 rounded-2xl mb-6 ${darkMode ? 'bg-purple-900/20 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                          <h4 className={`text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                            <Award className="w-4 h-4 mr-2 text-purple-500" />
                            Why This Match
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {investor.matchReasons.map((reason, i) => (
                              <div key={i} className="flex items-start">
                                <Sparkles className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {reason}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Investor Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                            <h4 className={`text-xs font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                              <Building className="w-4 h-4 mr-2 text-blue-500" />
                              Industry Focus
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {investor.industryFocus.map((industry) => (
                                <span
                                  key={industry}
                                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                    darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {industry}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                            <h4 className={`text-xs font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                              <MapPin className="w-4 h-4 mr-2 text-green-500" />
                              Location & Range
                            </h4>
                            <p className={`text-xs sm:text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {investor.location}
                            </p>
                            <p className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              ${(investor.investmentRange.min / 1000)}K - ${(investor.investmentRange.max / 1000)}K
                            </p>
                          </div>

                          <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                            <h4 className={`text-xs font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                              <TrendingUp className="w-4 h-4 mr-2 text-orange-500" />
                              Portfolio Stats
                            </h4>
                            <p className={`text-xs sm:text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              <span className="font-bold">{investor.portfolioSize}</span> portfolio companies
                            </p>
                            <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              <span className="font-bold">{investor.recentInvestments.length}</span> recent investments
                            </p>
                          </div>
                        </div>

                        {/* Recent Investments */}
                        {investor.recentInvestments.length > 0 && (
                          <div className={`p-4 rounded-2xl mb-6 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                            <h4 className={`text-xs font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                              <Calendar className="w-4 h-4 mr-2 text-green-500" />
                              Recent Investments
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {investor.recentInvestments.slice(0, 5).map((investment, i) => (
                                <span
                                  key={i}
                                  className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${
                                    darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {investment}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Contact Button */}
                        <motion.a
                          href={investor.contactLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-full px-8 py-2 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-purple-500/50"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Users className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                          Contact Investor
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </motion.a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                className={`${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-600 to-gray-500 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <h3 className={`text-2xl font-black mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  No Matches Found
                </h3>
                <p className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed`}>
                  We couldn't find any investors matching your criteria. Try adjusting your search parameters or broadening your requirements to discover more opportunities.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    Try different industry
                  </span>
                  <span className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    Adjust funding stage
                  </span>
                  <span className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    Broaden location
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorMatchmaking;