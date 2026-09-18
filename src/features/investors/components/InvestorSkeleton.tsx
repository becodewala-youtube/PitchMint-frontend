const InvestorDirectorySkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="w-10 h-10 bg-white/10 rounded-xl mb-3 animate-pulse"></div>
        <div className="h-6 w-48 bg-white/10 rounded mb-2 animate-pulse"></div>
        <div className="h-3.5 w-64 bg-white/5 rounded animate-pulse"></div>
      </div>

      {/* Filter Skeleton */}
      <div className="rounded-[16px] bg-[#0a0a0a]/95 border border-white/10 p-4 sm:p-5 mb-6">
        <div className="h-4 w-32 bg-white/10 rounded mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-9 bg-white/5 rounded-lg animate-pulse"></div>
          <div className="h-9 bg-white/5 rounded-lg animate-pulse"></div>
        </div>
      </div>
      
      {/* Investors Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {[...Array(6)].map((_, index) => (
          <div 
            key={index} 
            className="rounded-[16px] bg-[#0a0a0a]/95 border border-white/10 p-4 sm:p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="h-5 w-36 bg-white/10 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-white/10 rounded-full animate-pulse"></div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="h-3 w-full bg-white/5 rounded animate-pulse"></div>
                <div className="h-3 w-4/5 bg-white/5 rounded animate-pulse"></div>
              </div>
              
              <div className="p-3 rounded-xl bg-[#141414]/80 border border-white/5 mb-3">
                <div className="h-3 w-20 bg-white/10 rounded mb-2 animate-pulse"></div>
                <div className="flex flex-wrap gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-5 w-16 bg-white/5 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="h-12 bg-[#141414]/60 rounded-lg animate-pulse"></div>
                <div className="h-12 bg-[#141414]/60 rounded-lg animate-pulse"></div>
              </div>
            </div>
            
            <div className="h-9 w-full bg-white/10 rounded-lg animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestorDirectorySkeleton;