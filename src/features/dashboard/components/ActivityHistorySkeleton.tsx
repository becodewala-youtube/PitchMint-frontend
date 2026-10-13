const ActivityHistorySkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Page Header Skeleton */}
      <div className="text-center space-y-2.5">
        <div className="h-7 w-60 mx-auto rounded-lg bg-white/[0.08] animate-pulse" />
        <div className="h-4 w-80 mx-auto rounded-lg bg-white/[0.05] animate-pulse" />
      </div>

      {/* Filter Buttons Skeleton */}
      <div className="flex flex-wrap gap-2.5 justify-center">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-9 w-28 rounded-xl bg-[#0a0a0a] border border-white/10 animate-pulse"
          />
        ))}
      </div>

      {/* Activity List Skeleton */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] gap-4 animate-pulse"
          >
            {/* Left Content */}
            <div className="flex flex-col space-y-2.5 flex-1">
              <div className="h-4 w-1/3 rounded bg-white/[0.08]" />
              <div className="h-3.5 w-2/3 rounded bg-white/[0.05]" />
              <div className="flex items-center space-x-4 pt-1">
                <div className="h-3 w-20 rounded bg-white/[0.05]" />
                <div className="h-3 w-24 rounded bg-white/[0.05]" />
              </div>
            </div>

            {/* Right Button */}
            <div className="h-8 w-24 rounded-xl bg-white/[0.06] shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityHistorySkeleton;
