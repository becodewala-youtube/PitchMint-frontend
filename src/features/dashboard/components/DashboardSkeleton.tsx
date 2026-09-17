

const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#0a0a0a] border border-white/10 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-6 w-56 bg-white/[0.08] rounded-lg animate-pulse"></div>
          <div className="h-4 w-40 bg-white/[0.05] rounded-lg animate-pulse"></div>
        </div>
      </div>
      
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] mb-3"></div>
            <div className="h-3 w-16 bg-white/[0.05] rounded mb-2"></div>
            <div className="h-6 w-10 bg-white/[0.08] rounded"></div>
          </div>
        ))}
      </div>
      
      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] animate-pulse">
            <div className="w-11 h-11 rounded-xl bg-white/[0.06] mb-5"></div>
            <div className="h-5 w-32 bg-white/[0.08] rounded mb-3"></div>
            <div className="h-4 w-full bg-white/[0.05] rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-white/[0.05] rounded mb-5"></div>
            <div className="h-4 w-24 bg-white/[0.06] rounded"></div>
          </div>
        ))}
      </div>
      
      {/* Recent Ideas Table Skeleton */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <div className="h-5 w-32 bg-white/[0.08] rounded animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="h-4 flex-1 bg-white/[0.06] rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-white/[0.08] rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-white/[0.05] rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;