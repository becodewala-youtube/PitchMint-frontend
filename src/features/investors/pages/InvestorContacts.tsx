import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

import api from '@/shared/lib/api';

import { AlertCircle, ExternalLink, Filter, MapPin, DollarSign, Sparkles, Zap, Users, Crown } from 'lucide-react';
import InvestorDirectorySkeleton from '@/features/investors/components/InvestorSkeleton';
import UpgradeModal from '@/features/credits/components/UpgradeModal';
import BackButton from '@/shared/components/ui/BackButton';
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
      <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 selection:bg-[#7c3aed]/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InvestorDirectorySkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    const isPremiumError = error.toLowerCase().includes('premium');
    return (
      <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 flex items-center justify-center selection:bg-[#7c3aed]/30 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />
        <motion.div 
          className="relative z-10 text-center p-6 rounded-2xl bg-[#0a0a0a]/95 border border-white/10 max-w-md w-full shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/15 border border-[#7c3aed]/30 flex items-center justify-center mx-auto mb-3 text-[#a78bfa]">
            {isPremiumError ? <Crown className="h-5 w-5" /> : <AlertCircle className="h-5 w-5 text-red-400" />}
          </div>
          <h3 className="text-[16px] font-semibold mb-1 text-white">
            {isPremiumError ? 'Premium Access Required' : 'Error'}
          </h3>
          <p className="text-[11px] sm:text-[12px] text-gray-400 mb-5">{error}</p>
          {isPremiumError && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="btn-primary w-full py-2 px-5 rounded-lg text-[12px] font-semibold"
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
    <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 selection:bg-[#7c3aed]/30">
      {/* Subtle Dot Grid Background Pattern like Dashboard */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <BackButton fallbackUrl="/dashboard" />

        {/* Header */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-inner text-[#7c3aed]">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <h1 className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-white mb-1">
            Investor Directory
          </h1>
          <p className="text-[11px] sm:text-[12px] text-gray-400 font-normal flex items-center gap-1.5 justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#7c3aed]" />
            Connect with top investors, VCs, and accelerators
          </p>
        </motion.div>

        {/* Filter Card */}
        <motion.div 
          className="rounded-[16px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-4 sm:p-5 mb-6 shadow-sm"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-6 h-6 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center text-[#7c3aed]">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-[13px] font-semibold text-white">
              Filter Investors
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-[11px] font-medium text-gray-400 mb-1.5">
                Investor Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full py-1.5 px-3 text-[12px] rounded-lg border bg-[#141414] border-white/10 text-white focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-colors cursor-pointer"
              >
                <option value="" className="bg-[#141414] text-white">All Types</option>
                {investorTypes.slice(1).map((type) => (
                  <option key={type} value={type} className="bg-[#141414] text-white">
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-400 mb-1.5">
                Industry Focus
              </label>
              <select
                value={filters.industry}
                onChange={(e) => setFilters((prev) => ({ ...prev, industry: e.target.value }))}
                className="w-full py-1.5 px-3 text-[12px] rounded-lg border bg-[#141414] border-white/10 text-white focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-colors cursor-pointer"
              >
                <option value="" className="bg-[#141414] text-white">All Industries</option>
                {industries.slice(1).map((industry) => (
                  <option key={industry} value={industry} className="bg-[#141414] text-white">
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Investors Grid */}
        {investors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {investors.map((investor, index) => (
              <motion.div
                key={investor._id}
                className="rounded-[16px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-4 sm:p-5 flex flex-col justify-between hover:border-white/20 transition-all shadow-sm group"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-[14px] sm:text-[15px] font-semibold text-white tracking-tight group-hover:text-[#a78bfa] transition-colors">
                      {investor.name}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#7c3aed]/15 text-[#a78bfa] border border-[#7c3aed]/30 flex-shrink-0">
                      {investor.type}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-[12px] text-gray-400 leading-relaxed line-clamp-3 mb-3">
                    {investor.description}
                  </p>

                  <div className="space-y-2.5 mb-4">
                    {/* Industry Focus */}
                    <div className="p-2.5 rounded-xl bg-[#141414]/80 border border-white/5">
                      <h4 className="text-[10px] font-medium text-gray-400 mb-1.5 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#7c3aed]" />
                        Industry Focus
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {investor.industryFocus.map((industry) => (
                          <span
                            key={industry}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-gray-300 border border-white/5"
                          >
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Location and Range */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded-lg bg-[#141414]/60 border border-white/5">
                        <span className="text-[10px] text-gray-500 flex items-center gap-1 mb-0.5">
                          <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                          Location
                        </span>
                        <p className="text-[11px] font-medium text-gray-300 truncate">
                          {investor.location}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-[#141414]/60 border border-white/5">
                        <span className="text-[10px] text-gray-500 flex items-center gap-1 mb-0.5">
                          <DollarSign className="w-2.5 h-2.5 text-emerald-400" />
                          Range
                        </span>
                        <p className="text-[11px] font-medium text-gray-300">
                          ${investor.investmentRange.min / 1000}K - ${investor.investmentRange.max / 1000}K
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href={investor.contactLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full py-2 px-4 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Contact Investor</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                </a>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-8 sm:p-12 text-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#141414] border border-white/10 flex items-center justify-center mx-auto mb-3 text-gray-400 shadow-inner">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-[16px] sm:text-[18px] font-semibold mb-1.5 text-white">
              No Investors Found
            </h3>
            <p className="text-[11px] sm:text-[12px] text-gray-400 max-w-md mx-auto leading-relaxed">
              No investors found matching your filters. Try adjusting your search criteria to discover more opportunities.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InvestorContacts;