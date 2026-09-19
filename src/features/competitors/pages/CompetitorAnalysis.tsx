import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '@/shared/lib/api';

import { RootState } from '@/app/store';

import { AlertCircle, Search, TrendingUp, Target, Shield, Zap, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import InsufficientCreditsModal from '@/features/credits/components/InsufficientCreditsModal';
import BackButton from '@/shared/components/ui/BackButton';
import Markdown from 'react-markdown';

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

const CompetitorAnalysis = () => {
  const [ideaText, setIdeaText] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creditError, setCreditError] = useState<{
    show: boolean;
    creditsRequired: number;
    creditsAvailable: number;
  } | null>(null);
  
  const { token } = useSelector((state: RootState) => state.auth);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setCreditError(null);

      const response = await api.post(
        `/api/competitors/analyze`,
        { ideaText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(response.data);
    } catch (err: unknown) {
      if (err.response?.status === 402) {
        setCreditError({
          show: true,
          creditsRequired: err.response.data.creditsRequired,
          creditsAvailable: err.response.data.creditsAvailable
        });
      } else {
        setError(getErrorMessage(err, 'Failed to analyze competitors'));
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
        <motion.div 
          className="text-center mb-5"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex justify-center mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-inner">
              <Target className="w-4 h-4 text-[#7c3aed]" />
            </div>
          </div>
          <h1 className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-white mb-1">
            Competitor Analysis
          </h1>
          <p className="text-[11px] sm:text-[12px] text-gray-400 font-normal flex items-center gap-1.5 justify-center">
            <Zap className="w-3.5 h-3.5 text-[#7c3aed]" />
            Analyze competition and understand market landscape
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div 
            className="mb-4 flex items-center justify-between p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-[11px] sm:text-[12px]"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-[11px] font-medium text-red-400 hover:text-red-300 transition-colors ml-4"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Main Form */}
        <motion.div 
          className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-5 sm:p-6 relative z-10 mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-7 h-7 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center text-[#7c3aed] shadow-inner">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-[14px] sm:text-[15px] font-semibold text-white tracking-tight">
                Enter Your Startup Idea
              </h2>
              <p className="text-[11px] text-gray-400">
                Describe what your startup does and who your target audience is
              </p>
            </div>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-3.5">
            <div className="relative">
              <textarea
                id="idea"
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                rows={4}
                className="w-full p-3 pb-7 text-[12px] rounded-lg border bg-[#141414] border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-colors resize-none leading-relaxed"
                placeholder="Describe your startup idea in detail. Include your target market, unique value proposition, and key features..."
              />
              <div className={`absolute bottom-2.5 right-2.5 text-[10px] font-medium transition-colors ${
                ideaText.length < 50 ? 'text-gray-500' : 'text-[#a78bfa]'
              }`}>
                {ideaText.length} characters
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <Sparkles className="w-3 h-3 text-[#7c3aed] flex-shrink-0" />
                <span>AI identifies competitors, market gaps, and SWOT vectors</span>
              </div>

              <button
                type="submit"
                disabled={loading || !ideaText.trim()}
                className={
                  loading || !ideaText.trim()
                    ? "w-full sm:w-auto py-2 px-5 rounded-lg text-[12px] font-medium bg-[#141414] text-gray-500 border border-white/5 cursor-not-allowed flex items-center justify-center gap-2"
                    : "btn-primary w-full sm:w-auto py-2 px-5 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2"
                }
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    <span>Analyzing Competitors...</span>
                  </div>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Analyze Competitors (1 Credit)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Results */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-5"
          >
            {/* Results Header */}
            <div className="p-4 rounded-[18px] bg-[#0a0a0a]/95 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-[14px] sm:text-[15px] font-semibold text-white tracking-tight">
                    Analysis Complete!
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Comprehensive competitive landscape and SWOT analysis
                  </p>
                </div>
              </div>
              <div className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                {analysis.competitors.length} Competitors Found
              </div>
            </div>
            
            {/* Market Overview */}
            <div className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-5 sm:p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center text-[#7c3aed] shadow-inner">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-[14px] sm:text-[15px] font-semibold text-white tracking-tight">
                  Market Overview
                </h3>
              </div>
              <div className="text-[12px] sm:text-[13px] leading-relaxed text-gray-300 prose prose-invert max-w-none">
                <Markdown>{analysis.summary}</Markdown>
              </div>
            </div>

            {/* Competitors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.competitors.map((competitor, index) => (
                <div
                  key={index}
                  className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-5 hover:border-white/20 transition-all duration-200"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center text-[#7c3aed] text-[12px] font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-semibold text-white mb-0.5 tracking-tight truncate">
                        {competitor.name}
                      </h3>
                      <p className="text-[11px] leading-relaxed text-gray-400">
                        {competitor.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                    {/* Strengths */}
                    <div className="p-2.5 rounded-lg bg-[#141414] border border-emerald-500/15">
                      <h4 className="font-semibold mb-2 text-emerald-400 flex items-center text-[11px]">
                        <CheckCircle2 className="w-3 h-3 mr-1.5 flex-shrink-0" />
                        Strengths
                      </h4>
                      <ul className="space-y-1.5">
                        {competitor.swot.strengths.map((strength, i) => (
                          <li key={i} className="text-[10px] sm:text-[11px] flex items-start text-gray-300">
                            <span className="text-emerald-400 mr-1.5">•</span>
                            <span className="leading-tight">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="p-2.5 rounded-lg bg-[#141414] border border-red-500/15">
                      <h4 className="font-semibold mb-2 text-red-400 flex items-center text-[11px]">
                        <AlertCircle className="w-3 h-3 mr-1.5 flex-shrink-0" />
                        Weaknesses
                      </h4>
                      <ul className="space-y-1.5">
                        {competitor.swot.weaknesses.map((weakness, i) => (
                          <li key={i} className="text-[10px] sm:text-[11px] flex items-start text-gray-300">
                            <span className="text-red-400 mr-1.5">•</span>
                            <span className="leading-tight">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Opportunities */}
                    <div className="p-2.5 rounded-lg bg-[#141414] border border-blue-500/15">
                      <h4 className="font-semibold mb-2 text-blue-400 flex items-center text-[11px]">
                        <Sparkles className="w-3 h-3 mr-1.5 flex-shrink-0" />
                        Opportunities
                      </h4>
                      <ul className="space-y-1.5">
                        {competitor.swot.opportunities.map((opportunity, i) => (
                          <li key={i} className="text-[10px] sm:text-[11px] flex items-start text-gray-300">
                            <span className="text-blue-400 mr-1.5">•</span>
                            <span className="leading-tight">{opportunity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Threats */}
                    <div className="p-2.5 rounded-lg bg-[#141414] border border-amber-500/15">
                      <h4 className="font-semibold mb-2 text-amber-400 flex items-center text-[11px]">
                        <Shield className="w-3 h-3 mr-1.5 flex-shrink-0" />
                        Threats
                      </h4>
                      <ul className="space-y-1.5">
                        {competitor.swot.threats.map((threat, i) => (
                          <li key={i} className="text-[10px] sm:text-[11px] flex items-start text-gray-300">
                            <span className="text-amber-400 mr-1.5">•</span>
                            <span className="leading-tight">{threat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

export default CompetitorAnalysis;