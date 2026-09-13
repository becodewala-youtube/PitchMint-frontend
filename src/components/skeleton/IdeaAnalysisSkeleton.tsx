

const IdeaAnalysisSkeleton = () => {
  
  return (
    <div className="space-y-8">
      {/* Idea Overview Skeleton */}
      <div className={`card-glass card-glass-dark p-8 animate-pulse`}>
        <div className={`h-8 w-48 bg-gray-700 rounded mb-6`}></div>
        <div className={`h-6 bg-gray-700 rounded mb-4`}></div>
        <div className={`h-6 w-3/4 bg-gray-700 rounded mb-8`}></div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className={`h-20 bg-gray-700 rounded-2xl`}></div>
          ))}
        </div>
      </div>

      {/* Score Overview Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className={`card-glass card-glass-dark p-8 animate-pulse`}>
            <div className={`h-5 w-24 bg-gray-700 rounded mb-4`}></div>
            <div className={`h-12 w-16 bg-gray-700 rounded mb-2`}></div>
            <div className={`h-3 w-full bg-gray-700 rounded`}></div>
          </div>
        ))}
      </div>

      {/* Detailed Analysis Skeleton */}
      <div className={`card-glass card-glass-dark p-8 animate-pulse`}>
        <div className={`h-8 w-48 bg-gray-700 rounded mb-8`}></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className={`p-6 rounded-2xl bg-gray-700/50`}>
              <div className={`h-6 w-32 bg-gray-600 rounded mb-4`}></div>
              <div className={`h-4 bg-gray-600 rounded mb-2`}></div>
              <div className={`h-4 bg-gray-600 rounded mb-2`}></div>
              <div className={`h-4 w-3/4 bg-gray-600 rounded`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IdeaAnalysisSkeleton;