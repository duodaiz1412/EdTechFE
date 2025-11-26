import {
  Hand,
  Info,
  MessageSquare,
  Mic,
  MicOff,
  PhoneOff,
  ScreenShare,
  ScreenShareOff,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {liveServices} from "@/lib/services/live.services";
import {RoomParticipant} from "@/types";
import {useAppSelector} from "@/redux/hooks";
import {toast} from "react-toastify";

export default function BatchLive() {
  const userData = useAppSelector((state) => state.user.data);

  const {roomId} = useParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(() => {
    return Number(localStorage.getItem("sessionId")) || null;
  });

  // const [isPin, setIsPin] = useState(false);
  const isPin = false;
  const [isCamOn, setIsCamOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenOn, setIsScreenOn] = useState(false);

  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [isShowParticipants, setIsShowParticipants] = useState(false);
  const [isShowChat, setIsShowChat] = useState(false);

  const {isLoading} = useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await liveServices.joinRoom(
        accessToken,
        Number(roomId),
        userData?.name || "Guest",
      );
      setSessionId(response.data.sessionId || null);
      return response;
    },
  });

  // Get room status
  useEffect(() => {
    const interval = setInterval(async () => {
      const accessToken = await getAccessToken();
      const response = await liveServices.getRoomStatus(
        accessToken,
        Number(roomId),
      );
      if (response.data.status === "ENDED") {
        navigate("/");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [roomId, navigate]);

  // Keep alive
  useEffect(() => {
    if (!sessionId) return;
    const interval = setInterval(() => {}, 30000);
    return () => clearInterval(interval);
  }, [sessionId]);

  // Fetch participants
  useEffect(() => {
    const fetchParticipants = async () => {
      const accessToken = await getAccessToken();
      const response = await liveServices.getParticipants(
        accessToken,
        Number(roomId),
      );
      setParticipants(response.participants);
    };

    fetchParticipants();
    const interval = setInterval(fetchParticipants, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  // Handlers
  const handleToggleCam = () => setIsCamOn((prev) => !prev);
  const handleToggleMic = () => setIsMicOn((prev) => !prev);
  const handleToggleScreen = () => setIsScreenOn((prev) => !prev);
  const handleShowParticipants = () => setIsShowParticipants((prev) => !prev);
  const handleShowChat = () => setIsShowChat((prev) => !prev);

  const handleEndLive = async () => {
    const accessToken = await getAccessToken();
    await liveServices.endRoom(accessToken, Number(roomId));
    toast.info("End live: " + roomId);
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white space-y-4">
        <div className="loading loading-spinner loading-lg"></div>
        <span className="text-lg font-medium">Joining room...</span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Main layout */}
      <div
        className="absolute top-0 left-0 right-0 bottom-24 z-10 p-6 grid gap-4"
        style={{
          gridTemplateColumns: `${
            isPin
              ? isShowChat || isShowParticipants
                ? "3fr 1fr 1fr"
                : "4fr 1fr"
              : isShowChat || isShowParticipants
                ? "4fr 1fr"
                : "1fr"
          }`,
        }}
      >
        {/* Share screen */}
        {isPin && (
          <div className="h-full bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-2xl flex items-center justify-center border border-gray-600">
            <span className="text-white text-xl font-semibold">
              Screen Share
            </span>
          </div>
        )}

        {/* Other participants */}
        <div
          className={`h-full overflow-y-auto bg-transparent grid gap-4 transition-all ${
            isPin
              ? "grid-cols-1"
              : participants.length === 1
                ? "grid-cols-1"
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          }`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#4B5563 transparent",
          }}
        >
          {participants.length > 0 ? (
            participants.map((person: RoomParticipant) => (
              <div
                key={person.id}
                className={`col-span-1 rounded-xl bg-gradient-to-br from-gray-700 to-gray-600 border border-gray-500 shadow-lg p-6 flex items-center justify-center hover:scale-105 transition-transform duration-200 ${
                  participants.length === 1 && !isPin ? "h-full" : "h-48"
                }`}
              >
                <span className="text-white font-semibold text-lg">
                  {person.display}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center text-gray-400 text-lg">
              No participants yet
            </div>
          )}
        </div>

        {/* Chat and participants */}
        {(isShowChat || isShowParticipants) && (
          <div className="h-full bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-2xl border border-gray-600 p-4">
            <h3 className="text-white font-semibold text-lg mb-4">
              {isShowParticipants ? "Participants" : "Chat"}
            </h3>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-24 z-10 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent backdrop-blur-sm">
        <div className="h-full flex justify-between items-center px-6">
          {/* Room Info */}
          <div className="flex items-center space-x-3 bg-gray-800/80 px-4 py-2 rounded-full border border-gray-600">
            <Info size={20} className="text-blue-400" />
            <span className="text-gray-300">Room:</span>
            <span className="font-bold text-white">{roomId}</span>
          </div>

          {/* Main Controls */}
          <div className="flex items-center space-x-3">
            <button
              className={`${
                isCamOn
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 hover:bg-gray-600"
              } text-white p-4 rounded-full transition-all shadow-lg hover:scale-110`}
              onClick={handleToggleCam}
              title="Camera"
            >
              {isCamOn ? <Video size={22} /> : <VideoOff size={22} />}
            </button>
            <button
              className={`${
                isMicOn
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 hover:bg-gray-600"
              } text-white p-4 rounded-full transition-all shadow-lg hover:scale-110`}
              onClick={handleToggleMic}
              title="Microphone"
            >
              {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
            </button>
            <button
              className={`${
                isScreenOn
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 hover:bg-gray-600"
              } text-white p-4 rounded-full transition-all shadow-lg hover:scale-110`}
              onClick={handleToggleScreen}
              title="Share screen"
            >
              {isScreenOn ? (
                <ScreenShare size={22} />
              ) : (
                <ScreenShareOff size={22} />
              )}
            </button>
            <button
              className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-full transition-all shadow-lg hover:scale-110"
              title="Raise hand"
            >
              <Hand size={22} />
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-full text-white font-semibold transition-all shadow-lg hover:scale-110 flex items-center space-x-2"
              title="End live"
              onClick={handleEndLive}
            >
              <PhoneOff strokeWidth={2.5} size={22} />
              <span>End</span>
            </button>
          </div>

          {/* Side Controls */}
          <div className="flex items-center space-x-3">
            <button
              className={`${
                isShowParticipants
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 hover:bg-gray-600"
              } text-white p-4 rounded-full transition-all shadow-lg hover:scale-110`}
              onClick={handleShowParticipants}
              title="Participants"
            >
              <Users size={22} />
            </button>
            <button
              className={`${
                isShowChat
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 hover:bg-gray-600"
              } text-white p-4 rounded-full transition-all shadow-lg hover:scale-110`}
              onClick={handleShowChat}
              title="Chat"
            >
              <MessageSquare size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
