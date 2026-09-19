import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/shared/hooks';
import { getIdea, generateCanvas, clearError } from '@/features/ideas/store/ideaSlice';
import { RootState } from '@/app/store';

import { 
  RefreshCw, 
  AlertCircle, 
  Layout, 
  Target, 
  Users, 
  Lightbulb, 
  TrendingUp, 
  MessageSquare, 
  DollarSign, 
  Zap 
} from 'lucide-react';
import CanvasSkeleton from '@/features/canvas/components/CanvasSkeleton';
import InsufficientCreditsModal from '@/features/credits/components/InsufficientCreditsModal';
import ReactMarkdown from 'react-markdown';
import BackButton from '@/shared/components/ui/BackButton';

const Canvas = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  
  const { currentIdea: idea, loading, error, creditError } = useSelector((state: RootState) => state.idea);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (id && (!idea || idea._id !== id)) {
      dispatch(getIdea(id));
    }
  }, [dispatch, id, idea]);

  const handleGenerateCanvas = useCallback(async () => {
    if (id && !isGenerating && !loading) {
      try {
        setIsGenerating(true);
        await dispatch(generateCanvas(id));
      } finally {
        setIsGenerating(false);
      }
    }
  }, [id, isGenerating, loading, dispatch]);

  useEffect(() => {
    if (idea && !idea.canvasContent && !loading && !isGenerating) {
      handleGenerateCanvas();
    }
  }, [idea, loading, handleGenerateCanvas, isGenerating]);

  const handleCloseCreditModal = () => {
    dispatch(clearError());
  };

  if (loading || isGenerating || (idea && idea._id !== id)) {
    return (
      <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, idx) => (
              <CanvasSkeleton key={idx} />
            ))}
          </div>
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

  if (!idea) {
    return null;
  }

  const canvasContent = idea.canvasContent || {};

  const canvasSections = [
    {
      title: 'Problem',
      content: canvasContent.problem,
      icon: Target,
      color: 'text-rose-400',
    },
    {
      title: 'Customer Segments',
      content: canvasContent.customerSegments,
      icon: Users,
      color: 'text-blue-400',
    },
    {
      title: 'Solution',
      content: canvasContent.solution,
      icon: Lightbulb,
      color: 'text-emerald-400',
    },
    {
      title: 'Unique Value Proposition',
      content: canvasContent.uniqueValueProposition,
      icon: Zap,
      color: 'text-purple-400',
    },
    {
      title: 'Key Metrics',
      content: canvasContent.keyMetrics,
      icon: TrendingUp,
      color: 'text-amber-400',
    },
    {
      title: 'Channels',
      content: canvasContent.channels,
      icon: MessageSquare,
      color: 'text-cyan-400',
    },
    {
      title: 'Cost Structure',
      content: canvasContent.costStructure,
      icon: DollarSign,
      color: 'text-orange-400',
    },
    {
      title: 'Revenue Streams',
      content: canvasContent.revenueStreams,
      icon: DollarSign,
      color: 'text-emerald-400',
    },
    {
      title: 'Unfair Advantage',
      content: canvasContent.unfairAdvantage,
      icon: Zap,
      color: 'text-pink-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 selection:bg-[#7c3aed]/30">
      {/* Subtle Dot Grid Background Pattern like Dashboard */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton fallbackUrl="/saved-ideas" label="Back to Saved Ideas" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-lg shadow-purple-950/20">
              <Layout className="w-4 h-4 text-[#7c3aed]" />
            </div>
            <div>
              <h1 className="text-[20px] sm:text-[22px] font-semibold text-white tracking-tight">
                Business Model Canvas
              </h1>
              <p className="text-[11px] sm:text-[12px] text-gray-400 font-normal mt-0.5">
                Lean startup methodology visualization
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateCanvas}
            disabled={loading || isGenerating}
            className="btn-primary self-start sm:self-auto flex items-center gap-1.5 py-2 px-3.5 text-[12px] font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] rounded-xl border-b-[4px] border-[#3904a6] hover:translate-y-[2px] active:translate-y-[4px] active:border-b-0 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:border-b-[4px] shadow-[0_10px_20px_-5px_rgba(124,58,237,0.3)] shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Regenerate'} (1 Credit)</span>
          </button>
        </div>

        {/* 9 Canvas Blocks Grid */}
        {Object.keys(canvasContent).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {canvasSections.map((section) => (
              <div
                key={section.title}
                className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-4 sm:p-5 shadow-xl hover:border-[#7c3aed]/40 transition-all flex flex-col justify-start"
              >
                <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center shrink-0">
                    <section.icon className={`w-3.5 h-3.5 ${section.color}`} />
                  </div>
                  <h2 className="text-[13px] sm:text-[14px] font-semibold text-white">
                    {section.title}
                  </h2>
                </div>

                <div className="text-[11px] sm:text-[12px] text-gray-300 leading-relaxed text-justify space-y-1.5 overflow-y-auto max-h-[350px] pr-1">
                  <ReactMarkdown>{section.content || 'No content available'}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[18px] bg-[#0a0a0a]/95 border border-white/10 p-12 text-center shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-center mx-auto mb-3">
              <Layout className="w-6 h-6 text-[#7c3aed]" />
            </div>
            <h3 className="text-[16px] font-semibold text-white mb-1.5">
              {isGenerating ? 'Generating Canvas...' : 'No Business Model Canvas Available'}
            </h3>
            <p className="text-[12px] text-gray-400 max-w-md mx-auto mb-4 leading-relaxed">
              {isGenerating ? 'Please wait while we create your business model canvas.' : 'Click the generate button to create your canvas.'}
            </p>

            {isGenerating ? (
              <div className="flex justify-center">
                <RefreshCw className="w-5 h-5 text-[#7c3aed] animate-spin" />
              </div>
            ) : (
              <button
                onClick={handleGenerateCanvas}
                className="btn-primary inline-flex items-center gap-1.5 py-2 px-4 text-[12px] font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] rounded-xl border-b-[4px] border-[#3904a6] hover:translate-y-[2px] active:translate-y-[4px] active:border-b-0 transition-all duration-150 shadow-[0_10px_20px_-5px_rgba(124,58,237,0.3)] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Generate Canvas (1 Credit)</span>
              </button>
            )}
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

export default Canvas;