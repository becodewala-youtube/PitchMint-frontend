import React from "react";

const SavedIdeasSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 animate-pulse">
      {/* Header + Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Skeleton Cards */}
      <div className="space-y-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg space-y-4"
          >
            <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="flex items-center justify-between">
              <div className="h-3 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              {[...Array(4)].map((_, btnIndex) => (
                <div
                  key={btnIndex}
                  className="h-8 w-28 bg-gray-300 dark:bg-gray-700 rounded-md"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedIdeasSkeleton;
