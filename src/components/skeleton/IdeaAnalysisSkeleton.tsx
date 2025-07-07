import { useTheme } from '../../contexts/ThemeContext';

const IdeaAnalysisSkeleton = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className="space-y-8">
      {/* Idea Overview Skeleton */}
      <div className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8 animate-pulse`}>
        <div className={`h-8 w-48 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-6`}></div>
        <div className={`h-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4`}></div>
        <div className={`h-6 w-3/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-8`}></div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className={`h-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-2xl`}></div>
          ))}
        </div>
      </div>

      {/* Score Overview Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8 animate-pulse`}>
            <div className={`h-5 w-24 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4`}></div>
            <div className={`h-12 w-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
            <div className={`h-3 w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
          </div>
        ))}
      </div>

      {/* Detailed Analysis Skeleton */}
      <div className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8 animate-pulse`}>
        <div className={`h-8 w-48 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-8`}></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50/50'}`}>
              <div className={`h-6 w-32 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded mb-4`}></div>
              <div className={`h-4 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded mb-2`}></div>
              <div className={`h-4 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded mb-2`}></div>
              <div className={`h-4 w-3/4 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IdeaAnalysisSkeleton;