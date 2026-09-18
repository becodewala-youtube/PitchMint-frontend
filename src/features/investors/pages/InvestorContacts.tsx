import { useEffect, useState, useRef } from 'react';
import PageBackground from '@/shared/components/ui/PageBackground';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

import api from '@/shared/lib/api';

import { AlertCircle, ExternalLink, Filter, Star, MapPin, DollarSign, Sparkles, Zap, Users, Crown } from 'lucide-react';
import InvestorDirectorySkeleton from '@/features/investors/components/InvestorSkeleton';
import UpgradeModal from '@/features/credits/components/UpgradeModal';
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const hasFetchedRef = useRef(false);
  const [filters, setFilters] = useState({
    type: '',
    industry: ''
  });
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

        const response = await api.get(
          `/api/investors${query.length ? `?${query.join('&')}` : ''}`,
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
    const isPremiumError = error.toLowerCase().includes('premium');
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0118] px-4">
        <motion.div 
          className="text-center p-8 rounded-3xl bg-gray-900/50 border border-gray-800/50 backdrop-blur-xl max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-purple-500/50">
            {isPremiumError ? <Crown className="h-8 w-8 text-white" /> : <AlertCircle className="h-8 w-8 text-white" />}
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">
            {isPremiumError ? 'Premium Access Required' : 'Error'}
          </h3>
          <p className="text-sm text-gray-400 mb-6">{error}</p>
          {isPremiumError && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#5b21b6] transition-all cursor-pointer shadow-lg shadow-purple-600/30"
            >
              Upgrade to Premium
            </button>
          )}
        </motion.div>
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0118]">
      <PageBackground theme="amber" />

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
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/50">
                <Crown className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
              </div>
              <div>
                <h1 className="text-md md:text-lg font-black text-white">
                  Investor{" "}
                  <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Directory
                  </span>
                </h1>
                <p className="text-xs text-gray-400 font-medium flex items-center gap-2 justify-center">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-amber-400" />
                  Connect with top investors, VCs, and accelerators
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-xl">
              <Filter className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
            </div>
            <h2 className="text-sm font-black text-white">
              Filter Investors
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold mb-3 text-gray-300">
                Investor Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-1 sm:py-2 text-xs rounded-xl border-2 transition-all duration-300 bg-gray-800/50 text-white border-gray-700 focus:border-amber-500 focus:bg-gray-800 focus:ring-4 focus:ring-amber-500/20 focus:outline-none"
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
              <label className="block text-xs font-bold mb-3 text-gray-300">
                Industry Focus
              </label>
              <select
                value={filters.industry}
                onChange={(e) => setFilters((prev) => ({ ...prev, industry: e.target.value }))}
                className="w-full px-4 py-1 sm:py-2 text-xs rounded-xl border-2 transition-all duration-300 bg-gray-800/50 text-white border-gray-700 focus:border-amber-500 focus:bg-gray-800 focus:ring-4 focus:ring-amber-500/20 focus:outline-none"
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
                className="group relative overflow-hidden bg-gray-900/50 border border-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl hover:scale-[1.02] transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Gradient Glow */}
                <div className="absolute -inset-1 bg-gradient-to-br from-amber-600 to-orange-600 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500" />

                <div className="relative p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm md:text-md font-black mb-2 text-white group-hover:text-amber-500 transition-colors duration-300">
                        {investor.name}
                      </h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-900/50 text-amber-300">
                        {investor.type}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs mb-4 text-gray-300 leading-relaxed">
                    {investor.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="p-2 rounded-2xl bg-blue-900/20 border border-blue-500/20">
                      <h4 className="text-xs font-bold mb-3 text-blue-300 flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        Industry Focus
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {investor.industryFocus.map((industry) => (
                          <span
                            key={industry}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-900/50 text-blue-300"
                          >
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700">
                        <h4 className="text-xs font-bold mb-2 text-gray-300 flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-green-500" />
                          Location
                        </h4>
                        <p className="text-xs font-semibold text-gray-400">
                          {investor.location}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700">
                        <h4 className="text-xs font-bold mb-2 text-gray-300 flex items-center">
                          <DollarSign className="w-3 h-3 mr-1 text-green-500" />
                          Range
                        </h4>
                        <p className="text-xs font-semibold text-gray-400">
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
            className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-600 to-gray-500 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-white">
              No Investors Found
            </h3>
            <p className="text-sm mb-6 text-gray-400 max-w-md mx-auto">
              No investors found matching your filters. Try adjusting your search criteria to discover more opportunities.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InvestorContacts;