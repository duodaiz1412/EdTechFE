import {toast} from "react-toastify";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {LogIn, Video} from "lucide-react";
import {motion} from "motion/react";

import {useAppSelector} from "@/redux/hooks";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {publicServices} from "@/lib/services/public.services";
import {liveServices} from "@/lib/services/live.services";
import {formatDate} from "@/lib/utils/formatDate";
import {checkIsInstructor} from "@/lib/utils/isBatchInstructor";
import {isBatchEnrolled} from "@/lib/utils/isBatchEnrolled";

import BatchNavbar from "./components/Batch/BatchNavbar";
import BatchDiscussion from "@/pages/Batch/BatchContent/BatchDiscussion";
import BatchRecords from "@/pages/Batch/BatchContent/BatchVideo/BatchRecords/BatchRecords";
import Footer from "@/components/Footer";

export default function BatchLayout() {
  const {batchSlug} = useParams();
  const navigate = useNavigate();
  const userData = useAppSelector((state) => state.user.data);

  const [isInstructor, setIsInstructor] = useState(false);

  const [isStartLive, setIsStartLive] = useState(false);
  const [isJoinRoom, setIsJoinRoom] = useState(false);
  const [roomId, setRoomId] = useState("");

  const {data, isLoading} = useQuery({
    queryKey: ["batch", batchSlug],
    queryFn: async () => {
      const response = await publicServices.getBatchBySlug(batchSlug || "");
      const checkInstructor = checkIsInstructor(
        userData?.id || "",
        response.instructors,
      );
      const checkEnrolled = isBatchEnrolled(
        userData?.batchEnrollments || [],
        batchSlug,
      );

      if (!checkInstructor && !checkEnrolled) {
        navigate(`/batch/${batchSlug}`);
        toast.error("You're not enrolled this batch");
      }

      setIsInstructor(checkInstructor);
      return response;
    },
  });

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
      window.open(`/batch/${batchSlug}/live/${response.data.roomId}`, "_blank");
    } else {
      toast.error("Failed to create new meeting");
    }
    setIsStartLive(false);
  };

  const handleJoinRoom = () => {
    setIsJoinRoom(false);
    navigate(`/batch/${batchSlug}/live/${roomId}`);
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
                  <span>
                    {data?.instructors?.map((inst) => inst.fullName).join(", ")}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-white">Duration:</span>
                  <span>
                    {formatDate(data?.startTime)} - {formatDate(data?.endTime)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Discussion, Records and Info */}
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-1 flex flex-col items-start space-y-4 mt-2">
            {isInstructor && (
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
            {!isInstructor && (
              <button
                className="btn btn-neutral rounded-lg space-x-2"
                onClick={() => setIsJoinRoom(true)}
              >
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
                {!isLoading && data?.id ? (
                  <BatchRecords batchId={data.id} />
                ) : (
                  <div>Loading...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Join Room Form */}
      {isJoinRoom && (
        <div className="fixed inset-0 z-10 bg-black/30 flex items-center justify-center">
          <motion.div
            initial={{opacity: 0, scale: 0}}
            animate={{opacity: 1, scale: 1}}
            transition={{
              duration: 0.3,
              scale: {type: "spring", visualDuration: 0.4, bounce: 0.5},
            }}
            className="w-full max-w-3xl bg-white rounded-lg p-6 space-y-6"
          >
            <h2 className="font-bold text-2xl">Enter Room ID</h2>
            <input
              className="input w-full rounded-lg"
              placeholder="Example: 123456"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <div className="w-full flex justify-end space-x-4">
              <button
                className="btn btn-neutral rounded-lg"
                onClick={handleJoinRoom}
              >
                Join room
              </button>
              <button
                className="btn rounded-lg"
                onClick={() => setIsJoinRoom(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
