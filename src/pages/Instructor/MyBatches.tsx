import {instructorServices} from "@/lib/services/instructor.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {Batch} from "@/types";
import {useQuery} from "@tanstack/react-query";
import {Calendar, MoveRight} from "lucide-react";
import {useState} from "react";
import {Link} from "react-router-dom";

export default function MyBatches() {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const SIZE = 10;
  const status = "PUBLISHED";

  const {data, isLoading} = useQuery({
    queryKey: ["my-batches", page],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await instructorServices.getMyBatches(
        accessToken,
        page,
        SIZE,
        status,
      );
      setTotalPages(response.data.pagination?.totalPages || 1);
      return response.data.content;
    },
  });

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">
          My Published Batches
        </h2>
        <p className="text-slate-600 mt-2">
          Manage and view your active batches
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : data?.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
          <p className="text-slate-500 text-lg">No published batches yet</p>
        </div>
      ) : (
        <div className="grid gap-4 mb-8">
          {data?.map((batch: Batch) => (
            <div
              key={batch.id}
              className="group p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300"
            >
              <div className="flex justify-between items-center gap-4">
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {batch.title}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={18} className="text-blue-500" />
                    <span className="text-sm">
                      {new Date(batch?.startTime || "").toLocaleDateString(
                        "vi-VN",
                      )}
                      {" → "}
                      {new Date(batch?.endTime || "").toLocaleDateString(
                        "vi-VN",
                      )}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/batch/${batch.slug}/detail`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  <span>Go to discussion</span>
                  <MoveRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            className="btn btn-outline"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <button className="btn btn-primary">
            Page {page + 1} of {totalPages}
          </button>
          <button
            className="btn btn-outline"
            disabled={page === totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
