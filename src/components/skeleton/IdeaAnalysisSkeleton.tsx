import React from "react";

const IdeaAnalysisSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 animate-pulse">
      {/* Header Card */}
      <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg mb-6 space-y-4">
        <div className="h-5 w-2/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="flex flex-wrap gap-4 pt-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-44 bg-gray-300 dark:bg-gray-700 rounded-md"
            ></div>
          ))}
        </div>
      </div>

      {/* Score Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg p-4 flex flex-col justify-center items-center space-y-2"
          >
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>

      {/* Detailed Analysis Section */}
      <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-11/12 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-10/12 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeaAnalysisSkeleton;
