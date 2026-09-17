import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { fetchUserHistory } from '@/features/dashboard/store/historySlice';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  History as HistoryIcon, 
  Brain, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Target, 
  Filter, 
  Calendar, 
  Eye, 
  X, 
  Sparkles, 
  Zap,
  Building,
  MapPin,
  Award,
  ExternalLink
} from 'lucide-react';
import ActivityHistorySkeleton from '@/features/dashboard/components/ActivityHistorySkeleton';

// ============ ALL EXISTING INTERFACES ============
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

  const serviceTypes = [
    { value: 'all', label: 'All Activities', icon: HistoryIcon, color: 'text-purple-400' },
    { value: 'idea_validation', label: 'Idea Validation', icon: Brain, color: 'text-violet-400' },
    { value: 'competitor_analysis', label: 'Competitor Analysis', icon: Users, color: 'text-cyan-400' },
    { value: 'pitch_simulator', label: 'Pitch Arena', icon: MessageSquare, color: 'text-amber-400' },
    { value: 'market_research', label: 'Market Research', icon: TrendingUp, color: 'text-emerald-400' },
    { value: 'investor_matching', label: 'Investor Matching', icon: Target, color: 'text-blue-400' }
  ];

  useEffect(() => {
    let promise: any;
    if (token && !fetchedOnce) {
      promise = dispatch(fetchUserHistory());
    }
    return () => {
      if (promise) {
        promise.abort();
      }
    };
  }, [token, fetchedOnce, dispatch]);

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredActivities(history as ActivityRecord[]);
    } else {
      setFilteredActivities(history.filter(activity => activity.serviceType === selectedFilter) as ActivityRecord[]);
    }
  }, [history, selectedFilter]);

  const getServiceConfig = (serviceType: string) => {
    return serviceTypes.find(s => s.value === serviceType) || serviceTypes[0];
  };

  const getServiceIcon = (serviceType: string) => {
    const service = serviceTypes.find(s => s.value === serviceType);
    return service ? service.icon : HistoryIcon;
  };

  const handleViewDetails = (activity: ActivityRecord) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const renderActivityDetails = (activity: ActivityRecord) => {
    switch (activity.serviceType) {
      case 'idea_validation':
        return (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[#141414] border border-white/5">
              <h4 className="font-semibold text-[12px] text-white mb-1.5">
                Idea Overview
              </h4>
              <p className="text-[11px] text-justify text-gray-300 leading-relaxed">
                {activity.data.ideaText}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-xl bg-[#141414] border border-blue-500/20">
                <h5 className="font-medium text-[11px] text-blue-400">Market Demand</h5>
                <p className="font-bold text-[13px] text-white mt-0.5">{activity.data.scores?.marketDemand || 0}/100</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141414] border border-red-500/20">
                <h5 className="font-medium text-[11px] text-red-400">Competition</h5>
                <p className="font-bold text-[13px] text-white mt-0.5">{activity.data.scores?.competition || 0}/100</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141414] border border-emerald-500/20">
                <h5 className="font-medium text-[11px] text-emerald-400">Monetization</h5>
                <p className="font-bold text-[13px] text-white mt-0.5">{activity.data.scores?.monetization || 0}/100</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141414] border border-purple-500/20">
                <h5 className="font-medium text-[11px] text-purple-400">Overall</h5>
                <p className="font-bold text-[13px] text-white mt-0.5">{activity.data.scores?.overall || 0}/100</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {activity.data.analysis?.marketDemand?.text && (
                <div className="p-3 rounded-xl bg-[#141414] border border-white/5">
                  <h4 className="font-semibold text-[11px] text-blue-400 mb-1">
                    Market Demand Analysis
                  </h4>
                  <p className="text-[11px] text-justify text-gray-300 leading-relaxed">
                    {activity.data.analysis.marketDemand.text}
                  </p>
                </div>
              )}
              {activity.data.analysis?.competition?.text && (
                <div className="p-3 rounded-xl bg-[#141414] border border-white/5">
                  <h4 className="font-semibold text-[11px] text-red-400 mb-1">
                    Competition Analysis
                  </h4>
                  <p className="text-[11px] text-justify text-gray-300 leading-relaxed">
                    {activity.data.analysis.competition.text}
                  </p>
                </div>
              )}
              {activity.data.analysis?.monetization?.text && (
                <div className="p-3 rounded-xl bg-[#141414] border border-white/5">
                  <h4 className="font-semibold text-[11px] text-emerald-400 mb-1">
                    Monetization Analysis
                  </h4>
                  <p className="text-[11px] text-justify text-gray-300 leading-relaxed">
                    {activity.data.analysis.monetization.text}
                  </p>
                </div>
              )}
              {activity.data.analysis?.overall?.text && (
                <div className="p-3 rounded-xl bg-[#141414] border border-white/5">
                  <h4 className="font-semibold text-[11px] text-purple-400 mb-1">
                    Overall Assessment
                  </h4>
                  <p className="text-[11px] text-justify text-gray-300 leading-relaxed">
                    {activity.data.analysis.overall.text}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-[11px] text-gray-400 pt-3 border-t border-white/5">
              <span>Credits Used: <strong className="text-white">{activity.creditsUsed}</strong></span>
              <span>Date: <strong className="text-white">{new Date(activity.createdAt).toLocaleDateString()}</strong></span>
            </div>
          </div>
        );

      case 'investor_matching':
        return (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[#141414] border border-white/5">
              <h4 className="font-semibold text-[12px] text-white mb-2">
                Search Criteria
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div><span className="text-gray-500">Industry:</span> <span className="text-gray-200">{activity.data.criteria?.industry || 'N/A'}</span></div>
                <div><span className="text-gray-500">Stage:</span> <span className="text-gray-200">{activity.data.criteria?.stage || 'N/A'}</span></div>
                <div><span className="text-gray-500">Funding:</span> <span className="text-gray-200">{activity.data.criteria?.fundingAmount || 'N/A'}</span></div>
                <div><span className="text-gray-500">Location:</span> <span className="text-gray-200">{activity.data.criteria?.location || 'N/A'}</span></div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-[12px] text-white mb-2.5">
                Investor Matches ({activity.data.matches?.length || 0})
              </h4>
              <div className="space-y-3">
                {activity.data.matches?.map((match, index) => (
                  <div key={index} className="p-3.5 rounded-xl bg-[#141414] border border-white/5 space-y-2.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-semibold text-[13px] text-white">
                          {match.name}
                        </h5>
                        <p className="text-[10px] text-gray-400">
                          {match.type} • {match.location}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {match.matchScore}% Match
                      </span>
                    </div>

                    <p className="text-[11px] text-justify text-gray-300 leading-relaxed">
                      {match.description}
                    </p>

                    {match.investmentRange && (
                      <div className="text-[11px]">
                        <span className="text-gray-500">Range: </span>
                        <span className="font-semibold text-white">
                          ${(match.investmentRange.min / 1000).toFixed(0)}K - ${(match.investmentRange.max / 1000).toFixed(0)}K
                        </span>
                      </div>
                    )}

                    {match.industryFocus && (
                      <div className="flex flex-wrap gap-1">
                        {match.industryFocus.map((ind, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {ind}
                          </span>
                        ))}
                      </div>
                    )}

                    {match.contactLink && (
                      <div className="pt-2 border-t border-white/5">
                        <a 
                          href={match.contactLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#7c3aed] text-white rounded-lg text-[11px] font-medium hover:bg-[#6d28d9] transition-all"
                        >
                          <span>Contact / Apply</span>
                          <ExternalLink className="w-3 h-3" />
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
          <div className="space-y-4">
            {activity.data.summary && (
              <div className="p-3 rounded-xl bg-[#141414] border border-white/5">
                <h4 className="font-semibold text-[12px] text-white mb-1.5">
                  Market Overview
                </h4>
                <p className="text-[11px] text-justify text-gray-300 leading-relaxed">
                  {activity.data.summary}
                </p>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-[12px] text-white mb-2.5">
                Competitor Breakdown ({activity.data.competitors?.length || 0})
              </h4>
              <div className="space-y-3">
                {activity.data.competitors?.map((competitor, index) => (
                  <div key={index} className="p-3.5 rounded-xl bg-[#141414] border border-white/5 space-y-2.5">
                    <h5 className="font-semibold text-[13px] text-white">
                      {competitor.name}
                    </h5>
                    <p className="text-[11px] text-justify text-gray-300 leading-relaxed">
                      {competitor.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {competitor.swot?.strengths?.length > 0 && (
                        <div className="p-2.5 rounded-lg bg-[#0a0a0a] border border-emerald-500/20">
                          <h6 className="font-medium text-[11px] text-emerald-400 mb-1">Strengths</h6>
                          <ul className="text-[10px] text-gray-300 space-y-0.5">
                            {competitor.swot.strengths.map((s, i) => (
                              <li key={i}>• {s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {competitor.swot?.weaknesses?.length > 0 && (
                        <div className="p-2.5 rounded-lg bg-[#0a0a0a] border border-rose-500/20">
                          <h6 className="font-medium text-[11px] text-rose-400 mb-1">Weaknesses</h6>
                          <ul className="text-[10px] text-gray-300 space-y-0.5">
                            {competitor.swot.weaknesses.map((w, i) => (
                              <li key={i}>• {w}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {competitor.swot?.opportunities?.length > 0 && (
                        <div className="p-2.5 rounded-lg bg-[#0a0a0a] border border-blue-500/20">
                          <h6 className="font-medium text-[11px] text-blue-400 mb-1">Opportunities</h6>
                          <ul className="text-[10px] text-gray-300 space-y-0.5">
                            {competitor.swot.opportunities.map((o, i) => (
                              <li key={i}>• {o}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {competitor.swot?.threats?.length > 0 && (
                        <div className="p-2.5 rounded-lg bg-[#0a0a0a] border border-amber-500/20">
                          <h6 className="font-medium text-[11px] text-amber-400 mb-1">Threats</h6>
                          <ul className="text-[10px] text-gray-300 space-y-0.5">
                            {competitor.swot.threats.map((t, i) => (
                              <li key={i}>• {t}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'market_research':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-[#141414] border border-blue-500/20">
                <h5 className="font-medium text-[11px] text-blue-400">TAM (Total)</h5>
                <p className="text-[14px] font-bold text-white mt-0.5">
                  ${activity.data.tam?.value ? (activity.data.tam.value / 1000000000).toFixed(1) : '0'}B
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">Total Addressable Market</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141414] border border-emerald-500/20">
                <h5 className="font-medium text-[11px] text-emerald-400">SAM (Serviceable)</h5>
                <p className="text-[14px] font-bold text-white mt-0.5">
                  ${activity.data.sam?.value ? (activity.data.sam.value / 1000000000).toFixed(1) : '0'}B
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">Serviceable Addressable Market</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141414] border border-purple-500/20">
                <h5 className="font-medium text-[11px] text-purple-400">SOM (Obtainable)</h5>
                <p className="text-[14px] font-bold text-white mt-0.5">
                  ${activity.data.som?.value ? (activity.data.som.value / 1000000).toFixed(0) : '0'}M
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">Serviceable Obtainable Market</p>
              </div>
            </div>

            {activity.data.tam?.description && (
              <div className="p-3 rounded-xl bg-[#141414] border border-white/5">
                <h6 className="font-medium text-[11px] text-blue-400 mb-1">TAM Analysis</h6>
                <p className="text-[11px] text-justify text-gray-300 leading-relaxed">
                  {activity.data.tam.description}
                </p>
              </div>
            )}

            {activity.data.trends && activity.data.trends.length > 0 && (
              <div className="p-3 rounded-xl bg-[#141414] border border-white/5">
                <h4 className="font-semibold text-[11px] text-white mb-2">Search Trends</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activity.data.trends.map((trend, i) => (
                    <div key={i} className="p-2 rounded-lg bg-[#0a0a0a] border border-white/5 flex justify-between items-center text-[11px]">
                      <span className="text-gray-200">{trend.keyword}</span>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {trend.interest}% ({trend.growth})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'pitch_simulator':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-[12px] text-white mb-1">
              Q&A Session
            </h4>

            {activity.data.questions?.map((qa: any, index: number) => (
              <div key={index} className="p-3 rounded-xl bg-[#141414] border border-white/5 space-y-2">
                <div className="text-[11px] font-semibold text-blue-400">
                  Q: {qa.question}
                </div>

                {qa.answer && (
                  <div className="p-2.5 rounded-lg bg-[#0a0a0a] border border-emerald-500/20 text-[11px]">
                    <span className="text-emerald-400 font-semibold block mb-1">A:</span>
                    <span className="text-gray-300 leading-relaxed">{qa.answer}</span>
                  </div>
                )}

                {qa.feedback && (
                  <div className="p-2.5 rounded-lg bg-[#0a0a0a] border border-white/5 text-[11px] space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400">Rating:</span>
                      <span className="font-semibold text-amber-400">⭐ {qa.feedback.rating}/5</span>
                    </div>
                    {qa.feedback.strengths?.length > 0 && (
                      <div>
                        <span className="text-emerald-400 font-medium">Strengths: </span>
                        <span className="text-gray-300">{qa.feedback.strengths.join(', ')}</span>
                      </div>
                    )}
                    {qa.feedback.improvements?.length > 0 && (
                      <div>
                        <span className="text-rose-400 font-medium">Improvements: </span>
                        <span className="text-gray-300">{qa.feedback.improvements.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {activity.data.question && (
              <div className="p-3 rounded-xl bg-[#141414] border border-white/5 space-y-2">
                <div className="text-[11px] font-semibold text-indigo-400">
                  Q: {activity.data.question}
                </div>

                {activity.data.answer && (
                  <div className="p-2.5 rounded-lg bg-[#0a0a0a] border border-emerald-500/20 text-[11px]">
                    <span className="text-emerald-400 font-semibold block mb-1">Your Answer:</span>
                    <span className="text-gray-300 leading-relaxed">{activity.data.answer}</span>
                  </div>
                )}

                {activity.data.feedback && (
                  <div className="p-2.5 rounded-lg bg-[#0a0a0a] border border-white/5 text-[11px] space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400">Rating:</span>
                      <span className="font-semibold text-amber-400">⭐ {activity.data.feedback.rating}/5</span>
                    </div>
                    {activity.data.feedback.strengths?.length > 0 && (
                      <div>
                        <span className="text-emerald-400 font-medium">Strengths: </span>
                        <span className="text-gray-300">{activity.data.feedback.strengths.join(', ')}</span>
                      </div>
                    )}
                    {activity.data.feedback.improvements?.length > 0 && (
                      <div>
                        <span className="text-rose-400 font-medium">Improvements: </span>
                        <span className="text-gray-300">{activity.data.feedback.improvements.join(', ')}</span>
                      </div>
                    )}
                    {activity.data.feedback.additionalAdvice && (
                      <div>
                        <span className="text-blue-400 font-medium">Advice: </span>
                        <span className="text-gray-300">{activity.data.feedback.additionalAdvice}</span>
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
          <pre className="text-[11px] text-gray-300 whitespace-pre-wrap bg-[#141414] p-3 rounded-xl border border-white/5">
            {JSON.stringify((activity as any).data, null, 2)}
          </pre>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <ActivityHistorySkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 selection:bg-[#7c3aed]/30">
      {/* Subtle Dot Grid Background Pattern like Dashboard */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-lg shadow-purple-950/20">
              <HistoryIcon className="w-4 h-4 text-[#7c3aed]" />
            </div>
            <div>
              <h1 className="text-[20px] sm:text-[22px] font-semibold text-white tracking-tight">
                Activity History
              </h1>
              <p className="text-[11px] sm:text-[12px] text-gray-400 font-normal mt-0.5">
                Track your startup validation journey
              </p>
            </div>
          </div>
        </div>

        {/* Filter Activities Card */}
        <div className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-3.5 sm:p-4 mb-5 shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-md bg-[#141414] border border-white/10 flex items-center justify-center">
              <Filter className="w-3 h-3 text-[#7c3aed]" />
            </div>
            <h2 className="text-[12px] font-semibold text-white">
              Filter Activities
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {serviceTypes.map((service) => {
              const Icon = service.icon;
              const isSelected = selectedFilter === service.value;
              return (
                <button
                  key={service.value}
                  onClick={() => setSelectedFilter(service.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-900/30'
                      : 'bg-[#141414] text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{service.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Activities List */}
        {filteredActivities.length > 0 ? (
          <div className="space-y-3">
            {filteredActivities.map((activity) => {
              const Icon = getServiceIcon(activity.serviceType);
              const config = getServiceConfig(activity.serviceType);
              return (
                <div
                  key={activity._id}
                  className="rounded-[18px] bg-[#0a0a0a]/95 border border-white/10 p-3.5 sm:p-4 backdrop-blur-xl hover:border-[#7c3aed]/40 transition-all shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-center shrink-0">
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] sm:text-[14px] font-semibold text-white truncate">
                        {activity.title}
                      </h3>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5 mb-2 leading-relaxed">
                        {activity.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span>
                            {new Date(activity.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <Zap className="w-2.5 h-2.5" />
                          <span>
                            {activity.creditsUsed} {activity.creditsUsed === 1 ? 'Credit' : 'Credits'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewDetails(activity)}
                    className="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] border-b-[3px] border-[#3904a6] hover:translate-y-[1px] active:translate-y-[3px] active:border-b-0 transition-all flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-center cursor-pointer shadow-[0_4px_12px_rgba(124,58,237,0.2)]"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Details</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[18px] bg-[#0a0a0a]/95 border border-white/10 p-8 text-center backdrop-blur-xl shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-center mx-auto mb-3">
              <HistoryIcon className="h-5 w-5 text-gray-400" />
            </div>
            <h3 className="text-[15px] font-semibold text-white mb-1.5">
              No Activity Found
            </h3>
            <p className="text-[12px] text-gray-400 max-w-md mx-auto leading-relaxed">
              {selectedFilter === 'all' 
                ? "You haven't used any services yet. Start validating your ideas and building your startup!"
                : `No ${serviceTypes.find(s => s.value === selectedFilter)?.label} activities found. Try selecting another filter.`
              }
            </p>
          </div>
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
                className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
                onClick={() => setShowModal(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              
              <motion.div 
                className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl text-white z-10"
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                transition={{ type: "spring", duration: 0.3 }}
              >
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 border-b border-white/10 backdrop-blur-xl p-3.5 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-center">
                      {(() => {
                        const Icon = getServiceIcon(selectedActivity.serviceType);
                        const config = getServiceConfig(selectedActivity.serviceType);
                        return <Icon className={`w-4 h-4 ${config.color}`} />;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-[13px] sm:text-[14px] font-semibold text-white">
                        {selectedActivity.title}
                      </h2>
                      <p className="text-[10px] text-gray-400">
                        {new Date(selectedActivity.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-4 overflow-y-auto max-h-[calc(85vh-75px)] space-y-4">
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