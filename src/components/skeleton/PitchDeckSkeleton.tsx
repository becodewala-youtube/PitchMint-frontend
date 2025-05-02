const SlideSkeleton = () => {
    return (
      <div className="flex justify-center items-center h-screen px-4">
        <div className="w-full max-w-5xl bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
  
          <div className="h-6 w-1/4 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
  
          <div className="space-y-3 mb-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            ))}
          </div>
  
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-10 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default SlideSkeleton;
  