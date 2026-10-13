const SavedIdeasSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-white/10 animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-white/[0.08] rounded-lg animate-pulse" />
            <div className="h-3.5 w-60 bg-white/[0.05] rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="h-9 w-36 bg-white/[0.08] rounded-xl animate-pulse" />
      </div>

      {/* Stats Summary Bar Skeleton */}
      <div className="rounded-xl bg-[#0a0a0a] border border-white/10 p-3 mb-5 flex flex-wrap items-center justify-between gap-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] animate-pulse">
        <div className="h-4 w-32 bg-white/[0.06] rounded" />
        <div className="h-4 w-40 bg-white/[0.05] rounded" />
      </div>

      {/* Ideas Grid Skeleton */}
      <div className="grid grid-cols-1 gap-5">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] animate-pulse"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
              <div className="flex-1 space-y-2.5 w-full">
                <div className="h-5 w-3/4 bg-white/[0.08] rounded" />
                <div className="h-3.5 w-1/3 bg-white/[0.05] rounded" />
              </div>
              <div className="h-7 w-20 bg-white/[0.06] rounded-xl shrink-0" />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-white/5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-28 bg-white/[0.05] rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedIdeasSkeleton;