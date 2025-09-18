import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, Globe, BarChart3, PieChart, Search, RefreshCw } from 'lucide-react';
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
            <div className="icon-container icon-blue mx-auto mb-2">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h1 className={`page-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              AI-Powered
              <span className="ml-2 text-gradient-blue">
                Market Research
              </span>
            </h1>
            <p className={`page-subtitle ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Get comprehensive market analysis with TAM, SAM, SOM and customer personas
            </p>
          </motion.div>

          {/* Input Form */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} py-4 px-5 mb-12`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div>
                <label className={`block text-md font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Startup Idea
                </label>
                <textarea
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  rows={4}
                  className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
                  placeholder="Describe your startup idea in detail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-md font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
                  >
                    <option value="">Select Industry</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-md font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Target Region
                  </label>
                  <select
                    value={targetRegion}
                    onChange={(e) => setTargetRegion(e.target.value)}
                    className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
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
                className={`w-full btn-primary btn-primary-blue ${
                  (loading || !ideaText.trim() || !industry || !targetRegion) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={!(loading || !ideaText.trim() || !industry || !targetRegion) ? { scale: 1.05 } : {}}
                whileTap={!(loading || !ideaText.trim() || !industry || !targetRegion) ? { scale: 0.95 } : {}}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-3" />
                    Analyzing Market...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Search className="w-6 h-6 mr-3" />
                    Generate Market Analysis (2 Credits)
                  </div>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Market Analysis Results */}
          {marketData && (
            <div className="space-y-8">
              {/* TAM, SAM, SOM */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {[
                  { 
                    title: 'Total Addressable Market (TAM)', 
                    data: marketData.tam, 
                    icon: Globe,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    title: 'Serviceable Addressable Market (SAM)', 
                    data: marketData.sam, 
                    icon: Target,
                    color: 'from-green-500 to-emerald-500'
                  },
                  { 
                    title: 'Serviceable Obtainable Market (SOM)', 
                    data: marketData.som, 
                    icon: BarChart3,
                    color: 'from-purple-500 to-pink-500'
                  }
                ].map((market, index) => (
                  <motion.div
                    key={market.title}
                    className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} card-hover p-8`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                  >
                    <div className={`icon-container bg-gradient-to-br ${market.color} mb-6`}>
                      <market.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {market.title}
                    </h3>
                    <div className={`text-3xl font-bold mb-4 text-gradient-blue`}>
                      ${(market.data.value / 1000000).toFixed(1)}B
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {market.data.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Market Trends */}
              <motion.div 
                className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <h2 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                  <TrendingUp className="h-8 w-8 mr-4 text-green-500" />
                  Market Trends & Competitor Activity
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Trends */}
                  <div>
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Search Trends
                    </h3>
                    <div className="space-y-4">
                      {marketData.trends.map((trend, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {trend.keyword}
                            </h4>
                            <span className={`text-sm font-bold ${
                              trend.interest >= 70 ? 'text-green-500' :
                              trend.interest >= 40 ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                              {trend.interest}%
                            </span>
                          </div>
                          <div className={`w-full bg-gray-200 rounded-full h-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                            <div
                              className={`h-2 rounded-full ${
                                trend.interest >= 70 ? 'bg-green-500' :
                                trend.interest >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${trend.interest}%` }}
                            ></div>
                          </div>
                          <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Growth: {trend.growth}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Competitor Activity */}
                  <div>
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Competitor Activity
                    </h3>
                    <div className="space-y-4">
                      {marketData.competitorActivity.map((competitor, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                        >
                          <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {competitor.name}
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Funding Rounds: 
                              </span>
                              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {competitor.fundingRounds}
                              </span>
                            </div>
                            <div>
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Market Share: 
                              </span>
                              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {competitor.marketShare}
                              </span>
                            </div>
                          </div>
                          <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Last Funding: {competitor.lastFunding}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Customer Personas */}
              <motion.div 
                className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <h2 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                  <Users className="h-8 w-8 mr-4 text-blue-500" />
                  Customer Personas
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {marketData.personas.map((persona, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                    >
                      <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {persona.name}
                      </h3>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className={`font-semibold mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            Demographics
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Age: </span>
                              <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>{persona.demographics.age}</span>
                            </div>
                            <div>
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Income: </span>
                              <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>{persona.demographics.income}</span>
                            </div>
                            <div>
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Location: </span>
                              <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>{persona.demographics.location}</span>
                            </div>
                            <div>
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Education: </span>
                              <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>{persona.demographics.education}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className={`font-semibold mb-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                            Values & Interests
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {persona.psychographics.interests.map((interest, i) => (
                              <span key={i} className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'}`}>
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className={`font-semibold mb-3 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                            Pain Points
                          </h4>
                          <ul className="text-sm space-y-1">
                            {persona.psychographics.painPoints.map((pain, i) => (
                              <li key={i} className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                • {pain}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className={`font-semibold mb-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                            Buying Behavior
                          </h4>
                          <div className="text-sm space-y-2">
                            <div>
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Habits: </span>
                              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{persona.behaviors.buyingHabits}</span>
                            </div>
                            <div>
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Media: </span>
                              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{persona.behaviors.mediaConsumption}</span>
                            </div>
                            <div>
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Decision Factors: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {persona.behaviors.decisionFactors.map((factor, i) => (
                                  <span key={i} className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800'}`}>
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