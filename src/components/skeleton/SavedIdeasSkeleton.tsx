import { useTheme } from '../../contexts/ThemeContext';

const SavedIdeasSkeleton = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="section-header">
        <div className="text-center md:text-left">
          <div className={`h-12 w-64 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse mb-4`}></div>
          <div className={`h-6 w-48 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
        </div>
        <div className={`h-12 w-40 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse mt-6 md:mt-0`}></div>
      </div>
      
      {/* Ideas Grid Skeleton */}
      <div className="grid grid-cols-1 gap-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8 animate-pulse`}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className={`h-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4`}></div>
                <div className="flex items-center space-x-6 mb-6">
                  <div className={`h-5 w-24 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                  <div className={`h-4 w-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-10 w-32 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-xl`}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedIdeasSkeleton;