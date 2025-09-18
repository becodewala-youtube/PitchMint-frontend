import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { AlertCircle, ExternalLink, Filter, Star, MapPin, DollarSign } from 'lucide-react';
import InvestorDirectorySkeleton from '../components/skeleton/InvestorSkeleton';
import { motion } from 'framer-motion';

interface Investor {
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
}

const InvestorContacts = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    industry: ''
  });

  const { darkMode } = useTheme();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get(
          `${API_URL}/api/investors${
            filters.type || filters.industry
              ? `?type=${filters.type}&industry=${filters.industry}`
              : ''
          }`,
          config
        );

        setInvestors(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch investors');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, [filters, token]);

  const investorTypes = ['All', 'VC', 'Angel', 'Incubator', 'Accelerator'];
  const industries = ['All', 'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Enterprise'];

  if (loading) {
    return (
      <div className='px-4 py-2'>
        <InvestorDirectorySkeleton />
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

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${darkMode ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-blue-400 to-purple-400'} animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${darkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-green-400 to-blue-400'} animate-pulse delay-1000`}></div>
      </div>

      <div className="relative z-10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={`w-8 h-8 rounded-3xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-4`}>
              <Star className=" h-5 w-5 text-white" />
            </div>
            <h1 className={`text-2xl md:text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Investor
              <span className="ml-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Directory
              </span>
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Connect with top investors, VCs, and accelerators
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div 
            className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-3xl shadow-2xl p-4 mb-12 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 text-purple-500 mr-3" />
              <h2 className={`text-md font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Filter Investors
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Investor Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-2xl border-2 transition-all duration-300 ${
                    darkMode
                      ? 'border-gray-600 bg-gray-800/80 text-white focus:border-purple-500'
                      : 'border-gray-300 bg-white text-gray-900 focus:border-purple-500'
                  } focus:ring-4 focus:ring-purple-500/20 focus:outline-none`}
                >
                  <option value="">All Types</option>
                  {investorTypes.slice(1).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Industry Focus
                </label>
                <select
                  value={filters.industry}
                  onChange={(e) => setFilters((prev) => ({ ...prev, industry: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
                    darkMode
                      ? 'border-gray-600 bg-gray-800/80 text-white focus:border-purple-500'
                      : 'border-gray-300 bg-white text-gray-900 focus:border-purple-500'
                  } focus:ring-4 focus:ring-purple-500/20 focus:outline-none`}
                >
                  <option value="">All Industries</option>
                  {industries.slice(1).map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Investors Grid */}
          {investors.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {investors.map((investor, index) => (
                <motion.div
                  key={investor._id}
                  className={`group relative ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-yellow-500/50 transition-all duration-500 hover:scale-105`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className={`text-md font-bold ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-yellow-500 transition-colors duration-300 mb-2`}>
                          {investor.name}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {investor.type}
                        </span>
                      </div>
                    </div>

                    <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                      {investor.description}
                    </p>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
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

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                            <MapPin className="w-3 h-3 mr-1" />
                            Location
                          </h4>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {investor.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <h4 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center justify-end`}>
                            <DollarSign className="w-3 h-3 mr-1" />
                            Range
                          </h4>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            ${(investor.investmentRange.min / 1000)}K - ${(investor.investmentRange.max / 1000)}K
                          </p>
                        </div>
                      </div>
                    </div>

                    <motion.a
                      href={investor.contactLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center w-full justify-center px-6 py-2 rounded-2xl text-sm font-medium text-white bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Contact Investor
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center mx-auto mb-8`}>
                <AlertCircle className="h-12 w-12 text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                No Investors Found
              </h3>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                No investors found matching your filters. Try adjusting your search criteria.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorContacts;