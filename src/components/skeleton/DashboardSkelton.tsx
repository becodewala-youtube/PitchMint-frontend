import { useTheme } from '../../contexts/ThemeContext';

const DashboardSkeleton = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="page-header">
        <div className={`h-12 w-64 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse mx-auto mb-4`}></div>
        <div className={`h-6 w-48 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse mx-auto`}></div>
      </div>
      
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8 animate-pulse`}>
            <div className="flex items-center">
              <div className={`w-16 h-16 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mr-6`}></div>
              <div className="flex-1">
                <div className={`h-4 w-24 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
                <div className={`h-8 w-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8 animate-pulse`}>
            <div className={`w-16 h-16 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-6`}></div>
            <div className={`h-6 w-32 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-3`}></div>
            <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
            <div className={`h-4 w-3/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
          </div>
        ))}
      </div>
      
      {/* Recent Ideas Table Skeleton */}
      <div className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} overflow-hidden`}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`h-6 w-32 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className={`h-4 flex-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
              <div className={`h-6 w-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
              <div className={`h-4 w-24 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;