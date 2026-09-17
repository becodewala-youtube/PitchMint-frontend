

const CompetitorAnalysisSkeleton = () => {
  
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className={`h-8 w-48 bg-gray-700 rounded animate-pulse`}></div>
        <div className={`h-10 w-32 bg-gray-700 rounded animate-pulse`}></div>
      </div>
      
      {/* Idea Card Skeleton */}
      <div className={`bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse`}>
        <div className={`h-6 w-24 bg-gray-700 rounded mb-4`}></div>
        <div className={`h-4 bg-gray-700 rounded mb-2`}></div>
        <div className={`h-4 bg-gray-700 rounded mb-2`}></div>
        <div className={`h-4 w-3/4 bg-gray-700 rounded`}></div>
      </div>
      
      {/* Market Overview Skeleton */}
      <div className={`bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse`}>
        <div className={`h-6 w-32 bg-gray-700 rounded mb-4`}></div>
        <div className={`h-4 bg-gray-700 rounded mb-2`}></div>
        <div className={`h-4 bg-gray-700 rounded mb-2`}></div>
        <div className={`h-4 w-2/3 bg-gray-700 rounded`}></div>
      </div>
      
      {/* Competitors Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className={`bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse`}>
            <div className={`h-6 w-32 bg-gray-700 rounded mb-4`}></div>
            <div className={`h-4 bg-gray-700 rounded mb-2`}></div>
            <div className={`h-4 w-3/4 bg-gray-700 rounded mb-4`}></div>
            
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className={`h-4 w-20 bg-gray-700 rounded mb-2`}></div>
                  <div className={`h-3 bg-gray-700 rounded mb-1`}></div>
                  <div className={`h-3 w-4/5 bg-gray-700 rounded`}></div>
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