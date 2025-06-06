import React from "react";

const PitchSimulatorSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen p-6 animate-pulse bg-white dark:bg-gray-900 space-y-6">
      {/* Heading */}
      <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Pitch Box */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md space-y-3">
        <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Question Box */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md space-y-3">
        <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-11/12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Answer Input */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
        <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Feedback Box */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md space-y-4">
        {/* Rating */}
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>

        {/* Strengths */}
        <div className="space-y-2">
          <div className="h-4 w-36 bg-gray-300 dark:bg-gray-600 rounded"></div>
          {[...Array(1)].map((_, i) => (
            <div key={i} className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>

        {/* Areas for Improvement */}
        <div className="space-y-2">
          <div className="h-4 w-56 bg-gray-300 dark:bg-gray-600 rounded"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>

        {/* Additional Advice */}
        <div className="space-y-2">
          <div className="h-4 w-44 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <div className="h-10 w-36 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
        <div className="h-10 w-36 bg-green-300 dark:bg-green-600 rounded-md"></div>
      </div>
    </div>
  );
};

export default PitchSimulatorSkeleton;
