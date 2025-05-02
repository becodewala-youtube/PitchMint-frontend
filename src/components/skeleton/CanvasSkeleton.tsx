// SkeletonCard.jsx (React Component)
const SkeletonCard = () => {
  return (
    <div className="px-24 py-8">
      <div className="rounded-lg p-4 bg-gray-200 dark:bg-gray-800 shadow animate-pulse w-full h-60">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
