const ArenaSkeleton = () => {
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
        <div className="h-4 w-28 bg-white/[0.08] rounded mb-3" />
        <div className="h-3.5 w-full bg-white/[0.05] rounded mb-2" />
        <div className="h-3.5 w-3/4 bg-white/[0.05] rounded" />
      </div>

      {/* Q&A / Simulation Section Skeleton */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] space-y-5 animate-pulse">
        {/* Question Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#141414] border border-white/5 space-y-2.5">
          <div className="h-4 w-32 bg-white/[0.08] rounded" />
          <div className="h-4 w-full bg-white/[0.06] rounded" />
          <div className="h-4 w-4/5 bg-white/[0.06] rounded" />
        </div>

        {/* Answer Box */}
        <div className="space-y-2">
          <div className="h-3.5 w-24 bg-white/[0.05] rounded" />
          <div className="h-28 w-full bg-[#141414] border border-white/5 rounded-xl" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
          <div className="h-10 w-36 bg-white/[0.08] rounded-xl" />
          <div className="h-10 w-36 bg-white/[0.06] rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default ArenaSkeleton;