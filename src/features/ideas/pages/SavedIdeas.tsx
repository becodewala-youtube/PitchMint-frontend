import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/shared/hooks';
import { getSavedIdeas, deleteIdea } from '@/features/ideas/store/ideaSlice';
import { RootState } from '@/app/store';

import { 
  FileText, 
  Layout, 
  Trash2, 
  AlertCircle, 
  Users, 
  MessageSquare, 
  Brain, 
  Star, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  Plus 
} from 'lucide-react';
import DeleteConfirmationModal from '@/shared/components/feedback/DeleteConfirmationModal';
import SavedIdeasSkeleton from '@/features/ideas/components/SavedIdeasSkeleton';

const SavedIdeas = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { ideas, loading, error } = useSelector((state: RootState) => state.idea);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (ideas.length === 0) {
      dispatch(getSavedIdeas());
    }
  }, [dispatch, ideas.length]);

  const handleDeleteClick = (ideaId: string) => {
    setSelectedIdeaId(ideaId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedIdeaId) {
      setDeleteLoading(true);
      await dispatch(deleteIdea(selectedIdeaId));
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setSelectedIdeaId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <SavedIdeasSkeleton />
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

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 selection:bg-[#7c3aed]/30">
      {/* Subtle Dot Grid Background Pattern like Dashboard */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-lg shadow-purple-950/20">
              <Brain className="w-4 h-4 text-[#7c3aed]" />
            </div>
            <div>
              <h1 className="text-[20px] sm:text-[22px] font-semibold text-white tracking-tight">
                Your Startup Ideas
              </h1>
              <p className="text-[11px] sm:text-[12px] text-gray-400 font-normal mt-0.5">
                Manage and track your validated concepts
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/submit-idea')}
            className="btn-primary self-start sm:self-auto flex items-center gap-1.5 py-2 px-3.5 text-[12px] font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] rounded-xl border-b-[4px] border-[#3904a6] hover:translate-y-[2px] active:translate-y-[4px] active:border-b-0 transition-all duration-150 shadow-[0_10px_20px_-5px_rgba(124,58,237,0.3)] shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit New Idea</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stats Summary Bar */}
        {ideas.length > 0 && (
          <div className="rounded-xl bg-[#0a0a0a]/95 border border-white/10 p-3 mb-5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#7c3aed]" />
              <span className="text-[12px] font-semibold text-white">
                {ideas.length} {ideas.length === 1 ? 'Idea' : 'Ideas'} Validated
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-medium text-gray-300">
                Avg Score: {ideas.length ? Math.round(ideas.reduce((acc, idea) => acc + idea.overallScore, 0) / ideas.length) : 0}%
              </span>
            </div>
          </div>
        )}

        {/* Ideas List */}
        {ideas.length > 0 ? (
          <div className="space-y-3.5">
            {ideas.map((idea) => (
              <div
                key={idea._id}
                className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-4 sm:p-5 shadow-xl hover:border-[#7c3aed]/40 transition-all space-y-3"
              >
                {/* Top Section */}
                <div>
                  <h2 
                    onClick={() => navigate(`/idea/${idea._id}`)}
                    className="text-[13px] sm:text-[14px] font-semibold text-white hover:text-[#a78bfa] transition-colors cursor-pointer leading-snug line-clamp-2 mb-2"
                  >
                    {idea.ideaText}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Score Badge */}
                    <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                      idea.overallScore >= 80
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : idea.overallScore >= 60
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      <Star className="w-3 h-3" />
                      <span>{idea.overallScore}% Score</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(idea.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2.5 border-t border-white/5">
                  <button
                    onClick={() => navigate(`/pitch-deck/${idea._id}`)}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-[#141414] hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#7c3aed]" />
                    <span>{idea.pitchDeckContent ? 'View Deck' : 'Create Deck'}</span>
                  </button>

                  <button
                    onClick={() => navigate(`/canvas/${idea._id}`)}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-[#141414] hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Layout className="w-3.5 h-3.5 text-blue-400" />
                    <span>{idea.canvasContent ? 'View Canvas' : 'Create Canvas'}</span>
                  </button>

                  <button
                    onClick={() => navigate(`/competitors/${idea._id}`)}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-[#141414] hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{idea.competitorAnalysis ? 'View Analysis' : 'Analyze'}</span>
                  </button>

                  <button
                    onClick={() => navigate(`/pitch-simulator/${idea._id}`)}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-[#141414] hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>{idea.pitchSimulation ? 'Practice' : 'Start Practice'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteClick(idea._id)}
                    className="col-span-2 sm:col-span-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[18px] bg-[#0a0a0a]/95 border border-white/10 p-8 text-center backdrop-blur-xl shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-center mx-auto mb-3">
              <Brain className="w-5 h-5 text-[#7c3aed]" />
            </div>
            <h3 className="text-[15px] font-semibold text-white mb-1.5">
              No Ideas Yet
            </h3>
            <p className="text-[12px] text-gray-400 max-w-md mx-auto mb-4 leading-relaxed">
              You haven't submitted any ideas yet. Start your entrepreneurial journey today and get instant AI validation!
            </p>
            <button
              onClick={() => navigate('/submit-idea')}
              className="btn-primary inline-flex items-center gap-1.5 py-2 px-4 text-[12px] font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] rounded-xl border-b-[4px] border-[#3904a6] hover:translate-y-[2px] active:translate-y-[4px] active:border-b-0 transition-all duration-150 shadow-[0_10px_20px_-5px_rgba(124,58,237,0.3)] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Your First Idea</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedIdeaId(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
};

export default SavedIdeas;