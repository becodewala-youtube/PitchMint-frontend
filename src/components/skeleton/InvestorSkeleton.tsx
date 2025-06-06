import React from "react";

const InvestorDirectorySkeleton: React.FC = () => {
  return (
    <div className="min-h-screen p-6 bg-white dark:bg-gray-900 animate-pulse">
      {/* Heading */}
      <div className="mb-6 space-y-2">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-72 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Filter dropdowns */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="h-10 w-40 bg-gray-300 dark:bg-gray-800 rounded-md"></div>
        <div className="h-10 w-40 bg-gray-300 dark:bg-gray-800 rounded-md"></div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg space-y-3"
          >
            {/* Title */}
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded"></div>

            {/* Tag */}
            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

            {/* Description */}
            <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>

            {/* Industry Focus */}
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded mt-2"></div>
            <div className="flex gap-2 mt-1">
              {[...Array(3)].map((_, tagIdx) => (
                <div key={tagIdx} className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              ))}
            </div>

            {/* Investment Range */}
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-600 mt-4 rounded"></div>
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>

            {/* Button */}
            <div className="h-9 w-24 bg-violet-300 dark:bg-violet-700 rounded-md mt-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestorDirectorySkeleton;
