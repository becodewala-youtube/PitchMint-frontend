import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { getIdea } from '../store/slices/ideaSlice';
import { RootState } from '../store';

import api from '../utils/api';

import { 
  AlertCircle, 
  RefreshCw, 
  Users, 
  Target, 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Zap 
} from 'lucide-react';
import CompetitorAnalysisSkeleton from '../components/skeleton/CompetitorSkeleton';

interface Competitor {
  name: string;
  description: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

interface Analysis {
  competitors: Competitor[];
  summary: string;
}

const IdeaCompetitors = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const hasAnalyzedRef = useRef(false);

  const { currentIdea: idea, loading: ideaLoading } = useSelector((state: RootState) => state.idea);
  const { token } = useSelector((state: RootState) => state.auth);
  
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && !idea) {
      dispatch(getIdea(id));
    }
  }, [dispatch, id, idea]);

  useEffect(() => {
    if (idea?.competitorAnalysis) {
      setAnalysis(idea.competitorAnalysis);
    }
  }, [idea]);

  const analyzeCompetitors = async (regenerate = false) => {
    if (!idea?.ideaText) return;
    
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(
        `/api/competitors/analyze/${idea._id}`,
        { regenerate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(response.data.competitorAnalysis);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze competitors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!idea || loading) return;

    if (hasAnalyzedRef.current || idea.competitorAnalysis) return;

    hasAnalyzedRef.current = true;
    analyzeCompetitors(false);
  }, [idea, loading]);

  if (ideaLoading || loading) {
    return (
      <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <CompetitorAnalysisSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />
        <div className="relative z-10 text-center max-w-md p-6 rounded-[18px] bg-[#0a0a0a]/95 border border-red-500/30">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="h-6 w-6 text-red-400" />
          </div>
          <h3 className="text-[15px] font-semibold text-white mb-1">Something went wrong</h3>
          <p className="text-[12px] text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!idea) return null;

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 selection:bg-[#7c3aed]/30">
      {/* Subtle Dot Grid Background Pattern like Dashboard */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-lg shadow-purple-950/20">
              <Target className="w-4 h-4 text-[#7c3aed]" />
            </div>
            <div>
              <h1 className="text-[20px] sm:text-[22px] font-semibold text-white tracking-tight">
                Competitor Analysis
              </h1>
              <p className="text-[11px] sm:text-[12px] text-gray-400 font-normal mt-0.5">
                Market landscape and competitive intelligence
              </p>
            </div>
          </div>

          <button
            onClick={() => analyzeCompetitors(true)}
            disabled={loading}
            className="btn-primary self-start sm:self-auto flex items-center gap-1.5 py-2 px-3.5 text-[12px] font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] rounded-xl border-b-[4px] border-[#3904a6] hover:translate-y-[2px] active:translate-y-[4px] active:border-b-0 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:border-b-[4px] shadow-[0_10px_20px_-5px_rgba(124,58,237,0.3)] shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerate Analysis</span>
          </button>
        </div>

        {/* Startup Idea Card */}
        <div className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-4 sm:p-5 mb-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
            <div className="w-6 h-6 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center">
              <Lightbulb className="w-3.5 h-3.5 text-[#7c3aed]" />
            </div>
            <h2 className="text-[12px] font-semibold text-[#a78bfa]">
              Your Startup Idea
            </h2>
          </div>
          <p className="text-[11px] sm:text-[12px] text-gray-300 leading-relaxed text-justify">
            {idea.ideaText}
          </p>
        </div>

        {analysis && (
          <>
            {/* Market Overview Card */}
            <div className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-4 sm:p-5 mb-6 shadow-xl">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                <div className="w-6 h-6 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <h2 className="text-[13px] font-semibold text-white">
                  Market Overview
                </h2>
              </div>
              <p className="text-[11px] sm:text-[12px] text-gray-300 leading-relaxed text-justify">
                {analysis.summary}
              </p>
            </div>

            {/* Competitors Grid Header */}
            <div className="mb-4">
              <h2 className="text-[16px] sm:text-[18px] font-semibold text-white tracking-tight">
                Key Competitors
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Detailed SWOT analysis of {analysis.competitors.length} major competitors
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
              {analysis.competitors.map((competitor, index) => (
                <div
                  key={index}
                  className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-4 sm:p-5 shadow-xl hover:border-[#7c3aed]/40 transition-all space-y-3.5"
                >
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-white/5">
                    <div className="w-7 h-7 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5 text-[#7c3aed]" />
                    </div>
                    <h3 className="text-[14px] sm:text-[15px] font-semibold text-white">
                      {competitor.name}
                    </h3>
                  </div>

                  <p className="text-[11px] sm:text-[12px] text-gray-400 leading-relaxed text-justify">
                    {competitor.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {/* Strengths */}
                    <div className="p-3 rounded-xl bg-[#141414] border border-emerald-500/20">
                      <div className="flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <h4 className="font-semibold text-[11px] text-emerald-400">Strengths</h4>
                      </div>
                      <ul className="text-[10.5px] text-gray-300 space-y-1">
                        {competitor.swot.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                            <Zap className="w-2.5 h-2.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="p-3 rounded-xl bg-[#141414] border border-rose-500/20">
                      <div className="flex items-center gap-1.5 mb-2">
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        <h4 className="font-semibold text-[11px] text-rose-400">Weaknesses</h4>
                      </div>
                      <ul className="text-[10.5px] text-gray-300 space-y-1">
                        {competitor.swot.weaknesses.map((w, i) => (
                          <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                            <AlertCircle className="w-2.5 h-2.5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Opportunities */}
                    <div className="p-3 rounded-xl bg-[#141414] border border-blue-500/20">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
                        <h4 className="font-semibold text-[11px] text-blue-400">Opportunities</h4>
                      </div>
                      <ul className="text-[10.5px] text-gray-300 space-y-1">
                        {competitor.swot.opportunities.map((o, i) => (
                          <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                            <TrendingUp className="w-2.5 h-2.5 text-blue-400 shrink-0 mt-0.5" />
                            <span>{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Threats */}
                    <div className="p-3 rounded-xl bg-[#141414] border border-amber-500/20">
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <h4 className="font-semibold text-[11px] text-amber-400">Threats</h4>
                      </div>
                      <ul className="text-[10.5px] text-gray-300 space-y-1">
                        {competitor.swot.threats.map((t, i) => (
                          <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                            <Shield className="w-2.5 h-2.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IdeaCompetitors;