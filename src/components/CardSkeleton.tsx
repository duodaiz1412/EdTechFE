import React from "react";

const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg animate-pulse h-32">
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
    <div className="h-8 bg-indigo-100 rounded w-3/4"></div>
  </div>
);
export default CardSkeleton;
