import {useLocation, useParams} from "react-router-dom";
import BatchNavbar from "./components/Batch/BatchNavbar";
import {publicServices} from "@/lib/services/public.services";
import {useQuery} from "@tanstack/react-query";
import {LogIn, Video} from "lucide-react";
import BatchDiscussion from "@/pages/Batch/BatchContent.tsx/BatchDiscussion";
import BatchRecords from "@/pages/Batch/BatchContent.tsx/BatchVideo/BatchRecords";
import Footer from "@/components/Footer";

export default function BatchLayout() {
  const {batchSlug} = useParams();
  const location = useLocation();

  const {data, isLoading} = useQuery({
    queryKey: ["batch", batchSlug],
    queryFn: async () => {
      const response = await publicServices.getBatchBySlug(batchSlug || "");
      return response;
    },
  });

  return (
    <div>
      <BatchNavbar batchSlug={batchSlug || ""} batchName={data?.title} />
      <div className="mt-16 w-full max-w-[1400px] mx-auto px-4 py-6 space-y-6">
        {/* Basic batches info */}
        <div className="h-96 w-full rounded-2xl bg-blue-600 p-10 space-y-4 text-white">
          <h2 className="text-5xl font-bold">{data?.title}</h2>
          <p>
            <span className="font-semibold">Instructor: </span>
          </p>
          <p>
            <span className="font-semibold">Duration: </span>
            {new Date(data?.startTime || "").toLocaleDateString("vi-VN")} -{" "}
            {new Date(data?.endTime || "").toLocaleDateString("vi-VN")}
          </p>
        </div>
        {/* Discussion, Records and Info */}
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-1 flex flex-col items-start space-y-4 mt-2">
            {location.pathname.includes("teach") && (
              <button className="btn btn-neutral rounded-lg space-x-2">
                <Video size={20} />
                <span>New meeting</span>
              </button>
            )}
            {!location.pathname.includes("teach") && (
              <button className="btn btn-neutral rounded-lg space-x-2">
                <LogIn size={20} />
                <span>Join meeting</span>
              </button>
            )}
          </div>
          <div className="col-span-4 min-h-[480px]">
            <div className="tabs tabs-lg tabs-border">
              <input
                type="radio"
                name="batch_tab"
                className="tab"
                aria-label="Discussion"
                defaultChecked
              />
              <div className="tab-content py-6 pl-3">
                {!isLoading && data?.id ? (
                  <BatchDiscussion batchId={data.id} />
                ) : (
                  <div>Loading...</div>
                )}
              </div>

              <input
                type="radio"
                name="batch_tab"
                className="tab"
                aria-label="Records"
              />
              <div className="tab-content px-4 py-6">
                <BatchRecords />
              </div>

              <input
                type="radio"
                name="batch_tab"
                className="tab"
                aria-label="Everyone"
              />
              <div className="tab-content px-4 py-6">Tab content 3</div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
