import {ChevronLeft, ChevronRight, Users} from "lucide-react";
import React from "react";
import TableSkeleton from "./TableSkeleton";

export interface IPerformanceItem {
  id: string;
  title: string;
  totalRevenue: number;
  enrollmentCount: number;
}

export interface IPagination {
  number: number;
  totalPages: number;
  totalElements: number;
}

// Reusable Table Header component
const TableHead = () => (
  <thead className="bg-indigo-50 border-b border-indigo-200">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider w-16">
        Rank
      </th>
      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
        Title
      </th>
      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider w-64">
        Revenue
      </th>
      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider w-32">
        <Users className="w-4 h-4 inline-block mr-1 align-text-bottom" />{" "}
        Enrollments
      </th>
    </tr>
  </thead>
);

interface PerformanceTableProps {
  title: string;
  data: IPerformanceItem[];
  pagination: IPagination | null;
  onPageChange: (page: number) => void;
  loading: boolean;
  formatCurrency: (value: number) => string;
  currentPage: number; // New prop for ranking calculation
}

const PerformanceTable: React.FC<PerformanceTableProps> = ({
  title,
  data,
  pagination,
  onPageChange,
  loading,
  formatCurrency,
  currentPage,
}) => {
  const handlePrev = () => {
    if (pagination && pagination.number > 0) {
      onPageChange(pagination.number - 1);
    }
  };

  const handleNext = () => {
    if (pagination && pagination.number < pagination.totalPages - 1) {
      onPageChange(pagination.number + 1);
    }
  };

  const itemsPerPage = 5; // Matches the fetch limit

  const maxRevenue = data.reduce(
    (max, item) => Math.max(max, item.totalRevenue),
    0,
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
        {title}
      </h3>
      {loading ? (
        <TableSkeleton />
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg p-4">
          No performance data available for this category.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <TableHead />
              <tbody className="bg-white divide-y divide-gray-100">
                {data.map((item, index) => {
                  const rank = currentPage * itemsPerPage + index + 1;
                  const revenuePercentage =
                    maxRevenue > 0 ? (item.totalRevenue / maxRevenue) * 100 : 0;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-indigo-50/50 transition duration-100"
                    >
                      <td className="px-6 py-4 text-sm font-extrabold text-indigo-600">
                        #{rank}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                        {formatCurrency(item.totalRevenue)}
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{width: `${revenuePercentage}%`}}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                          {item.enrollmentCount}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination Controls (Kept as is) */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <button
                onClick={handlePrev}
                disabled={pagination.number === 0}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-300 rounded-lg hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              <span className="text-sm font-medium text-gray-700">
                Page{" "}
                <span className="font-semibold">{pagination.number + 1}</span>{" "}
                of{" "}
                <span className="font-semibold">{pagination.totalPages}</span>
              </span>
              <button
                onClick={handleNext}
                disabled={pagination.number >= pagination.totalPages - 1}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-300 rounded-lg hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PerformanceTable;
