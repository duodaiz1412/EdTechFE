import {enrollServices} from "@/lib/services/enroll.services";
import {formatDate} from "@/lib/utils/formatDate";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {Purchase} from "@/types";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";

export default function PurchaseHistory() {
  const [filterBy, setFilterBy] = useState<"COURSE" | "BATCH">("COURSE");
  const [page, setPage] = useState(0);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const {isLoading} = useQuery({
    queryKey: ["purchaseHistory", filterBy, page],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await enrollServices.getPurchaseHistory(
        accessToken,
        filterBy,
        page,
      );
      setPurchases(response?.content || []);
      setTotalPages(response?.totalPages || 1);
      return response;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Purchase History
        </h1>
        <p className="text-gray-600">View all your purchases</p>
      </div>

      {/* Filter select */}
      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="filter" className="text-sm font-medium text-gray-700">
          Filter by:
        </label>
        <select
          id="filter"
          value={filterBy}
          onChange={(e) => {
            setFilterBy(e.target.value as "COURSE" | "BATCH");
            setPage(0);
          }}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="COURSE">Course</option>
          <option value="BATCH">Batch</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {purchases.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {filterBy} Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Purchase Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchases.map((purchase: Purchase, idx: number) => (
                    <tr
                      key={purchase.courseTitle}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page * 10 + idx + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {purchase.courseTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(purchase.enrollmentDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>

              <span className="text-sm text-gray-700">
                Page <span className="font-semibold">{page + 1}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages - 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No purchases yet
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
