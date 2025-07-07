import { useTheme } from '../../contexts/ThemeContext';

const InvestorDirectorySkeleton = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className={`h-8 w-48 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2 animate-pulse`}></div>
          <div className={`h-4 w-64 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <div className={`h-10 w-32 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
          <div className={`h-10 w-32 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
        </div>
      </div>
      
      {/* Investors Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden animate-pulse`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className={`h-6 w-32 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
                  <div className={`h-4 w-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                </div>
              </div>
              
              <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
              <div className={`h-4 w-3/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4`}></div>
              
              <div className="mb-4">
                <div className={`h-4 w-24 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`h-6 w-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <div className={`h-4 w-28 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
                <div className={`h-4 w-40 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
              </div>
              
              <div className={`h-10 w-24 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestorDirectorySkeleton;