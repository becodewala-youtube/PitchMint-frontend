import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Brain, Users, MessageSquare, TrendingUp, Target, Filter, Calendar, Eye } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/constants';

// ============ BASE INTERFACES ============

// Base Activity Structure
interface BaseActivity {
  _id: string;
  userId: string;
  title: string;
  description: string;
  creditsUsed: number;
  relatedIdeaId?: string | null;
  createdAt: string;
  __v: number;
}

// ============ IDEA VALIDATION TYPES ============

interface IdeaScores {
  marketDemand: number;
  competition: number;
  monetization: number;
  overall: number;
}

interface AnalysisSection {
  score: number;
  text: string;
}

interface IdeaAnalysis {
  marketDemand: AnalysisSection;
  competition: AnalysisSection;
  monetization: AnalysisSection;
  overall: AnalysisSection;
}

interface IdeaValidationData {
  ideaText: string;
  scores: IdeaScores;
  analysis: IdeaAnalysis;
}

// ============ INVESTOR MATCHING TYPES ============

interface InvestmentRange {
  min: number;
  max: number;
}

interface InvestorMatch {
  name: string;
  type: string;
  industryFocus: string[];
  description: string;
  location: string;
  contactLink: string;
  investmentRange: InvestmentRange;
  matchScore: number;
  matchReasons: string[];
  recentInvestments: string[];
  portfolioSize: number;
}

interface InvestorCriteria {
  industry: string;
  stage: string;
  fundingAmount: string;
  location: string;
  businessModel?: string;
}

interface InvestorMatchingData {
  criteria: InvestorCriteria;
  matches: InvestorMatch[];
}

// ============ COMPETITOR ANALYSIS TYPES ============

interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface Competitor {
  name: string;
  description: string;
  swot: SwotAnalysis;
}

interface CompetitorAnalysisData {
  competitors: Competitor[];
  summary: string;
}

// ============ MARKET RESEARCH TYPES ============

interface MarketValue {
  value: number;
  description: string;
  sources?: string[];
  methodology?: string;
  timeline?: string;
}

interface MarketTrend {
  keyword: string;
  interest: number;
  growth: string;
}

interface Demographics {
  age: string;
  income: string;
  location: string;
  education: string;
}

interface Psychographics {
  values: string[];
  interests: string[];
  painPoints: string[];
}

interface Behaviors {
  buyingHabits: string;
  mediaConsumption: string;
  decisionFactors?: string[];
}

interface CustomerPersona {
  name: string;
  demographics: Demographics;
  psychographics: Psychographics;
  behaviors: Behaviors;
}

interface CompetitorActivity {
  name: string;
  fundingRounds: number;
  lastFunding: string;
  marketShare: string;
}

interface MarketResearchData {
  tam: MarketValue;
  sam: MarketValue;
  som: MarketValue;
  trends?: MarketTrend[];
  personas?: CustomerPersona[];
  competitorActivity?: CompetitorActivity[];
}

// ============ PITCH SIMULATOR TYPES ============

interface Feedback {
  rating: number;
  strengths: string[];
  improvements: string[];
  additionalAdvice: string;
}

interface QuestionAnswer {
  id: string;
  question: string;
  category: string;
  answer: string;
  feedback: Feedback | null;
  _id?: string;
}

interface PitchSimulatorData {
  questions?: QuestionAnswer[];
  question?: string;
  answer?: string;
  feedback?: Feedback;
}

// ============ COMBINED ACTIVITY TYPES ============

interface IdeaValidationActivity extends BaseActivity {
  serviceType: 'idea_validation';
  data: IdeaValidationData;
}

interface InvestorMatchingActivity extends BaseActivity {
  serviceType: 'investor_matching';
  data: InvestorMatchingData;
}

interface CompetitorAnalysisActivity extends BaseActivity {
  serviceType: 'competitor_analysis';
  data: CompetitorAnalysisData;
}

interface MarketResearchActivity extends BaseActivity {
  serviceType: 'market_research';
  data: MarketResearchData;
}

interface PitchSimulatorActivity extends BaseActivity {
  serviceType: 'pitch_simulator';
  data: PitchSimulatorData;
}

// Union type for all activities
type ActivityRecord = 
  | IdeaValidationActivity 
  | InvestorMatchingActivity 
  | CompetitorAnalysisActivity 
  | MarketResearchActivity 
  | PitchSimulatorActivity;

const History = () => {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityRecord | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { token } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useTheme();

  const serviceTypes = [
    { value: 'all', label: 'All Activities', icon: HistoryIcon },
    { value: 'idea_validation', label: 'Idea Validation', icon: Brain },
    { value: 'competitor_analysis', label: 'Competitor Analysis', icon: Users },
    { value: 'pitch_simulator', label: 'Pitch Arena', icon: MessageSquare },
    { value: 'market_research', label: 'Market Research', icon: TrendingUp },
    { value: 'investor_matching', label: 'Investor Matching', icon: Target }
  ];

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter(activity => activity.serviceType === selectedFilter));
    }
  }, [activities, selectedFilter]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (serviceType: string) => {
    const service = serviceTypes.find(s => s.value === serviceType);
    return service ? service.icon : HistoryIcon;
  };

  const getServiceColor = (serviceType: string) => {
    const colors = {
      idea_validation: 'from-purple-500/10 to-pink-500/10',
      competitor_analysis: 'from-blue-500/10 to-cyan-500/10',
      pitch_simulator: 'from-orange-500/10 to-red-500/10',
      market_research: 'from-green-500/10 to-emerald-500/10',
      investor_matching: 'from-indigo-500/10 to-purple-500/10'
    };
    return colors[serviceType as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const handleViewDetails = (activity: ActivityRecord) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const renderActivityDetails = (activity: ActivityRecord) => {
          switch (activity.serviceType) {

            case 'idea_validation':
  return (
    <div className="space-y-6">
      {/* Idea Description */}
      <div>
        <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Idea Overview
        </h4>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {activity.data.ideaText}
        </p>
      </div>

      {/* Scores Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/50' : 'bg-blue-50'}`}>
          <h5 className="font-bold text-blue-500">Market Demand</h5>
          <p className="text-lg font-bold">{activity.data.scores?.marketDemand || 0}/100</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-red-900/50' : 'bg-red-50'}`}>
          <h5 className="font-bold text-red-500">Competition</h5>
          <p className="text-lg font-bold">{activity.data.scores?.competition || 0}/100</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/50' : 'bg-green-50'}`}>
          <h5 className="font-bold text-green-500">Monetization</h5>
          <p className="text-lg font-bold">{activity.data.scores?.monetization || 0}/100</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-purple-900/50' : 'bg-purple-50'}`}>
          <h5 className="font-bold text-purple-500">Overall</h5>
          <p className="text-lg font-bold">{activity.data.scores?.overall || 0}/100</p>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="space-y-6">
        <div>
          <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Market Demand
          </h4>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {activity.data.analysis?.marketDemand?.text}
          </p>
        </div>
        <div>
          <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Competition
          </h4>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {activity.data.analysis?.competition?.text}
          </p>
        </div>
        <div>
          <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Monetization
          </h4>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {activity.data.analysis?.monetization?.text}
          </p>
        </div>
        <div>
          <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Overall Assessment
          </h4>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {activity.data.analysis?.overall?.text}
          </p>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Credits Used:
          </span>
          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {activity.creditsUsed}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Created:
          </span>
          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {new Date(activity.createdAt).toLocaleDateString()}
          </span>
        </div>
       
      </div>
    </div>
  );

           case 'investor_matching':
  return (
    <div className="space-y-6">
      {/* Search Criteria */}
      <div>
        <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Search Criteria
        </h4>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium">Industry:</span> {activity.data.criteria?.industry || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Stage:</span> {activity.data.criteria?.stage || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Funding:</span> {activity.data.criteria?.fundingAmount || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Location:</span> {activity.data.criteria?.location || 'N/A'}
            </div>
            {activity.data.criteria?.businessModel && (
              <div className="md:col-span-2">
                <span className="font-medium">Business Model:</span> {activity.data.criteria.businessModel}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Investor Matches */}
      <div>
        <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Investor Matches ({activity.data.matches?.length || 0} found)
        </h4>
        <div className="space-y-4">
          {activity.data.matches?.map((match, index) => (
            <div key={index} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h5 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {match.name}
                  </h5>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {match.type} • {match.location}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                    {match.matchScore}% Match
                  </span>
                  {match.portfolioSize && (
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Portfolio: {match.portfolioSize} companies
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {match.description}
              </p>

              {/* Investment Range */}
              {match.investmentRange && (
                <div className="mb-3">
                  <span className="font-medium text-sm">Investment Range: </span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    ${(match.investmentRange.min / 1000).toFixed(0)}K - ${(match.investmentRange.max / 1000).toFixed(0)}K
                  </span>
                </div>
              )}

              {/* Industry Focus */}
              {match.industryFocus && (
                <div className="mb-3">
                  <span className="font-medium text-sm block mb-2">Industry Focus:</span>
                  <div className="flex flex-wrap gap-2">
                    {match.industryFocus.map((industry, i) => (
                      <span key={i} className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Match Reasons */}
              {match.matchReasons && (
                <div className="mb-3">
                  <span className="font-medium text-sm block mb-2">Why This Is a Good Match:</span>
                  <ul className="space-y-1">
                    {match.matchReasons.map((reason, i) => (
                      <li key={i} className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        • {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recent Investments */}
              {match.recentInvestments && (
                <div className="mb-3">
                  <span className="font-medium text-sm block mb-2">Recent Investments:</span>
                  <div className="flex flex-wrap gap-1">
                    {match.recentInvestments.map((investment, i) => (
                      <span key={i} className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-600/50 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                        {investment}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Link */}
              {match.contactLink && (
                <div className="pt-2 border-t border-gray-300 dark:border-gray-600">
                  <a 
                    href={match.contactLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Contact / Apply
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

            
            case 'competitor_analysis':
  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div>
        <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Market Overview
        </h4>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
            {activity.data.summary}
          </p>
        </div>
      </div>

      {/* Competitors */}
      <div>
        <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Competitor Analysis ({activity.data.competitors?.length || 0} competitors)
        </h4>
        <div className="space-y-6">
          {activity.data.competitors?.map((competitor, index) => (
            <div key={index} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              {/* Competitor Header */}
              <h5 className={`font-bold text-lg mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {competitor.name}
              </h5>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                {competitor.description}
              </p>

              {/* SWOT Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths & Opportunities */}
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
                    <h6 className="font-bold text-green-600 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Strengths
                    </h6>
                    <ul className="space-y-1">
                      {competitor.swot?.strengths?.map((strength, i) => (
                        <li key={i} className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                          • {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                    <h6 className="font-bold text-blue-600 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Opportunities
                    </h6>
                    <ul className="space-y-1">
                      {competitor.swot?.opportunities?.map((opportunity, i) => (
                        <li key={i} className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                          • {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Weaknesses & Threats */}
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                    <h6 className="font-bold text-red-600 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      Weaknesses
                    </h6>
                    <ul className="space-y-1">
                      {competitor.swot?.weaknesses?.map((weakness, i) => (
                        <li key={i} className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                          • {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
                    <h6 className="font-bold text-yellow-600 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      Threats
                    </h6>
                    <ul className="space-y-1">
                      {competitor.swot?.threats?.map((threat, i) => (
                        <li key={i} className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                          • {threat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

            case 'market_research':
  return (
    <div className="space-y-6">
      {/* TAM/SAM/SOM Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/50' : 'bg-blue-50'}`}>
          <h5 className="font-bold text-blue-500">TAM (Total)</h5>
          <p className="text-lg font-bold">
            ${activity.data.tam?.value ? (activity.data.tam.value / 1000000000).toFixed(1) : '0'}B
          </p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Total Addressable Market
          </p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/50' : 'bg-green-50'}`}>
          <h5 className="font-bold text-green-500">SAM (Serviceable)</h5>
          <p className="text-lg font-bold">
            ${activity.data.sam?.value ? (activity.data.sam.value / 1000000000).toFixed(1) : '0'}B
          </p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Serviceable Addressable Market
          </p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-purple-900/50' : 'bg-purple-50'}`}>
          <h5 className="font-bold text-purple-500">SOM (Obtainable)</h5>
          <p className="text-lg font-bold">
            ${activity.data.som?.value ? (activity.data.som.value / 1000000).toFixed(0) : '0'}M
          </p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Serviceable Obtainable Market
          </p>
        </div>
      </div>

      {/* Detailed Market Analysis */}
      <div className="space-y-4">
        {activity.data.tam?.description && (
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <h6 className="font-bold text-blue-600 mb-2">TAM Analysis</h6>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              {activity.data.tam.description}
            </p>
            {activity.data.tam.sources && (
              <div className="mt-2">
                <span className="text-xs font-medium">Sources: </span>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {activity.data.tam.sources.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}
        
        {activity.data.sam?.description && (
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
            <h6 className="font-bold text-green-600 mb-2">SAM Analysis</h6>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              {activity.data.sam.description}
            </p>
            {activity.data.sam.methodology && (
              <div className="mt-2">
                <span className="text-xs font-medium">Methodology: </span>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {activity.data.sam.methodology}
                </span>
              </div>
            )}
          </div>
        )}
        
        {activity.data.som?.description && (
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
            <h6 className="font-bold text-purple-600 mb-2">SOM Analysis</h6>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              {activity.data.som.description}
            </p>
            {activity.data.som.timeline && (
              <div className="mt-2">
                <span className="text-xs font-medium">Timeline: </span>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {activity.data.som.timeline}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Market Trends */}
      {activity.data.trends && (
        <div>
          <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Market Trends
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activity.data.trends.map((trend, index) => (
              <div key={index} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <div className="flex justify-between items-center mb-1">
                  <h6 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {trend.keyword}
                  </h6>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {trend.interest}% Interest
                  </span>
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {trend.growth}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Personas */}
      {activity.data.personas && (
        <div>
          <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Customer Personas
          </h4>
          <div className="space-y-4">
            {activity.data.personas.map((persona, index) => (
              <div key={index} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h5 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {persona.name}
                </h5>
                
                {/* Demographics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h6 className="font-medium text-sm text-blue-500 mb-1">Demographics</h6>
                    <div className={`text-xs space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <p><span className="font-medium">Age:</span> {persona.demographics?.age}</p>
                      <p><span className="font-medium">Income:</span> {persona.demographics?.income}</p>
                      <p><span className="font-medium">Location:</span> {persona.demographics?.location}</p>
                      <p><span className="font-medium">Education:</span> {persona.demographics?.education}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h6 className="font-medium text-sm text-green-500 mb-1">Values & Interests</h6>
                    {persona.psychographics?.values && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {persona.psychographics.values.map((value, i) => (
                          <span key={i} className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'}`}>
                            {value}
                          </span>
                        ))}
                      </div>
                    )}
                    {persona.psychographics?.interests && (
                      <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className="font-medium">Interests: </span>
                        {persona.psychographics.interests.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pain Points */}
                {persona.psychographics?.painPoints && (
                  <div className="mb-3">
                    <h6 className="font-medium text-sm text-red-500 mb-1">Pain Points</h6>
                    <ul className="space-y-1">
                      {persona.psychographics.painPoints.map((pain, i) => (
                        <li key={i} className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          • {pain}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Behaviors */}
                {persona.behaviors && (
                  <div>
                    <h6 className="font-medium text-sm text-purple-500 mb-1">Behaviors</h6>
                    <div className={`text-xs space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {persona.behaviors.buyingHabits && (
                        <p><span className="font-medium">Buying Habits:</span> {persona.behaviors.buyingHabits}</p>
                      )}
                      {persona.behaviors.mediaConsumption && (
                        <p><span className="font-medium">Media Consumption:</span> {persona.behaviors.mediaConsumption}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitor Activity */}
      {activity.data.competitorActivity && (
        <div>
          <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Competitor Activity
          </h4>
          <div className="space-y-2">
            {activity.data.competitorActivity.map((competitor, index) => (
              <div key={index} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <div className="flex justify-between items-center">
                  <h6 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {competitor.name}
                  </h6>
                  <div className="flex gap-4 text-xs">
                    <span>Rounds: {competitor.fundingRounds}</span>
                    <span>Market Share: {competitor.marketShare}</span>
                  </div>
                </div>
                {competitor.lastFunding && competitor.lastFunding !== 'N/A' && (
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Last Funding: {competitor.lastFunding}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
           case 'pitch_simulator':
  return (
    <div className="space-y-6">
      <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Q&A Session
      </h4>

      {/* Case 1: Multiple generated questions */}
      {activity.data.questions?.map((qa: any, index: number) => (
        <div
          key={index}
          className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}
        >
          {/* Question */}
          <div
            className={`p-3 rounded-xl mb-3 ${
              darkMode ? '' : ''
            }`}
          >
            <h5 className="font-bold text-indigo-500">Q: {qa.question}</h5>
          </div>

          {/* Answer */}
          {qa.answer && (
            <div
              className={`p-3 rounded-xl mb-3 ${
                darkMode ? 'bg-green-900/50' : 'bg-green-50'
              }`}
            >
              <h5 className="font-bold text-green-500">A: {qa.answer}</h5>
            </div>
          )}

          {/* Feedback (if exists in array mode) */}
          {qa.feedback && (
            <div className="text-sm space-y-2">
              <p>
                <span className="font-semibold">Rating:</span> ⭐ {qa.feedback.rating}/5
              </p>
              {qa.feedback.strengths?.length > 0 && (
                <div>
                  <h6 className="font-semibold text-green-500">Strengths</h6>
                  <ul className="list-disc list-inside space-y-1">
                    {qa.feedback.strengths.map((point: string, idx: number) => (
                      <li
                        key={idx}
                        className={darkMode ? 'text-gray-300' : 'text-gray-700'}
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {qa.feedback.improvements?.length > 0 && (
                <div>
                  <h6 className="font-semibold text-red-500">Improvements</h6>
                  <ul className="list-disc list-inside space-y-1">
                    {qa.feedback.improvements.map((point: string, idx: number) => (
                      <li
                        key={idx}
                        className={darkMode ? 'text-gray-300' : 'text-gray-700'}
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {qa.feedback.additionalAdvice && (
                <div>
                  <h6 className="font-semibold text-blue-500">Additional Advice</h6>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {qa.feedback.additionalAdvice}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Case 2: Single answered question with feedback */}
      {activity.data.question && (
        <div
          className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}
        >
          {/* Question */}
          <div
            className={`p-3 rounded-xl mb-3 ${
              darkMode ? '' : ''
            }`}
          >
            <h5 className="font-bold text-indigo-500">Q: {activity.data.question}</h5>
          </div>

          {/* Answer */}
          {activity.data.answer && (
            <div
              className={`p-3 rounded-xl mb-3 ${
                darkMode ? 'bg-green-900/50' : 'bg-green-50'
              }`}
            >
              <h5 className="font-bold text-green-500 mb-2">Your Answer</h5>
              <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                {activity.data.answer}
              </p>
            </div>
          )}

          {/* Feedback */}
          {activity.data.feedback && (
            <div
              className={`p-4 rounded-xl ${
                darkMode ? 'bg-gray-800/70' : 'bg-gray-100'
              }`}
            >
              <h5 className="font-bold mb-3 text-yellow-500">Investor Feedback</h5>

              <p className="mb-2">
                <span className="font-semibold">Rating:</span> ⭐ {activity.data.feedback.rating}/5
              </p>

              {activity.data.feedback.strengths?.length > 0 && (
                <div className="mb-3">
                  <h6 className="font-semibold text-green-500">Strengths</h6>
                  <ul className="list-disc list-inside space-y-1">
                    {activity.data.feedback.strengths.map((point: string, idx: number) => (
                      <li
                        key={idx}
                        className={darkMode ? 'text-gray-300' : 'text-gray-700'}
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activity.data.feedback.improvements?.length > 0 && (
                <div className="mb-3">
                  <h6 className="font-semibold text-red-500">Improvements</h6>
                  <ul className="list-disc list-inside space-y-1">
                    {activity.data.feedback.improvements.map(
                      (point: string, idx: number) => (
                        <li
                          key={idx}
                          className={darkMode ? 'text-gray-300' : 'text-gray-700'}
                        >
                          {point}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {activity.data.feedback.additionalAdvice && (
                <div>
                  <h6 className="font-semibold text-blue-500">Additional Advice</h6>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {activity.data.feedback.additionalAdvice}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

            
            default:
              return (
                <pre className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} whitespace-pre-wrap`}>
                  {JSON.stringify((activity as any).data, null, 2)}
                </pre>
              );
          }
        };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

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
              <HistoryIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className={`page-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Activity
              <span className="ml-2 text-gradient-primary">
                History
              </span>
            </h1>
            <p className={`page-subtitle ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Track your startup validation journey
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} py-4 px-6 mb-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center mb-3">
              <Filter className="h-5 w-5 text-purple-500 mr-3" />
              <h2 className={`text-md font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Filter Activities
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {serviceTypes.map((service) => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.value}
                    onClick={() => setSelectedFilter(service.value)}
                    className={`flex items-center px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                      selectedFilter === service.value
                        ? 'bg-gradient-to-r from-cyan-500 to-cyan-500 text-white'
                        : darkMode
                          ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-3 h-3 mr-2" />
                    {service.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Activities List */}
          {filteredActivities.length > 0 ? (
            <div className="space-y-6">
              {filteredActivities.map((activity, index) => {
                const Icon = getServiceIcon(activity.serviceType);
                return (
                  <motion.div
                    key={activity._id}
                    className={`group card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} card-hover py-4 px-5`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className={`card-hover-effect bg-gradient-to-br ${getServiceColor(activity.serviceType)}`}></div>
                    <div className="relative flex items-start justify-between">
                      <div className="flex items-start flex-1">
                        <div className={`icon-container bg-gradient-to-br ${getServiceColor(activity.serviceType)} mr-4`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-md font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-purple-500 transition-colors duration-300`}>
                            {activity.title}
                          </h3>
                          <p className={`text-xs mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {activity.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {new Date(activity.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800'
                              }`}>
                                -{activity.creditsUsed} Credits
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewDetails(activity)}
                        className="btn-primary btn-primary-cyan text-xs flex"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-12 text-center`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="icon-container-lg bg-gray-500 mx-auto mb-8">
                <HistoryIcon className="h-12 w-12 text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                No Activity Found
              </h3>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {selectedFilter === 'all' 
                  ? 'You haven\'t used any services yet. Start validating your ideas!'
                  : `No ${serviceTypes.find(s => s.value === selectedFilter)?.label} activities found.`
                }
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Activity Details Modal */}
      {showModal && selectedActivity && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowModal(false)}></div>
            
            <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto p-8`}>
              <div className="flex justify-between items-start mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedActivity.title}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-2 rounded-xl ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  ✕
                </button>
              </div>
              
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} max-h-96 overflow-y-auto`}>
                {renderActivityDetails(selectedActivity)}
              </div>
            </div>
          </div>
        </div>
      )}

     
    </div>
  );
};

export default History;