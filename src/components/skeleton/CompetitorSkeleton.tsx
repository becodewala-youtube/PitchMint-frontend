import React from "react";

const CompetitorAnalysisSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 animate-pulse">
      {/* Page Title */}
      <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>

      {/* Your Idea Card */}
      <div className="bg-gray-200 dark:bg-gray-800 p-5 rounded-lg mb-4 space-y-3">
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Market Overview Card */}
      <div className="bg-gray-200 dark:bg-gray-800 p-5 rounded-lg mb-6 space-y-3">
        <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-3 w-11/12 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Competitor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-800 p-5 rounded-lg space-y-4">
            {/* Header */}
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>

            {/* SWOT Sections */}
            {["Strengths", "Weaknesses", "Opportunities", "Threats"].map((section, j) => (
              <div key={j}>
                <div className="h-3 w-28 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                <ul className="space-y-1">
                  {[...Array(3)].map((_, k) => (
                    <li
                      key={k}
                      className="h-2.5 w-full bg-gray-300 dark:bg-gray-700 rounded"
                    ></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorAnalysisSkeleton;
