const CompetitorAnalysisSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-white/10 animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-52 bg-white/[0.08] rounded-lg animate-pulse" />
            <div className="h-3.5 w-64 bg-white/[0.05] rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="h-9 w-32 bg-white/[0.08] rounded-xl animate-pulse" />
      </div>

      {/* Idea Overview Card Skeleton */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] animate-pulse">
        <div className="h-4 w-32 bg-white/[0.08] rounded mb-3" />
        <div className="h-3.5 w-full bg-white/[0.05] rounded mb-2" />
        <div className="h-3.5 w-3/4 bg-white/[0.05] rounded" />
      </div>

      {/* Market Overview Skeleton */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] animate-pulse">
        <div className="h-4 w-36 bg-white/[0.08] rounded mb-3" />
        <div className="h-3.5 w-full bg-white/[0.05] rounded mb-2" />
        <div className="h-3.5 w-2/3 bg-white/[0.05] rounded" />
      </div>

      {/* Competitors Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] space-y-4 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-36 bg-white/[0.08] rounded" />
              <div className="w-6 h-6 rounded-lg bg-white/[0.06]" />
            </div>
            <div className="h-3.5 w-full bg-white/[0.05] rounded" />
            <div className="h-3.5 w-4/5 bg-white/[0.05] rounded" />

            {/* SWOT Preview Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#141414] border border-white/5 space-y-2">
                  <div className="h-3 w-16 bg-white/[0.08] rounded" />
                  <div className="h-2.5 w-full bg-white/[0.05] rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorAnalysisSkeleton;