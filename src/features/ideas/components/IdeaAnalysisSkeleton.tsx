const IdeaAnalysisSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-white/10 animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 w-52 bg-white/[0.08] rounded-lg animate-pulse" />
          <div className="h-3.5 w-64 bg-white/[0.05] rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Idea Overview Skeleton */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] animate-pulse">
        <div className="h-5 w-3/4 bg-white/[0.08] rounded mb-3" />
        <div className="h-4 w-full bg-white/[0.05] rounded mb-2" />
        <div className="h-4 w-2/3 bg-white/[0.05] rounded mb-6" />
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-10 bg-white/[0.06] border border-white/5 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Score Overview Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="h-3.5 w-24 bg-white/[0.05] rounded" />
              <div className="w-7 h-7 rounded-lg bg-white/[0.06]" />
            </div>
            <div className="h-7 w-16 bg-white/[0.08] rounded mb-3" />
            <div className="h-2 w-full bg-white/[0.05] rounded-full" />
          </div>
        ))}
      </div>

      {/* Detailed Analysis Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] animate-pulse">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06]" />
              <div className="h-4 w-36 bg-white/[0.08] rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-white/[0.05] rounded" />
              <div className="h-3.5 w-full bg-white/[0.05] rounded" />
              <div className="h-3.5 w-4/5 bg-white/[0.05] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeaAnalysisSkeleton;