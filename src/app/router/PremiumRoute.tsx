import { ReactNode, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/app/store';
import PageLoader from '@/shared/components/layout/PageLoader';
import UpgradeModal from '@/features/credits/components/UpgradeModal';
import { Crown, Sparkles, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PremiumRouteProps {
  children: ReactNode;
}

export const PremiumRoute = ({ children }: PremiumRouteProps) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return <PageLoader />;
  }

  if (user?.isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white flex items-center justify-center px-4 pt-24 pb-16 selection:bg-[#7c3aed]/30">
      {/* Subtle Dot Grid Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />

      <motion.div 
        className="relative z-10 max-w-lg w-full rounded-[24px] bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 shadow-[0_0_50px_rgba(124,58,237,0.15)] text-center"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Glowing Badge */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-600/20 border border-amber-500/30 mx-auto flex items-center justify-center shadow-lg shadow-purple-950/40 mb-5">
          <Crown className="w-7 h-7 text-amber-400" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
          <Lock className="w-3 h-3" />
          <span>Premium Exclusive Feature</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Unlock Investor Directory
        </h1>

        <p className="text-sm text-gray-400 mt-2 leading-relaxed">
          Access our curated database of 500+ top VCs, Angel Investors, and startup accelerators ready to fund your next big idea.
        </p>

        {/* Benefits list */}
        <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5 text-left text-xs sm:text-sm text-gray-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Direct partner contact links & application portals</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Filter by investor type (VC, Angel, Accelerator) & industry</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>AI-powered investor matchmaking for your startup idea</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#5b21b6] transition-all duration-300 shadow-[0_0_25px_rgba(124,58,237,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Upgrade Now - Just ₹29</span>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </motion.div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
};

export default PremiumRoute;
