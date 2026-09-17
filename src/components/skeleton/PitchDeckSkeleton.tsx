const SlideSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      <div className="w-full bg-[#0a0a0a]/95 border border-white/10 p-6 rounded-[18px] shadow-sm">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-white/5">
          <div className="w-8 h-8 bg-white/10 rounded-lg animate-pulse"></div>
          <div className="w-28 h-4 bg-white/10 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-white/10 rounded-lg animate-pulse"></div>
        </div>

        <div className="h-6 w-1/4 bg-white/10 rounded mb-4 animate-pulse"></div>

        <div className="space-y-3 mb-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-3 w-full bg-white/5 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      <div className="w-full bg-[#0a0a0a]/95 border border-white/10 p-4 rounded-[16px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="h-9 rounded-lg bg-white/5 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlideSkeleton;