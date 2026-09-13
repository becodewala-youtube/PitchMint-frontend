

const CanvasSkeleton = () => {
  
  return (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse`}>
      <div className={`h-6 bg-gray-700 rounded mb-4`}></div>
      <div className={`h-4 bg-gray-700 rounded mb-2`}></div>
      <div className={`h-4 bg-gray-700 rounded mb-2`}></div>
      <div className={`h-4 bg-gray-700 rounded w-3/4`}></div>
    </div>
  );
};

export default CanvasSkeleton;