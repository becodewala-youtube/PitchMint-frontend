import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { AlertCircle, ExternalLink, Filter, Star, MapPin, DollarSign, Sparkles, Zap, Users, Crown } from 'lucide-react';
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
  const hasFetchedRef = useRef(false);
  const [filters, setFilters] = useState({
    type: '',
    industry: ''
  });

  const { darkMode } = useTheme();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const query = [];
        if (filters.type) query.push(`type=${filters.type}`);
        if (filters.industry) query.push(`industry=${filters.industry}`);

        const response = await axios.get(
          `${API_URL}/api/investors${query.length ? `?${query.join('&')}` : ''}`,
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

    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchInvestors();
    } else if (filters.type || filters.industry) {
      fetchInvestors();
    }
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
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
        <motion.div 
          className={`text-center p-8 rounded-3xl ${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-red-500/50">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Error</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-amber-600/30 via-yellow-600/20 to-orange-600/30"
              : "bg-gradient-to-br from-amber-300/40 via-yellow-300/30 to-orange-300/40"
          }`}
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-orange-600/30 via-red-600/20 to-pink-600/30"
              : "bg-gradient-to-br from-orange-300/40 via-red-300/30 to-pink-300/40"
          }`}
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-yellow-600/20 via-amber-600/10 to-orange-600/20"
              : "bg-gradient-to-br from-yellow-300/30 via-amber-300/20 to-orange-300/30"
          }`}
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        ></div>

        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-amber-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-amber-200/10 to-transparent'}`} />
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(245,158,11,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        <div className="absolute top-20 left-[10%] w-2 h-2 bg-amber-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
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
              <div className={`w-6 sm:w-8 h-6 sm:h-8  rounded-2xl bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center shadow-2xl ${darkMode ? "shadow-amber-500/50" : "shadow-amber-500/30"}`}>
                <Crown className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
              </div>
              <div>
                <h1 className={`text-md md:text-lg font-black ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Investor{" "}
                  <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Directory
                  </span>
                </h1>
                <p className={`text-xs  ${darkMode ? "text-gray-400" : "text-gray-600"} font-medium flex items-center gap-2 justify-center`}>
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-amber-400" />
                  Connect with top investors, VCs, and accelerators
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className={`${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-3 mb-8`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 sm:w-8 h-6 sm:h-8  rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-xl">
              <Filter className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
            </div>
            <h2 className={`text-sm font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Filter Investors
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-xs font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Investor Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                className={`w-full px-4 py-1 sm:py-2 text-xs rounded-xl border-2 transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-800/50 text-white border-gray-700 focus:border-amber-500 focus:bg-gray-800'
                    : 'bg-white text-gray-900 border-gray-300 focus:border-amber-500 focus:bg-gray-50'
                } focus:ring-4 focus:ring-amber-500/20 focus:outline-none`}
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
              <label className={`block text-xs font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Industry Focus
              </label>
              <select
                value={filters.industry}
                onChange={(e) => setFilters((prev) => ({ ...prev, industry: e.target.value }))}
                className={`w-full px-4 py-1 sm:py-2 text-xs rounded-xl border-2 transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-800/50 text-white border-gray-700 focus:border-amber-500 focus:bg-gray-800'
                    : 'bg-white text-gray-900 border-gray-300 focus:border-amber-500 focus:bg-gray-50'
                } focus:ring-4 focus:ring-amber-500/20 focus:outline-none`}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investors.map((investor, index) => (
              <motion.div
                key={investor._id}
                className={`group relative overflow-hidden ${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl hover:scale-[1.02] transition-all duration-500`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Gradient Glow */}
                <div className={`absolute -inset-1 bg-gradient-to-br from-amber-600 to-orange-600 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

                <div className="relative p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className={`text-sm md:text-md font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-amber-500 transition-colors duration-300`}>
                        {investor.name}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        darkMode ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {investor.type}
                      </span>
                    </div>
                  </div>

                  <p className={`text-xs mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    {investor.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className={`p-2 rounded-2xl ${darkMode ? 'bg-blue-900/20 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                      <h4 className={`text-xs font-bold mb-3 ${darkMode ? 'text-blue-300' : 'text-blue-700'} flex items-center`}>
                        <Zap className="w-4 h-4 mr-2" />
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                        <h4 className={`text-xs font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                          <MapPin className="w-3 h-3 mr-1 text-green-500" />
                          Location
                        </h4>
                        <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {investor.location}
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                        <h4 className={`text-xs font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                          <DollarSign className="w-3 h-3 mr-1 text-green-500" />
                          Range
                        </h4>
                        <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          ${(investor.investmentRange.min / 1000)}K - ${(investor.investmentRange.max / 1000)}K
                        </p>
                      </div>
                    </div>
                  </div>

                  <motion.a
                    href={investor.contactLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center w-full justify-center px-6 py-1 sm:py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Contact Investor
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className={`${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-600 to-gray-500 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>
            <h3 className={`text-2xl font-black mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No Investors Found
            </h3>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto`}>
              No investors found matching your filters. Try adjusting your search criteria to discover more opportunities.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InvestorContacts;