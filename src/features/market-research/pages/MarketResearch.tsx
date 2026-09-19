import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';


import {
  TrendingUp,
  Users,
  Target,
  Globe,
  BarChart3,
  PieChart,
  Search,
  RefreshCw,
  Sparkles,
  DollarSign,
  Award,
  Zap,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import api from '@/shared/lib/api';
import InsufficientCreditsModal from '@/features/credits/components/InsufficientCreditsModal';
import BackButton from '@/shared/components/ui/BackButton';

interface MarketData {
  tam: {
    value: number;
    description: string;
    sources: string[];
  };
  sam: {
    value: number;
    description: string;
    methodology: string;
  };
  som: {
    value: number;
    description: string;
    timeline: string;
  };
  trends: {
    keyword: string;
    interest: number;
    growth: string;
  }[];
  personas: {
    name: string;
    demographics: {
      age: string;
      income: string;
      location: string;
      education: string;
    };
    psychographics: {
      values: string[];
      interests: string[];
      painPoints: string[];
    };
    behaviors: {
      buyingHabits: string;
      mediaConsumption: string;
      decisionFactors: string[];
    };
  }[];
  competitorActivity: {
    name: string;
    fundingRounds: number;
    lastFunding: string;
    marketShare: string;
  }[];
}

const MarketResearch = () => {
  const [ideaText, setIdeaText] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetRegion, setTargetRegion] = useState('');
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creditError, setCreditError] = useState<{
    show: boolean;
    creditsRequired: number;
    creditsAvailable: number;
  } | null>(null);
  
  const { token } = useSelector((state: RootState) => state.auth);

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education',
    'Entertainment', 'Food & Beverage', 'Transportation', 'Real Estate',
    'Manufacturing', 'Energy', 'Agriculture', 'SaaS', 'Mobile Apps',
    'AI/ML', 'Blockchain', 'IoT', 'Cybersecurity'
  ];

  const regions = [
    'Global', 'North America', 'Europe', 'Asia Pacific', 'Latin America',
    'Middle East & Africa', 'United States', 'Canada', 'United Kingdom',
    'Germany', 'France', 'India', 'China', 'Japan', 'Australia'
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setCreditError(null);

      const response = await api.post(
        `/api/market-research/analyze`,
        { ideaText, industry, targetRegion },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMarketData(response.data);
    } catch (err: unknown) {
      if (err.response?.status === 402) {
        setCreditError({
          show: true,
          creditsRequired: err.response.data.creditsRequired,
          creditsAvailable: err.response.data.creditsAvailable
        });
      } else {
        setError(getErrorMessage(err, 'Failed to analyze market'));
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
              <TrendingUp className="w-4 h-4 text-[#7c3aed]" />
            </div>
            <div>
              <h1 className="text-[20px] sm:text-[22px] font-semibold text-white tracking-tight">
                 Market Research
              </h1>
              <p className="text-[11px] sm:text-[12px] text-gray-400 font-normal mt-0.5">
                Analyze market potential, TAM/SAM/SOM sizing, and customer personas
              </p>
            </div>
          </div>
        </div>

        {/* Input Form Card */}
        <div className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-4 sm:p-5 mb-6 shadow-2xl">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-medium text-gray-300 mb-1.5">
                <Target className="w-3.5 h-3.5 text-[#7c3aed]" />
                Startup Idea
              </label>
              <textarea
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 text-[12px] rounded-xl border border-white/10 bg-[#141414] text-white placeholder-gray-500 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 focus:outline-none transition-all leading-relaxed resize-y"
                placeholder="Describe your startup idea in detail..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-gray-300 mb-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-[#7c3aed]" />
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 text-[12px] rounded-xl border border-white/10 bg-[#141414] text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="" className="bg-[#141414] text-gray-400">Select Industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind} className="bg-[#141414] text-white">{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-gray-300 mb-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#7c3aed]" />
                  Target Region
                </label>
                <select
                  value={targetRegion}
                  onChange={(e) => setTargetRegion(e.target.value)}
                  className="w-full px-3 py-2 text-[12px] rounded-xl border border-white/10 bg-[#141414] text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="" className="bg-[#141414] text-gray-400">Select Region</option>
                  {regions.map((region) => (
                    <option key={region} value={region} className="bg-[#141414] text-white">{region}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !ideaText.trim() || !industry || !targetRegion}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 px-4 text-[12px] font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] rounded-xl border-b-[4px] border-[#3904a6] hover:translate-y-[2px] active:translate-y-[4px] active:border-b-0 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:border-b-[4px] shadow-[0_10px_20px_-5px_rgba(124,58,237,0.3)]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing Market...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Generate Market Analysis (2 Credits)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 text-[12px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Market Analysis Results */}
        {marketData && (
          <div className="space-y-6">
            {/* TAM, SAM, SOM */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-[#0a0a0a] border border-white/10 flex items-center justify-center">
                  <PieChart className="w-3.5 h-3.5 text-[#7c3aed]" />
                </div>
                <h2 className="text-[14px] sm:text-[15px] font-semibold text-white">Market Opportunity</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { 
                    title: 'Total Addressable Market', 
                    subtitle: 'TAM',
                    data: marketData.tam, 
                    icon: Globe,
                    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                    iconColor: 'text-blue-400',
                  },
                  { 
                    title: 'Serviceable Addressable Market', 
                    subtitle: 'SAM',
                    data: marketData.sam, 
                    icon: Target,
                    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    iconColor: 'text-emerald-400',
                  },
                  { 
                    title: 'Serviceable Obtainable Market', 
                    subtitle: 'SOM',
                    data: marketData.som, 
                    icon: BarChart3,
                    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                    iconColor: 'text-purple-400',
                  }
                ].map((market) => (
                  <div
                    key={market.title}
                    className="rounded-[18px] bg-[#0a0a0a]/95 border border-white/10 p-4 backdrop-blur-xl hover:border-[#7c3aed]/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-7 h-7 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center">
                          <market.icon className={`w-3.5 h-3.5 ${market.iconColor}`} />
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${market.badgeColor}`}>
                          {market.subtitle}
                        </span>
                      </div>

                      <div className="text-[11px] font-medium text-gray-400 mb-1">
                        {market.title}
                      </div>

                      <div className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                        ${(market.data.value / 1000000).toFixed(1)}B
                      </div>

                      <p className="text-[11px] text-gray-400 leading-relaxed text-justify">
                        {market.data.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Trends & Competitor Activity */}
            <div className="rounded-[18px] bg-[#0a0a0a]/95 border border-white/10 p-4 sm:p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-[#7c3aed]" />
                </div>
                <h2 className="text-[14px] sm:text-[15px] font-semibold text-white">
                  Market Trends & Competitor Activity
                </h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Search Trends */}
                <div>
                  <h3 className="text-[12px] font-medium text-gray-300 mb-2.5 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Search Trends
                  </h3>
                  <div className="space-y-2">
                    {marketData.trends.map((trend, index) => (
                      <div
                        key={index}
                        className="p-2.5 rounded-xl bg-[#141414] border border-white/5"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[12px] font-medium text-white">
                            {trend.keyword}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            trend.interest >= 70 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : trend.interest >= 40 
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {trend.interest}%
                          </span>
                        </div>
                        <div className="w-full rounded-full h-1 bg-white/5 overflow-hidden">
                          <div
                            className={`h-1 rounded-full ${
                              trend.interest >= 70 
                                ? 'bg-emerald-500' 
                                : trend.interest >= 40 
                                ? 'bg-amber-500' 
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${trend.interest}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
                          <TrendingUp className="w-2.5 h-2.5" />
                          Growth: {trend.growth}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitor Activity */}
                <div>
                  <h3 className="text-[12px] font-medium text-gray-300 mb-2.5 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Competitor Activity
                  </h3>
                  <div className="space-y-2">
                    {marketData.competitorActivity.map((competitor, index) => (
                      <div
                        key={index}
                        className="p-2.5 rounded-xl bg-[#141414] border border-white/5"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[12px] font-semibold text-white">
                            {competitor.name}
                          </span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                            {competitor.marketShare}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400 pt-1.5 border-t border-white/5">
                          <div>
                            <span className="text-gray-500">Rounds: </span>
                            <span className="text-white font-medium">{competitor.fundingRounds}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Last: </span>
                            <span className="text-white font-medium">{competitor.lastFunding}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Personas */}
            <div className="rounded-[18px] bg-[#0a0a0a]/95 border border-white/10 p-4 sm:p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-[#7c3aed]" />
                </div>
                <h2 className="text-[14px] sm:text-[15px] font-semibold text-white">
                  Customer Personas
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {marketData.personas.map((persona, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 rounded-xl bg-[#141414] border border-white/5 space-y-3"
                  >
                    <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
                      <div className="w-6 h-6 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center">
                        <Users className="w-3 h-3 text-[#7c3aed]" />
                      </div>
                      <h3 className="text-[13px] font-semibold text-white">
                        {persona.name}
                      </h3>
                    </div>
                    
                    <div className="space-y-2.5">
                      {/* Demographics */}
                      <div className="p-2.5 rounded-lg bg-[#0a0a0a] border border-white/5">
                        <h4 className="font-medium mb-1.5 text-[11px] text-blue-400 flex items-center gap-1.5">
                          <Award className="w-3 h-3" />
                          Demographics
                        </h4>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                          <div>
                            <span className="text-gray-500">Age: </span>
                            <span className="text-gray-200">{persona.demographics.age}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Income: </span>
                            <span className="text-gray-200">{persona.demographics.income}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Location: </span>
                            <span className="text-gray-200">{persona.demographics.location}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Education: </span>
                            <span className="text-gray-200">{persona.demographics.education}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Values & Interests */}
                      <div className="p-2.5 rounded-lg bg-[#0a0a0a] border border-white/5">
                        <h4 className="font-medium text-[11px] mb-1.5 text-emerald-400 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          Values & Interests
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {persona.psychographics.interests.map((interest, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Pain Points */}
                      <div className="p-2.5 rounded-lg bg-[#0a0a0a] border border-white/5">
                        <h4 className="font-medium text-[11px] mb-1.5 text-amber-400 flex items-center gap-1.5">
                          <Target className="w-3 h-3" />
                          Pain Points
                        </h4>
                        <ul className="text-[11px] space-y-1 text-gray-300">
                          {persona.psychographics.painPoints.map((pain, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-400 shrink-0">•</span>
                              <span>{pain}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Buying Behavior */}
                      <div className="p-2.5 rounded-lg bg-[#0a0a0a] border border-white/5">
                        <h4 className="font-medium text-[11px] mb-1.5 text-purple-400 flex items-center gap-1.5">
                          <BarChart3 className="w-3 h-3" />
                          Buying Behavior
                        </h4>
                        <div className="text-[11px] space-y-1 text-gray-300">
                          <div>
                            <span className="text-gray-500">Habits: </span>
                            <span className="text-gray-200">{persona.behaviors.buyingHabits}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Media: </span>
                            <span className="text-gray-200">{persona.behaviors.mediaConsumption}</span>
                          </div>
                          {persona.behaviors.decisionFactors && persona.behaviors.decisionFactors.length > 0 && (
                            <div className="pt-1">
                              <span className="text-gray-500 block mb-1">Decision Factors:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {persona.behaviors.decisionFactors.map((factor, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                    {factor}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Insufficient Credits Modal */}
      <InsufficientCreditsModal
        isOpen={creditError?.show || false}
        onClose={handleCloseCreditModal}
        creditsRequired={creditError?.creditsRequired || 0}
        creditsAvailable={creditError?.creditsAvailable || 0}
      />
    </div>
  );
};

export default MarketResearch;