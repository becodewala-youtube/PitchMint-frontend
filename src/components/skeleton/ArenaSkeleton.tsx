import { useTheme } from '../../contexts/ThemeContext';

const ArenaSkeleton = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className={`h-8 w-48 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
        <div className={`h-10 w-40 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
      </div>
      
      {/* Pitch Display Skeleton */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 animate-pulse`}>
        <div className={`h-6 w-24 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4`}></div>
        <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
        <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
        <div className={`h-4 w-3/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
      </div>
      
      {/* Q&A Section Skeleton */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 animate-pulse`}>
        {/* Question Skeleton */}
        <div className={`p-6 rounded-xl mb-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className={`h-5 w-48 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded mb-4`}></div>
          <div className={`h-4 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded mb-2`}></div>
          <div className={`h-4 w-5/6 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded`}></div>
        </div>
        
        {/* Answer Input Skeleton */}
        <div className="mb-6">
          <div className={`h-4 w-24 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
          <div className={`h-32 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
        </div>
        
        {/* Submit Button Skeleton */}
        <div className={`h-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
        
        {/* Navigation Buttons Skeleton */}
        <div className="flex justify-between space-x-4 mt-8">
          <div className={`flex-1 h-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
          <div className={`flex-1 h-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
        </div>
      </div>
    </div>
  );
};

export default ArenaSkeleton;