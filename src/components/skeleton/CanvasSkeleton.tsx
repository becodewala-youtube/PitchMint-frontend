import { useTheme } from '../../contexts/ThemeContext';

const CanvasSkeleton = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg animate-pulse`}>
      <div className={`h-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4`}></div>
      <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
      <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
      <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4`}></div>
    </div>
  );
};

export default CanvasSkeleton;