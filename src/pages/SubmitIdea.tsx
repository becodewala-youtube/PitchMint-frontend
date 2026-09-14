import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { submitIdea, clearError } from '../store/slices/ideaSlice';
import { RootState } from '../store';

import { Brain, AlertCircle, Sparkles, CheckCircle, Target, Users, TrendingUp, DollarSign, ArrowRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import InsufficientCreditsModal from '../components/modals/InsufficientCreditsModal';

const SubmitIdea = () => {
  const [ideaText, setIdeaText] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { loading, error, creditError } = useSelector((state: RootState) => state.idea);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(submitIdea({ ideaText }));
    if (!result.error) {
      navigate(`/idea/${result.payload._id}`);
    }
  };

  const handleCloseCreditModal = () => {
    dispatch(clearError());
  };

  const tips = [
    {
      icon: Target,
      title: 'Problem & Solution',
      description: 'Be clear about the specific pain point your idea solves and for whom.',
    },
    {
      icon: Users,
      title: 'Target Audience',
      description: 'Describe your core customer segments, demographics, and market niche.',
    },
    {
      icon: TrendingUp,
      title: 'Unique Value',
      description: 'Explain what makes your solution unique or 10x better than alternatives.',
    },
    {
      icon: DollarSign,
      title: 'Business Model',
      description: 'Outline your anticipated monetization strategy and revenue streams.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 selection:bg-[#7c3aed]/30">
      {/* Subtle Dot Grid Background Pattern like Dashboard */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-5"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex justify-center mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-inner">
              <Brain className="w-4 h-4 text-[#7c3aed]" />
            </div>
          </div>
          <h1 className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-white mb-1">
            Submit Your Startup Idea
          </h1>
          <p className="text-[11px] sm:text-[12px] text-gray-400 max-w-sm mx-auto">
            Get instant AI-powered validation, competitive analysis, and strategic roadmap
          </p>
        </motion.div>

        {/* Main Form */}
        <motion.div 
          className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-5 sm:p-6 relative z-10 mb-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <div className="relative">
            {error && (
              <motion.div 
                className="mb-4 flex items-center p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-[11px] sm:text-[12px]" 
                role="alert"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="idea"
                  className="block text-[12px] font-medium mb-1.5 text-gray-300"
                >
                  Describe your startup idea
                </label>
                <div className="relative">
                  <textarea
                    id="idea"
                    name="idea"
                    rows={4}
                    value={ideaText}
                    onChange={(e) => setIdeaText(e.target.value)}
                    placeholder="Example: A mobile app that uses AI to help people learn new languages through personalized, interactive conversations. Our platform adapts to each user's learning style and provides real-time feedback..."
                    className="w-full p-3 pb-7 text-[12px] rounded-lg border bg-[#141414] border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-colors resize-none leading-relaxed"
                  />
                  <div className={`absolute bottom-2.5 right-2.5 text-[10px] font-medium transition-colors ${
                    ideaText.length < 50 
                      ? 'text-gray-500' 
                      : 'text-[#a78bfa]'
                  }`}>
                    {ideaText.length} characters
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-400">
                  <Sparkles className="w-3 h-3 text-[#7c3aed] flex-shrink-0" />
                  <span>Be specific about your value proposition, target market, and the core problem you are solving.</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={loading || !ideaText.trim()}
                  className={
                    loading || !ideaText.trim()
                      ? "w-full sm:flex-1 py-2 px-5 rounded-lg text-[12px] font-medium bg-[#141414] text-gray-500 border border-white/5 cursor-not-allowed flex items-center justify-center gap-2"
                      : "btn-primary w-full sm:flex-1 py-2 px-5 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2"
                  }
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    <>
                      <span>Analyze Idea (1 Credit)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg text-[12px] font-medium text-gray-300 bg-[#141414] border border-white/10 hover:bg-white/5 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div 
          className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-5 sm:p-6 relative z-10"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <div className="relative">
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-7 h-7 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center text-[#7c3aed] shadow-inner">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="text-[14px] sm:text-[15px] font-semibold text-white tracking-tight">
                  Tips for Better Analysis
                </h2>
                <p className="text-[11px] text-gray-400">
                  Key components to describe for higher quality AI evaluations
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-[#141414] border border-white/5 hover:border-white/15 transition-all duration-200 group flex items-start gap-2.5"
                >
                  <div className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[#7c3aed] group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
                    <tip.icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-[12px] font-semibold text-white mb-0.5">
                      {tip.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      {tip.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pro Tip Box */}
            <div className="mt-3.5 p-3 rounded-lg bg-[#141414] border border-[#7c3aed]/20 flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-md bg-[#7c3aed]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3 text-[#7c3aed]" />
              </div>
              <div>
                <h4 className="text-[11px] font-semibold text-[#a78bfa] mb-0.5">
                  Pro Tip
                </h4>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  The more specific and detailed your description, the more accurate our AI validation, competitor discovery, and financial projections will be.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
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

export default SubmitIdea;