import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchUserHistory } from '../store/slices/historySlice';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, Brain, Users, MessageSquare, TrendingUp, Target, Filter, Calendar, Eye, X, Sparkles, Zap } from 'lucide-react';
import ActivityHistorySkeleton from '../components/skeleton/ActivityHistorySkeleton';

// ============ ALL YOUR EXISTING INTERFACES - UNCHANGED ============
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

type ActivityRecord = 
  | IdeaValidationActivity 
  | InvestorMatchingActivity 
  | CompetitorAnalysisActivity 
  | MarketResearchActivity 
  | PitchSimulatorActivity;

const History = () => {
  const [filteredActivities, setFilteredActivities] = useState<ActivityRecord[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityRecord | null>(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { history, loading, error, fetchedOnce } = useSelector(
    (state: RootState) => state.history
  );

  const { token } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useTheme();

  const serviceTypes = [
    { value: 'all', label: 'All Activities', icon: HistoryIcon, gradient: 'from-purple-600 to-pink-600' },
    { value: 'idea_validation', label: 'Idea Validation', icon: Brain, gradient: 'from-violet-600 to-purple-600' },
    { value: 'competitor_analysis', label: 'Competitor Analysis', icon: Users, gradient: 'from-cyan-600 to-teal-600' },
    { value: 'pitch_simulator', label: 'Pitch Arena', icon: MessageSquare, gradient: 'from-orange-600 to-red-600' },
    { value: 'market_research', label: 'Market Research', icon: TrendingUp, gradient: 'from-green-600 to-emerald-600' },
    { value: 'investor_matching', label: 'Investor Matching', icon: Target, gradient: 'from-indigo-600 to-purple-600' }
  ];


useEffect(() => {
  if (token && !fetchedOnce) {
    dispatch(fetchUserHistory());
  }
}, [token, fetchedOnce, dispatch]);

useEffect(() => {
  if (selectedFilter === 'all') {
    setFilteredActivities(history as ActivityRecord[]);
  } else {
    setFilteredActivities(history .filter(activity => activity.serviceType === selectedFilter));
  }
}, [history, selectedFilter]);

  

  const getServiceIcon = (serviceType: string) => {
    const service = serviceTypes.find(s => s.value === serviceType);
    return service ? service.icon : HistoryIcon;
  };

  const getServiceGradient = (serviceType: string) => {
    const service = serviceTypes.find(s => s.value === serviceType);
    return service ? service.gradient : 'from-gray-600 to-gray-700';
  };

  const handleViewDetails = (activity: ActivityRecord) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  // YOUR COMPLETE renderActivityDetails FUNCTION - UNCHANGED
  const renderActivityDetails = (activity: ActivityRecord) => {
    switch (activity.serviceType) {
      case 'idea_validation':
        return (
          <div className="sm:space-y-4 space-y-4">
            <div>
              <h4 className={`font-bold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Idea Overview
              </h4>
              <p className={`text-sm text-justify ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {activity.data.ideaText}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-md">
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/50' : 'bg-blue-50'} text-xs sm:text-md`}>
                <h5 className="font-bold text-blue-500">Market Demand</h5>
                <p className="font-bold">{activity.data.scores?.marketDemand || 0}/100</p>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-red-900/50' : 'bg-red-50'}`}>
                <h5 className="font-bold text-red-500">Competition</h5>
                <p className="font-bold">{activity.data.scores?.competition || 0}/100</p>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/50' : 'bg-green-50'}`}>
                <h5 className="font-bold text-green-500">Monetization</h5>
                <p className="font-bold">{activity.data.scores?.monetization || 0}/100</p>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-purple-900/50' : 'bg-purple-50'}`}>
                <h5 className="font-bold text-purple-500">Overall</h5>
                <p className="font-bold">{activity.data.scores?.overall || 0}/100</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className={`font-bold text-sm mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Market Demand
                </h4>
                <p className={`text-xs text-justify ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {activity.data.analysis?.marketDemand?.text}
                </p>
              </div>
              <div>
                <h4 className={`font-bold text-sm mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Competition
                </h4>
                <p className={`text-xs text-justify ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {activity.data.analysis?.competition?.text}
                </p>
              </div>
              <div>
                <h4 className={`font-bold text-sm mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Monetization
                </h4>
                <p className={`text-xs text-justify ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {activity.data.analysis?.monetization?.text}
                </p>
              </div>
              <div>
                <h4 className={`font-bold text-sm mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Overall Assessment
                </h4>
                <p className={`text-xs text-justify ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {activity.data.analysis?.overall?.text}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center text-xs">
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Credits Used:
                </span>
                <span className={`font-medium text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {activity.creditsUsed}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Created:
                </span>
                <span className={`font-medium text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {new Date(activity.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        );

      case 'investor_matching':
        return (
          <div className="sm:space-y-5 space-y-4">
            <div>
              <h4 className={`font-bold text-sm mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Search Criteria
              </h4>
              <div className={`p-2 sm:p-2 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
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

            <div>
              <h4 className={`font-bold mb-3 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Investor Matches ({activity.data.matches?.length || 0} found)
              </h4>
              <div className="space-y-4">
                {activity.data.matches?.map((match, index) => (
                  <div key={index} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h5 className={`font-bold text-sm sm:text-md ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {match.name}
                        </h5>
                        <p className={`text-xs  ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {match.type} • {match.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs  font-bold bg-green-100 text-green-800">
                          {match.matchScore}% Match
                        </span>
                        {match.portfolioSize && (
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Portfolio: {match.portfolioSize} companies
                          </p>
                        )}
                      </div>
                    </div>

                    <p className={`text-xs text-justify mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {match.description}
                    </p>

                    {match.investmentRange && (
                      <div className="mb-3">
                        <span className="font-medium text-sm">Investment Range: </span>
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          ${(match.investmentRange.min / 1000).toFixed(0)}K - ${(match.investmentRange.max / 1000).toFixed(0)}K
                        </span>
                      </div>
                    )}

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
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h4 className={`font-bold mb-3 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Market Overview
              </h4>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <p className={`text-xs text-justify ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                  {activity.data.summary}
                </p>
              </div>
            </div>

            <div>
              <h4 className={`font-bold mb-3 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Competitor Analysis ({activity.data.competitors?.length || 0} competitors)
              </h4>
              <div className="space-y-6">
                {activity.data.competitors?.map((competitor, index) => (
                  <div key={index} className={`p-4 sm:p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <h5 className={`font-bold text-sm  mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {competitor.name}
                    </h5>
                    <p className={`text-xs mb-4 text-justify ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                      {competitor.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
                          <h6 className="font-bold text-green-600 text-sm mb-2 flex items-center">
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
                          <h6 className="font-bold text-blue-600 text-sm mb-2 flex items-center">
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

                      <div className="space-y-4">
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                          <h6 className="font-bold text-red-600 text-sm mb-2 flex items-center">
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
                          <h6 className="font-bold text-yellow-600 text-sm mb-2 flex items-center">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-2 sm:p-4 rounded-xl ${darkMode ? 'bg-blue-900/50' : 'bg-blue-50'}`}>
                <h5 className="font-bold text-sm text-blue-500">TAM (Total)</h5>
                <p className="text-md font-bold">
                  ${activity.data.tam?.value ? (activity.data.tam.value / 1000000000).toFixed(1) : '0'}B
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Addressable Market
                </p>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/50' : 'bg-green-50'}`}>
                <h5 className="font-bold text-sm text-green-500">SAM (Serviceable)</h5>
                <p className="text-md font-bold">
                  ${activity.data.sam?.value ? (activity.data.sam.value / 1000000000).toFixed(1) : '0'}B
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Serviceable Addressable Market
                </p>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-purple-900/50' : 'bg-purple-50'}`}>
                <h5 className="font-bold text-sm text-purple-500">SOM (Obtainable)</h5>
                <p className="text-md font-bold">
                  ${activity.data.som?.value ? (activity.data.som.value / 1000000).toFixed(0) : '0'}M
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Serviceable Obtainable Market
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {activity.data.tam?.description && (
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                  <h6 className="font-bold text-sm text-blue-600 mb-1">TAM Analysis</h6>
                  <p className={`text-xs text-justify ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
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
                  <h6 className="font-bold text-sm text-green-600 mb-1">SAM Analysis</h6>
                  <p className={`text-xs text-justify ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
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
                  <h6 className="font-bold text-sm text-purple-600 mb-1">SOM Analysis</h6>
                  <p className={`text-xs text-justify ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
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

            {activity.data.trends && (
              <div>
                <h4 className={`font-bold text-sm sm:text-md mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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

            {activity.data.personas && (
              <div>
                <h4 className={`font-bold text-sm sm:text-md mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Customer Personas
                </h4>
                <div className="space-y-4">
                  {activity.data.personas.map((persona, index) => (
                    <div key={index} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <h5 className={`font-bold sm:text-md mb-2 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {persona.name}
                      </h5>
                      
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

            {activity.data.competitorActivity && (
              <div>
                <h4 className={`font-bold text-sm sm:text-md mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Competitor Activity
                </h4>
                <div className="space-y-2">
                  {activity.data.competitorActivity.map((competitor, index) => (
                    <div key={index} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <div className="flex justify-between items-center">
                        <h6 className={`font-medium text-xs sm:text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
          <div className="space-y-4 sm:space-y-6">
            <h4 className={`font-bold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Q&A Session
            </h4>

            {activity.data.questions?.map((qa: any, index: number) => (
              <div
                key={index}
                className={`p-2 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}
              >
                <div className={`p-1 rounded-xl mb-3`}>
                  <h5 className="font-bold text-xs text-blue-500">Q: {qa.question}</h5>
                </div>

                {qa.answer && (
                  <div className={`p-3 rounded-xl mb-3 ${darkMode ? 'bg-green-900/50' : 'bg-green-50'}`}>
                    <h5 className="font-bold text-green-500">A: {qa.answer}</h5>
                  </div>
                )}

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
                            <li key={idx} className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
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
                            <li key={idx} className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
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

            {activity.data.question && (
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <div className={`p-2 rounded-xl mb-3`}>
                  <h5 className="font-bold text-xs text-justify text-indigo-500">Q: {activity.data.question}</h5>
                </div>

                {activity.data.answer && (
                  <div className={`p-3 rounded-xl mb-3 text-xs sm:text-sm ${darkMode ? 'bg-green-900/50' : 'bg-green-50'}`}>
                    <h5 className="font-bold text-green-500 mb-2">Your Answer</h5>
                    <p className={darkMode ? 'text-gray-200 text-justify text-xs' : 'text-gray-800 text-justify text-xs'}>
                      {activity.data.answer}
                    </p>
                  </div>
                )}

                {activity.data.feedback && (
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/70' : 'bg-gray-100'}`}>
                    <h5 className="font-bold mb-2 text-yellow-500 text-xs sm:text-sm">Investor Feedback</h5>

                    <p className="mb-2">
                      <span className="font-semibold text-xs sm:text-sm">Rating:</span> ⭐ <span className='text-sm'>{activity.data.feedback.rating}/5</span>
                    </p>

                    {activity.data.feedback.strengths?.length > 0 && (
                      <div className="mb-3 text-xs sm:text-sm">
                        <h6 className="font-semibold text-green-500">Strengths</h6>
                        <ul className="list-disc text-xs list-inside space-y-1">
                          {activity.data.feedback.strengths.map((point: string, idx: number) => (
                            <li key={idx} className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activity.data.feedback.improvements?.length > 0 && (
                      <div className="mb-3 text-xs sm:text-sm text-justify">
                        <h6 className="font-semibold text-red-500">Improvements</h6>
                        <ul className="list-disc text-xs list-inside space-y-1">
                          {activity.data.feedback.improvements.map((point: string, idx: number) => (
                            <li key={idx} className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activity.data.feedback.additionalAdvice && (
                      <div className='text-xs sm:text-sm text-justify'>
                        <h6 className="font-semibold text-blue-500">Additional Advice</h6>
                        <p className={darkMode ? 'text-gray-300 text-xs' : 'text-xs text-gray-700'}>
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
      <div className='px-8 py-6'>
        <ActivityHistorySkeleton />
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-purple-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-purple-200/10 to-transparent'}`} />
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        <div className="absolute top-20 left-[10%] w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
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
              <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-2xl ${darkMode ? "shadow-purple-500/50" : "shadow-purple-500/30"}`}>
                <HistoryIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className={`text-md md:text-xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Activity{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
                    History
                  </span>
                </h1>
                <p className={`text-xs  ${darkMode ? "text-gray-400" : "text-gray-600"} font-medium flex items-center gap-2 justify-center`}>
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
                  Track your startup validation journey
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className={`${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-3 mb-5`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-xl">
              <Filter className="w-3 h-3 text-white" />
            </div>
            <h2 className={`text-xs sm:text-sm font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Filter Activities
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {serviceTypes.map((service) => {
              const Icon = service.icon;
              return (
                <motion.button
                  key={service.value}
                  onClick={() => setSelectedFilter(service.value)}
                  className={`flex items-center px-4 py-1  rounded-xl text-xs  sm:font-bold transition-all duration-300 ${
                    selectedFilter === service.value
                      ? `bg-gradient-to-r ${service.gradient} text-white shadow-xl`
                      : darkMode
                        ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="hidden sm:flex w-3 h-3 mr-2" />
                  {service.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Activities List */}
        {filteredActivities.length > 0 ? (
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => {
              const Icon = getServiceIcon(activity.serviceType);
              const gradient = getServiceGradient(activity.serviceType);
              return (
                <motion.div
                  key={activity._id}
                  className={`group relative overflow-hidden ${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-3 hover:scale-[1.01] transition-all duration-500`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.05 }}
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

                  <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-6 h-6 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xs md:text-md font-black mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {activity.title}
                        </h3>
                        <p className={`text-xs mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                          {activity.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-2 text-blue-500" />
                            <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {new Date(activity.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          <div className={`flex items-center px-3 py-1 rounded-lg ${darkMode ? 'bg-red-900/30 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                            <Zap className="w-3 h-3 mr-1 text-red-500" />
                            <span className={`text-xs font-semibold sm:font-bold ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                              {activity.creditsUsed} {activity.creditsUsed === 1 ? 'Credit' : 'Credits'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => handleViewDetails(activity)}
                      className={`px-6 py-1 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${gradient} hover:shadow-xl transition-all duration-300 flex items-center gap-2`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            className={`${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-600 to-gray-500 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <HistoryIcon className="h-10 w-10 text-white" />
            </div>
            <h3 className={`text-2xl font-black mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No Activity Found
            </h3>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto`}>
              {selectedFilter === 'all' 
                ? 'You haven\'t used any services yet. Start validating your ideas and building your startup!'
                : `No ${serviceTypes.find(s => s.value === selectedFilter)?.label} activities found. Try a different filter or start using our services.`
              }
            </p>
          </motion.div>
        )}
      </div>

      {/* Activity Details Modal */}
      <AnimatePresence>
        {showModal && selectedActivity && (
          <motion.div 
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
              <motion.div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={() => setShowModal(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              
              <motion.div 
                className={`relative ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl`}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <div className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-900/95 border-b border-gray-800' : 'bg-white/95 border-b border-gray-200'} backdrop-blur-xl p-3`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getServiceGradient(selectedActivity.serviceType)} flex items-center justify-center shadow-xl`}>
                        {(() => {
                          const Icon = getServiceIcon(selectedActivity.serviceType);
                          return <Icon className="w-4 h-4 text-white" />;
                        })()}
                      </div>
                      <div>
                        <h2 className={`text-xs sm:text-sm font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedActivity.title}
                        </h2>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(selectedActivity.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className={`p-2 rounded-xl ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-3 overflow-y-auto max-h-[calc(85vh-140px)]">
                  {renderActivityDetails(selectedActivity)}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;