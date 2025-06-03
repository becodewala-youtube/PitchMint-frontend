import React from "react";

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="h-24 bg-gray-300 dark:bg-gray-700 rounded-lg"
          ></div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="h-28 bg-gray-300 dark:bg-gray-700 rounded-lg"
          ></div>
        ))}
      </div>

      {/* Recent Ideas */}
      <div className="space-y-4">
        <div className="h-5 w-1/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
