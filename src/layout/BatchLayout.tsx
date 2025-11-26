import {useLocation, useNavigate, useParams} from "react-router-dom";
import BatchNavbar from "./components/Batch/BatchNavbar";
import {publicServices} from "@/lib/services/public.services";
import {useQuery} from "@tanstack/react-query";
import {LogIn, Video} from "lucide-react";
import BatchDiscussion from "@/pages/Batch/BatchContent/BatchDiscussion";
import BatchRecords from "@/pages/Batch/BatchContent/BatchVideo/BatchRecords";
import Footer from "@/components/Footer";
import {useAppSelector} from "@/redux/hooks";
import {useEffect, useState} from "react";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {liveServices} from "@/lib/services/live.services";
import {toast} from "react-toastify";

export default function BatchLayout() {
  const {batchSlug} = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userData = useAppSelector((state) => state.user.data);

  const [isStartLive, setIsStartLive] = useState(false);

  const {data, isLoading} = useQuery({
    queryKey: ["batch", batchSlug],
    queryFn: async () => {
      const response = await publicServices.getBatchBySlug(batchSlug || "");
      return response;
    },
  });

  useEffect(() => {
    if (
      location.pathname.includes("teach") &&
      !userData?.roles.includes("COURSE_CREATOR")
    ) {
      navigate(`/batch/${batchSlug}/learn`);
    }
  }, [batchSlug, location.pathname, navigate, userData]);

  const handleStartLive = async () => {
    setIsStartLive(true);
    const accessToken = await getAccessToken();

    const response = await liveServices.startLive(
      accessToken,
      data?.id || "",
      data?.title || "",
      data?.description || "",
    );

    if (response.status === 201) {
      navigate(`/batch/${batchSlug}/live/${response.data.roomId}`);
    } else {
      toast.error("Failed to create new meeting");
    }
    setIsStartLive(false);
  };

  return (
    <div>
      <BatchNavbar batchSlug={batchSlug || ""} batchName={data?.title} />
      <div className="mt-16 w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Basic batches info */}
        <div className="relative h-96 w-full rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 shadow-xl overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between text-white">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold leading-tight tracking-tight">
                {data?.title}
              </h2>
              <div className="space-y-2 text-blue-50">
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-white">Instructor:</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-white">Duration:</span>
                  <span>
                    {new Date(data?.startTime || "").toLocaleDateString(
                      "vi-VN",
                    )}{" "}
                    -{" "}
                    {new Date(data?.endTime || "").toLocaleDateString("vi-VN")}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Discussion, Records and Info */}
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-1 flex flex-col items-start space-y-4 mt-2">
            {location.pathname.includes("teach") && (
              <button
                className="btn btn-neutral rounded-lg space-x-2"
                disabled={isStartLive}
                onClick={handleStartLive}
              >
                {isStartLive ? (
                  <div className="loading loading-spinner loading-sm text-slate-400"></div>
                ) : (
                  <Video size={20} />
                )}
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
