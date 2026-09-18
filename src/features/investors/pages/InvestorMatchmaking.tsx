import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

import { 
  Target, 
  Users, 
  MapPin, 
  ExternalLink, 
  Filter,
  Search, 
  TrendingUp, 
  Building, 
  Calendar, 
  Award, 
  Sparkles, 
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import api from '@/shared/lib/api';
import InsufficientCreditsModal from '@/features/credits/components/InsufficientCreditsModal';
import BackButton from '@/shared/components/ui/BackButton';

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
  const [creditError, setCreditError] = useState<{
    show: boolean;
    creditsRequired: number;
    creditsAvailable: number;
  } | null>(null);
  const [criteria, setCriteria] = useState<MatchingCriteria>({
    industry: '',
    stage: '',
    fundingAmount: '',
    location: '',
    businessModel: ''
  });
  const [hasSearched, setHasSearched] = useState(false);

  const { token } = useSelector((state: RootState) => state.auth);

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
      setCreditError(null);

      const response = await api.post(
        `/api/investors/match`,
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
      if (err.response?.status === 402) {
        setCreditError({
          show: true,
          creditsRequired: err.response.data.creditsRequired || 2,
          creditsAvailable: err.response.data.creditsAvailable || 0
        });
      } else {
        setError(err.response?.data?.message || 'Failed to find investor matches');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCreditModal = () => {
    setCreditError(null);
  };

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 selection:bg-[#7c3aed]/30">
      {/* Subtle Dot Grid Background Pattern like Dashboard */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Navigation */}
        <BackButton fallbackUrl="/dashboard" />

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-lg shadow-purple-950/20">
              <Target className="w-4 h-4 text-[#7c3aed]" />
            </div>
            <div>
              <h1 className="text-[20px] sm:text-[22px] font-semibold text-white tracking-tight">
                Investor Matchmaking
              </h1>
              <p className="text-[11px] sm:text-[12px] text-gray-400 font-normal mt-0.5">
                AI-powered investor matching for your startup
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 text-[12px] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-[11px] text-red-400 hover:text-red-300 font-medium ml-2 shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search Criteria Form Card */}
        <div className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-4 sm:p-5 mb-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-6 h-6 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center">
              <Filter className="w-3.5 h-3.5 text-[#7c3aed]" />
            </div>
            <h2 className="text-[13px] font-semibold text-white">Search Criteria</h2>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1.5">
                  Industry *
                </label>
                <select
                  value={criteria.industry}
                  onChange={(e) => setCriteria(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full px-3 py-2 text-[12px] rounded-xl border border-white/10 bg-[#141414] text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="" className="bg-[#141414] text-gray-400">Select Industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry} className="bg-[#141414] text-white">{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1.5">
                  Funding Stage *
                </label>
                <select
                  value={criteria.stage}
                  onChange={(e) => setCriteria(prev => ({ ...prev, stage: e.target.value }))}
                  className="w-full px-3 py-2 text-[12px] rounded-xl border border-white/10 bg-[#141414] text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="" className="bg-[#141414] text-gray-400">Select Stage</option>
                  {stages.map((stage) => (
                    <option key={stage} value={stage} className="bg-[#141414] text-white">{stage}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1.5">
                  Funding Amount
                </label>
                <select
                  value={criteria.fundingAmount}
                  onChange={(e) => setCriteria(prev => ({ ...prev, fundingAmount: e.target.value }))}
                  className="w-full px-3 py-2 text-[12px] rounded-xl border border-white/10 bg-[#141414] text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="" className="bg-[#141414] text-gray-400">Select Amount</option>
                  {fundingAmounts.map((amount) => (
                    <option key={amount} value={amount} className="bg-[#141414] text-white">{amount}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1.5">
                  Location
                </label>
                <select
                  value={criteria.location}
                  onChange={(e) => setCriteria(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 text-[12px] rounded-xl border border-white/10 bg-[#141414] text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="" className="bg-[#141414] text-gray-400">Select Location</option>
                  {locations.map((location) => (
                    <option key={location} value={location} className="bg-[#141414] text-white">{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1.5">
                  Business Model
                </label>
                <select
                  value={criteria.businessModel}
                  onChange={(e) => setCriteria(prev => ({ ...prev, businessModel: e.target.value }))}
                  className="w-full px-3 py-2 text-[12px] rounded-xl border border-white/10 bg-[#141414] text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="" className="bg-[#141414] text-gray-400">Select Model</option>
                  {businessModels.map((model) => (
                    <option key={model} value={model} className="bg-[#141414] text-white">{model}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !criteria.industry || !criteria.stage}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 px-4 text-[12px] font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] rounded-xl border-b-[4px] border-[#3904a6] hover:translate-y-[2px] active:translate-y-[4px] active:border-b-0 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:border-b-[4px] shadow-[0_10px_20px_-5px_rgba(124,58,237,0.3)]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Finding Matches...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Find Investor Matches (2 Credits)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {hasSearched && (
          <div>
            {matches.length > 0 ? (
              <div className="space-y-4">
                {/* Results Header */}
                <div className="rounded-xl bg-[#0a0a0a]/95 border border-white/10 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-[13px] font-semibold text-white">
                      Found {matches.length} Perfect Match{matches.length !== 1 ? 'es' : ''}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Ranked by compatibility
                  </span>
                </div>

                {/* Investor Matches */}
                <div className="space-y-4">
                  {matches.map((investor) => (
                    <div
                      key={investor._id}
                      className="rounded-[18px] bg-[#0a0a0a]/95 border border-white/10 p-4 sm:p-5 backdrop-blur-xl hover:border-[#7c3aed]/40 transition-all shadow-xl space-y-3.5"
                    >
                      {/* Top Row: Name, Type, Score */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-[15px] sm:text-[16px] font-semibold text-white">
                            {investor.name}
                          </h3>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#7c3aed]/10 text-[#a78bfa] border border-[#7c3aed]/20">
                            {investor.type}
                          </span>
                        </div>

                        {/* Match Score Badge */}
                        <div className="flex items-center gap-1.5 self-start sm:self-auto">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            investor.matchScore >= 80 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : investor.matchScore >= 60 
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {investor.matchScore}% Match
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[11px] sm:text-[12px] text-gray-300 leading-relaxed text-justify">
                        {investor.description}
                      </p>

                      {/* Match Reasons */}
                      <div className="p-3 rounded-xl bg-[#141414] border border-white/5">
                        <div className="text-[11px] font-medium text-[#a78bfa] mb-2 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#7c3aed]" />
                          Why This Match
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          {investor.matchReasons.map((reason, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-gray-300">
                              <Sparkles className="w-3 h-3 text-[#7c3aed] mt-0.5 shrink-0" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-[#141414] border border-white/5">
                          <div className="text-[11px] font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-blue-400" />
                            Industry Focus
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {investor.industryFocus.map((ind) => (
                              <span
                                key={ind}
                                className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              >
                                {ind}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-[#141414] border border-white/5">
                          <div className="text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                            Location & Range
                          </div>
                          <p className="text-[11px] text-gray-400 mb-0.5">
                            {investor.location}
                          </p>
                          <p className="text-[12px] font-semibold text-white">
                            ${(investor.investmentRange.min / 1000)}K - ${(investor.investmentRange.max / 1000)}K
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-[#141414] border border-white/5">
                          <div className="text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                            Portfolio Stats
                          </div>
                          <p className="text-[11px] text-gray-400">
                            <span className="text-white font-medium">{investor.portfolioSize}</span> companies
                          </p>
                          <p className="text-[11px] text-gray-400">
                            <span className="text-white font-medium">{investor.recentInvestments.length}</span> recent investments
                          </p>
                        </div>
                      </div>

                      {/* Recent Investments */}
                      {investor.recentInvestments.length > 0 && (
                        <div className="p-3 rounded-xl bg-[#141414] border border-white/5">
                          <div className="text-[11px] font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                            Recent Investments
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {investor.recentInvestments.slice(0, 5).map((investment, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              >
                                {investment}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contact Button */}
                      <a
                        href={investor.contactLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-[12px] font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] border-b-[3px] border-[#3904a6] hover:translate-y-[1px] active:translate-y-[3px] active:border-b-0 transition-all shadow-[0_4px_12px_rgba(124,58,237,0.2)]"
                      >
                        <Users className="w-3.5 h-3.5 mr-1.5" />
                        <span>Contact Investor</span>
                        <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[18px] bg-[#0a0a0a]/95 border border-white/10 p-8 text-center backdrop-blur-xl shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-center mx-auto mb-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <h3 className="text-[15px] font-semibold text-white mb-1.5">
                  No Matches Found
                </h3>
                <p className="text-[12px] text-gray-400 max-w-md mx-auto mb-4 leading-relaxed">
                  We couldn't find any investors matching your criteria. Try adjusting your search parameters to discover more opportunities.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-[#141414] border border-white/10 text-gray-400">
                    Try different industry
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-[#141414] border border-white/10 text-gray-400">
                    Adjust funding stage
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-[#141414] border border-white/10 text-gray-400">
                    Broaden location
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Insufficient Credits Modal */}
      <InsufficientCreditsModal
        isOpen={creditError?.show || false}
        onClose={handleCloseCreditModal}
        creditsRequired={creditError?.creditsRequired || 2}
        creditsAvailable={creditError?.creditsAvailable || 0}
      />
    </div>
  );
};

export default InvestorMatchmaking;