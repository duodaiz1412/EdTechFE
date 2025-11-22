import {enrollServices} from "@/lib/services/enroll.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {Purchase} from "@/types";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";

export default function PurchaseHistory() {
  const [page, setPage] = useState(1);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const {isLoading} = useQuery({
    queryKey: ["purchaseHistory", page],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await enrollServices.getPurchaseHistory(
        accessToken,
        page,
      );
      setPurchases(response?.content || []);
      setTotalPages(response?.totalPages || 1);
      return response;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto p-4">
      <h1 className="text-xl font-bold mb-10">Purchase History</h1>

      <div className="overflow-x-auto">
        {purchases.length > 0 && (
          <>
            {/* Data table */}
            <table className="min-w-full bg-white border border-gray-300 rounded-t-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border"></th>
                  <th className="px-4 py-2 border">Title</th>
                  <th className="px-4 py-2 border">Purchase Date</th>
                  <th className="px-4 py-2 border">Price</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase: Purchase, idx: number) => (
                  <tr key={purchase.courseTitle} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{idx + 1}</td>
                    <td className="px-4 py-2 border">{purchase.courseTitle}</td>
                    <td className="px-4 py-2 border">
                      {new Date(
                        purchase.enrollmentDate || new Date(),
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
        {purchases.length === 0 && (
          <p className="rounded-lg p-6 bg-slate-100 text-lg text-center">
            No purchase found
          </p>
        )}
      </div>
    </div>
  );
}
