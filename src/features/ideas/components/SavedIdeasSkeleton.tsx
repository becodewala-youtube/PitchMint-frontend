

const SavedIdeasSkeleton = () => {
  
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div className="text-center md:text-left">
          <div className={`h-12 w-64 bg-gray-700 rounded animate-pulse mb-4`}></div>
          <div className={`h-6 w-48 bg-gray-700 rounded animate-pulse`}></div>
        </div>
        <div className={`h-12 w-40 bg-gray-700 rounded animate-pulse mt-6 md:mt-0`}></div>
      </div>
      
      {/* Ideas Grid Skeleton */}
      <div className="grid grid-cols-1 gap-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-3xl shadow-2xl p-8 animate-pulse">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className={`h-6 bg-gray-700 rounded mb-4`}></div>
                <div className="flex items-center space-x-6 mb-6">
                  <div className={`h-5 w-24 bg-gray-700 rounded`}></div>
                  <div className={`h-4 w-20 bg-gray-700 rounded`}></div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-10 w-32 bg-gray-700 rounded-xl`}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedIdeasSkeleton;