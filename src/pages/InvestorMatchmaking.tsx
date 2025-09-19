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
  Award
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
            <div className="icon-container icon-purple mx-auto mb-2">
              <Target className="h-6 w-6 dark:text-white text-black" />
            </div>
            <h1 className={`page-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Investor
              <span className="ml-2 text-gradient-primary">
                Matchmaking
              </span>
            </h1>
            <p className={`page-subtitle ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Find the perfect investors for your startup using AI-powered matching
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8 mb-12`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs sm:text-sm">
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Industry
                  </label>
                  <select
                    value={criteria.industry}
                    onChange={(e) => setCriteria(prev => ({ ...prev, industry: e.target.value }))}
                    className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
                  >
                    <option value="">Select Industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Funding Stage
                  </label>
                  <select
                    value={criteria.stage}
                    onChange={(e) => setCriteria(prev => ({ ...prev, stage: e.target.value }))}
                    className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
                  >
                    <option value="">Select Stage</option>
                    {stages.map((stage) => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Funding Amount
                  </label>
                  <select
                    value={criteria.fundingAmount}
                    onChange={(e) => setCriteria(prev => ({ ...prev, fundingAmount: e.target.value }))}
                    className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
                  >
                    <option value="">Select Amount</option>
                    {fundingAmounts.map((amount) => (
                      <option key={amount} value={amount}>{amount}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Location
                  </label>
                  <select
                    value={criteria.location}
                    onChange={(e) => setCriteria(prev => ({ ...prev, location: e.target.value }))}
                    className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
                  >
                    <option value="">Select Location</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Business Model
                  </label>
                  <select
                    value={criteria.businessModel}
                    onChange={(e) => setCriteria(prev => ({ ...prev, businessModel: e.target.value }))}
                    className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
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
                className={`w-full btn-primary btn-primary-purple bg-cyan-500 text-xs sm:text-sm ${
                  (loading || !criteria.industry || !criteria.stage) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={!(loading || !criteria.industry || !criteria.stage) ? { scale: 1.05 } : {}}
                whileTap={!(loading || !criteria.industry || !criteria.stage) ? { scale: 0.95 } : {}}
              >
                {loading ? (
                  <div className="flex items-center justify-center ">
                    <div className="loading-spinner mr-3" />
                    Finding Matches...
                  </div>
                ) : (
                  <div className="flex items-center justify-center  text-white ">
                    <Search className="w-5 h-5 mr-3 " />
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
                <div className="space-y-6">
                  {/* Results Header */}
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <h2 className={`text-lg font-bold m-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Found {matches.length} Investor Match{matches.length !== 1 ? 'es' : ''}
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Ranked by compatibility with your startup
                    </p>
                  </motion.div>

                  {/* Investor Matches */}
                  <div className="grid grid-cols-1 gap-8">
                    {matches.map((investor, index) => (
                      <motion.div
                        key={investor._id}
                        className={`group card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} card-hover p-6`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="card-hover-effect"></div>
                        <div className="relative">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h3 className={`text-md sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-purple-500 transition-colors duration-300 mr-4`}>
                                  {investor.name}
                                </h3>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {investor.type}
                                </span>
                              </div>
                              
                              <p className={`text-sm sm:text-md text-justify mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                                {investor.description}
                              </p>
                            </div>

                            {/* Match Score */}
                            <div className="text-center lg:text-right lg:ml-8">
                              <div className={`inline-flex items-center justify-center text-xs sm:text-lg w-8 sm:w-16 h-8 sm:h-16 rounded-full bg-gradient-to-br ${getMatchScoreBg(investor.matchScore)} text-white font-bold text-xl shadow-xl`}>
                                {investor.matchScore}%
                              </div>
                              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Match Score
                              </p>
                            </div>
                          </div>

                          {/* Match Reasons */}
                          <div className="mb-6">
                            <h4 className={`text-sm sm:text-md font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                              <Award className="w-4 h-4 mr-2 text-purple-500" />
                              Why This Match
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {investor.matchReasons.map((reason, i) => (
                                <div key={i} className="flex items-start">
                                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 mr-3 flex-shrink-0"></div>
                                  <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {reason}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Investor Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                              <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                                <Building className="w-4 h-4 mr-2" />
                                Industry Focus
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {investor.industryFocus.map((industry) => (
                                  <span
                                    key={industry}
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                      darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                                    }`}
                                  >
                                    {industry}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                                <MapPin className="w-4 h-4 mr-2" />
                                Location & Range
                              </h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                                {investor.location}
                              </p>
                              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                ${(investor.investmentRange.min / 1000)}K - ${(investor.investmentRange.max / 1000)}K
                              </p>
                            </div>

                            <div>
                              <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Portfolio Stats
                              </h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                                Portfolio: {investor.portfolioSize} companies
                              </p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Recent investments: {investor.recentInvestments.length}
                              </p>
                            </div>
                          </div>

                          {/* Recent Investments */}
                          {investor.recentInvestments.length > 0 && (
                            <div className="mb-6">
                              <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                                <Calendar className="w-4 h-4 mr-2" />
                                Recent Investments
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {investor.recentInvestments.slice(0, 3).map((investment, i) => (
                                  <span
                                    key={i}
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
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
                            className="inline-flex items-center w-full justify-center px-6 py-2 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Contact Investor
                            <ExternalLink className="ml-3 h-5 w-5" />
                          </motion.a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.div
                  className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-12 text-center`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="icon-container-lg bg-gray-500 mx-auto mb-8">
                    <Search className="h-12 w-12 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    No Matches Found
                  </h3>
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Try adjusting your search criteria to find more investor matches.
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {error && (
            <motion.div 
              className="mt-6 p-4 bg-red-100 text-red-700 rounded-2xl border border-red-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorMatchmaking;