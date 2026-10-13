const CanvasSkeleton = () => {
  return (
    <div className="p-5 sm:p-6 rounded-[18px] bg-[#0a0a0a] border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-white/[0.08]" />
        <div className="h-4 w-32 bg-white/[0.08] rounded" />
      </div>
      <div className="space-y-2 pt-1">
        <div className="h-3.5 w-full bg-white/[0.05] rounded" />
        <div className="h-3.5 w-full bg-white/[0.05] rounded" />
        <div className="h-3.5 w-4/5 bg-white/[0.05] rounded" />
      </div>
    </div>
  );
};

export default CanvasSkeleton;