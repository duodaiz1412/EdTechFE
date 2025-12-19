const TableSkeleton = () => (
  <div className="divide-y divide-gray-200">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex space-x-4 py-4 animate-pulse">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
      </div>
    ))}
  </div>
);
export default TableSkeleton;
