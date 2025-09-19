import { useTheme } from '../../contexts/ThemeContext';

const ActivityHistorySkeleton = () => {
  const { darkMode } = useTheme();

  return (
    <div className="space-y-10">
      {/* Page Header Skeleton */}
      <div className="text-center">
        <div
          className={`h-10 w-60 mx-auto mb-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}
        ></div>
        <div
          className={`h-6 w-80 mx-auto rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}
        ></div>
      </div>

      {/* Filter Buttons Skeleton */}
      <div className="flex flex-wrap gap-4 justify-center">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`h-10 w-32 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}
          ></div>
        ))}
      </div>

      {/* Activity List Skeleton */}
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-6 rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            } animate-pulse`}
          >
            {/* Left Content */}
            <div className="flex flex-col space-y-3 w-3/4">
              <div
                className={`h-5 w-2/3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              ></div>
              <div
                className={`h-4 w-1/2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              ></div>
              <div className="flex items-center space-x-4">
                <div
                  className={`h-4 w-20 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                ></div>
                <div
                  className={`h-4 w-16 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                ></div>
              </div>
            </div>

            {/* Right Button */}
            <div
              className={`h-9 w-28 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityHistorySkeleton;
