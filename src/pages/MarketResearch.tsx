import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, Globe, BarChart3, PieChart, Search, RefreshCw, Sparkles, DollarSign, Award, Zap, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { clearError } from '../store/slices/ideaSlice';
import InsufficientCreditsModal from '../components/modals/InsufficientCreditsModal';

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
  const { darkMode } = useTheme();
  const dispatch = useDispatch();

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

      const response = await axios.post(
        `${API_URL}/api/market-research/analyze`,
        { ideaText, industry, targetRegion },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMarketData(response.data);
    } catch (err: any) {
      if (err.response?.status === 402) {
        setCreditError({
          show: true,
          creditsRequired: err.response.data.creditsRequired,
          creditsAvailable: err.response.data.creditsAvailable
        });
      } else {
        setError(err.response?.data?.message || 'Failed to analyze market');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCreditModal = () => {
    setCreditError(null);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
       
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        {/* Floating Elements */}
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-2xl ${darkMode ? 'shadow-blue-500/50' : 'shadow-blue-500/30'}`}>
                <TrendingUp className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
              </div>
              <div>
                <h1 className={`text-lgz md:text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI-Powered{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    Market Research
                  </span>
                </h1>
              </div>
            </div>
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium flex items-center justify-center gap-2`}>
              <Sparkles className="w-4 h-4 text-blue-400" />
              Get comprehensive market analysis with TAM, SAM, SOM and customer personas
            </p>
          </div>
        </motion.div>

        {/* Input Form */}
        <motion.div 
          className={`relative overflow-hidden rounded-3xl p-3  sm:p-3 mb-4 ${
            darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
          } backdrop-blur-xl`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form onSubmit={handleAnalyze} className="space-y-3">
            <div>
              <label className={`flex items-center gap-2 text-xs sm:text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg`}>
                  <Target className="w-4 h-4 text-white" />
                </div>
                Startup Idea
              </label>
              <textarea
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 text-xs sm:text-sm rounded-2xl border-2 transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-800/50 text-white border-gray-700 placeholder-gray-500 focus:border-blue-500 focus:bg-gray-800'
                    : 'bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:border-blue-500 focus:bg-white'
                } focus:ring-1 focus:ring-blue-500/20 focus:outline-none`}
                placeholder="Describe your startup idea in detail..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`flex items-center gap-2 text-xs sm:text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={`w-full px-6 py-1 sm:py-2 text-xs sm:text-sm rounded-2xl border-2 transition-all duration-300 ${
                    darkMode
                      ? 'bg-gray-800/50 text-white border-gray-700 focus:border-blue-500 focus:bg-gray-800'
                      : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-blue-500 focus:bg-white'
                  } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                >
                  <option value="">Select Industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`flex items-center gap-2 text-xs sm:text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Globe className="w-4 h-4 text-cyan-500" />
                  Target Region
                </label>
                <select
                  value={targetRegion}
                  onChange={(e) => setTargetRegion(e.target.value)}
                  className={`w-full px-6 py-1 sm:py-2 text-xs sm:text-sm rounded-2xl border-2 transition-all duration-300 ${
                    darkMode
                      ? 'bg-gray-800/50 text-white border-gray-700 focus:border-cyan-500 focus:bg-gray-800'
                      : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-cyan-500 focus:bg-white'
                  } focus:ring-2 focus:ring-cyan-500/20 focus:outline-none`}
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading || !ideaText.trim() || !industry || !targetRegion}
              className={`w-full flex justify-center items-center py-1 sm:py-2 px-8 rounded-xl text-xs sm:text-sm font-bold text-white transition-all duration-300 shadow-xl ${
                (loading || !ideaText.trim() || !industry || !targetRegion)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105'
              }`}
              whileHover={!(loading || !ideaText.trim() || !industry || !targetRegion) ? { scale: 1.05 } : {}}
              whileTap={!(loading || !ideaText.trim() || !industry || !targetRegion) ? { scale: 0.95 } : {}}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                  Analyzing Market...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-3" />
                  Generate Market Analysis (2 Credits)
                  <ArrowRight className="w-5 h-5 ml-3" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Market Analysis Results */}
        {marketData && (
          <div className="space-y-8">
            {/* TAM, SAM, SOM */}
            <div>
              <h2 className={`text-md md:text-xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Market{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Opportunity
                </span>
              </h2>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {[
                  { 
                    title: 'Total Addressable Market', 
                    subtitle: 'TAM',
                    data: marketData.tam, 
                    icon: Globe,
                    gradient: 'from-blue-600 to-cyan-500',
                    bgGradient: 'from-blue-500/10 to-cyan-500/10'
                  },
                  { 
                    title: 'Serviceable Addressable Market', 
                    subtitle: 'SAM',
                    data: marketData.sam, 
                    icon: Target,
                    gradient: 'from-emerald-600 to-teal-500',
                    bgGradient: 'from-emerald-500/10 to-teal-500/10'
                  },
                  { 
                    title: 'Serviceable Obtainable Market', 
                    subtitle: 'SOM',
                    data: marketData.som, 
                    icon: BarChart3,
                    gradient: 'from-purple-600 to-fuchsia-500',
                    bgGradient: 'from-purple-500/10 to-fuchsia-500/10'
                  }
                ].map((market, index) => (
                  <motion.div
                    key={market.title}
                    className={`group relative overflow-hidden rounded-2xl p-3 ${
                      darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
                    } backdrop-blur-xl hover:scale-105 transition-all duration-500`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -10 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${market.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className={`absolute -inset-1 bg-gradient-to-br ${market.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                    
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${market.gradient} flex items-center justify-center mb-3 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <market.icon className="w-4 h-4 text-white" />
                      </div>
                      
                      <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {market.subtitle}
                      </div>
                      <h3 className={`text-sm font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {market.title}
                      </h3>
                      
                      <div className={`text-xl font-black mb-2 bg-gradient-to-r ${market.gradient} bg-clip-text text-transparent`}>
                        ${(market.data.value / 1000000).toFixed(1)}B
                      </div>
                      
                      <p className={`text-xs text-justify leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {market.data.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Market Trends & Competitor Activity */}
            <motion.div 
              className={`relative overflow-hidden rounded-3xl p-3 ${
                darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
              } backdrop-blur-xl`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg`}>
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className={`text-sm sm:text-md font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Market Trends & Competitor Activity
                </h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Search Trends */}
                <div>
                  <h3 className={`text-sm font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Search Trends
                  </h3>
                  <div className="space-y-3">
                    {marketData.trends.map((trend, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-xl ${darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-gray-100 border border-gray-200'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-bold text-xs sm:text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {trend.keyword}
                          </h4>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            trend.interest >= 70 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                              : trend.interest >= 40 
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                              : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                          }`}>
                            {trend.interest}%
                          </span>
                        </div>
                        <div className={`w-full rounded-full h-1 sm:h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                          <motion.div
                            className={`h-1 sm:h-2 rounded-full bg-gradient-to-r ${
                              trend.interest >= 70 
                                ? 'from-emerald-500 to-teal-500'
                                : trend.interest >= 40 
                                ? 'from-amber-500 to-orange-500'
                                : 'from-red-500 to-pink-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${trend.interest}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          ></motion.div>
                        </div>
                        <div className={`text-xs mt-2 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <TrendingUp className="w-3 h-3" />
                          Growth: {trend.growth}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitor Activity */}
                <div>
                  <h3 className={`text-sm font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <DollarSign className="w-4 h-4 text-green-500" />
                    Competitor Activity
                  </h3>
                  <div className="space-y-1 sm:space-y-2">
                    {marketData.competitorActivity.map((competitor, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-xl ${darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-gray-100 border border-gray-200'}`}
                      >
                        <h4 className={`font-bold text-sm mb-2 sm:mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {competitor.name}
                        </h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              Funding Rounds:
                            </span>
                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {competitor.fundingRounds}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              Market Share:
                            </span>
                            <span className={`text-xs sm:text-sm sm:font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {competitor.marketShare}
                            </span>
                          </div>
                          <div className={`pt-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              Last Funding: {competitor.lastFunding}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Customer Personas */}
            <motion.div 
              className={`relative overflow-hidden rounded-3xl p-2 sm:p-3 ${
                darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
              } backdrop-blur-xl`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-lg`}>
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h2 className={`text-sm sm:text-md font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Customer Personas
                </h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {marketData.personas.map((persona, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-gray-100 border border-gray-200'}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-lg`}>
                        <Users className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                      </div>
                      <h3 className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {persona.name}
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Demographics */}
                      <div className={`p-2 rounded-xl ${darkMode ? 'bg-blue-900/20 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                        <h4 className="font-bold mb-3 text-sm text-blue-500 flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Demographics
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Age: </span>
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>{persona.demographics.age}</span>
                          </div>
                          <div>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Income: </span>
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>{persona.demographics.income}</span>
                          </div>
                          <div>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Location: </span>
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>{persona.demographics.location}</span>
                          </div>
                          <div>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Education: </span>
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>{persona.demographics.education}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Values & Interests */}
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-emerald-900/20 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                        <h4 className="font-bold text-sm mb-3 text-emerald-500 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Values & Interests
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {persona.psychographics.interests.map((interest, i) => (
                            <span key={i} className={`px-3 py-1 rounded-lg text-xs font-semibold ${darkMode ? 'bg-emerald-600/30 text-emerald-300' : 'bg-emerald-200 text-emerald-800'}`}>
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Pain Points */}
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-orange-900/20 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'}`}>
                        <h4 className="font-bold text-sm mb-3 text-orange-500 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Pain Points
                        </h4>
                        <ul className="text-xs space-y-2">
                          {persona.psychographics.painPoints.map((pain, i) => (
                            <li key={i} className={`flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <span className="text-orange-500 mr-2">•</span>
                              {pain}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Buying Behavior */}
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-purple-900/20 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                        <h4 className="font-bold text-sm mb-3 text-purple-500 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          Buying Behavior
                        </h4>
                        <div className="text-xs space-y-3">
                          <div>
                            <span className={`font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Habits: </span>
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{persona.behaviors.buyingHabits}</span>
                          </div>
                          <div>
                            <span className={`font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Media: </span>
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{persona.behaviors.mediaConsumption}</span>
                          </div>
                          <div>
                            <span className={`font-semibold block mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Decision Factors: </span>
                            <div className="flex flex-wrap gap-2">
                              {persona.behaviors.decisionFactors.map((factor, i) => (
                                <span key={i} className={`px-3 py-1 rounded-lg text-xs font-semibold ${darkMode ? 'bg-purple-600/30 text-purple-300' : 'bg-purple-200 text-purple-800'}`}>
                                  {factor}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div 
            className={`mt-6 p-4 rounded-xl border ${darkMode ? 'bg-red-900/20 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
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