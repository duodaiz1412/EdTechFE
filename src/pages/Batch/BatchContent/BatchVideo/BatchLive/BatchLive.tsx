import {
  Hand,
  Info,
  MessageSquare,
  Mic,
  MicOff,
  PhoneOff,
  Pin,
  ScreenShare,
  ScreenShareOff,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {toast} from "react-toastify";

import {useAppSelector} from "@/redux/hooks";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {liveServices} from "@/lib/services/live.services";

import BatchLiveError from "./BatchLiveError";
import BatchLiveButton from "./BatchLiveButton";

export default function BatchLive() {
  const userData = useAppSelector((state) => state.user.data);
  const navigate = useNavigate();

  // Room and navigation state
  const {roomId, batchSlug} = useParams();
  const [isJoin, setIsJoin] = useState(false);
  const [sessionId, setSessionId] = useState<number>();

  const [isPin, setIsPin] = useState(false);
  // Camera, mic, screen share
  const [isCamOn, setIsCamOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenOn, setIsScreenOn] = useState(false);

  // Participants and chat
  const [isShowParticipants, setIsShowParticipants] = useState(false);
  const [isShowChat, setIsShowChat] = useState(false);

  // Join room
  const {isLoading, isError} = useQuery({
    queryKey: ["join-room", roomId],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await liveServices.joinRoom(
        accessToken,
        Number(roomId),
        userData?.name || "Anonymous",
      );

      // Session state
      setIsJoin(true);
      setSessionId(response.data.sessionId);

      return response;
    },
  });

  // Keep alive and auto leave room
  useQuery({
    queryKey: ["keep-alive", sessionId],
    queryFn: async () => {
      if (!isJoin || !sessionId) return null;

      const accessToken = await getAccessToken();
      const response = await liveServices.keepAlive(accessToken, sessionId!);
      if (response.data.janus === "error") {
        toast.info("Room ended by host");
        navigate(`/batch/${batchSlug}/teach`);
      }
      return response;
    },
    refetchInterval: 5000,
  });

  // Handlers
  const handlePinScreen = () => {
    setIsPin((prev) => !prev);
  };
  const handleToggleCam = () => {
    setIsCamOn((prev) => !prev);
  };
  const handleToggleMic = () => {
    setIsMicOn((prev) => !prev);
  };
  const handleToggleScreen = () => {
    setIsScreenOn((prev) => !prev);
  };
  const handleShowParticipants = () => setIsShowParticipants((prev) => !prev);
  const handleShowChat = () => setIsShowChat((prev) => !prev);

  const handleLeaveRoom = async () => {
    const accessToken = await getAccessToken();
    if (userData?.roles.includes("COURSE_CREATOR")) {
      await liveServices.endRoom(accessToken, Number(roomId));
    } else {
      await liveServices.leaveRoom(accessToken, Number(roomId));
    }
    navigate(`/batch/${batchSlug}/teach`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white space-y-4">
        <div className="loading loading-spinner loading-lg"></div>
        <span className="text-lg font-medium">Joining room...</span>
      </div>
    );
  }

  if (isError) {
    return <BatchLiveError batchSlug={batchSlug} />;
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
          className={`h-full overflow-y-auto bg-transparent grid gap-4 transition-all 
            ${isPin ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}
          `}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#4B5563 transparent",
          }}
        >
          <div className="col-span-1 rounded-xl bg-gradient-to-br from-gray-700 to-gray-600 border border-gray-500 shadow-lg flex items-center justify-center h-56 relative"></div>
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
            <BatchLiveButton
              isSwitch={true}
              state={isPin}
              title="Pin screen"
              onClick={handlePinScreen}
              switchIcon={[<Pin size={22} />, <Pin size={22} />]}
            />
            <BatchLiveButton
              isSwitch={true}
              state={isCamOn}
              title="Camera"
              onClick={handleToggleCam}
              switchIcon={[<Video size={22} />, <VideoOff size={22} />]}
            />
            <BatchLiveButton
              isSwitch={true}
              state={isMicOn}
              title="Microphone"
              onClick={handleToggleMic}
              switchIcon={[<Mic size={22} />, <MicOff size={22} />]}
            />
            <BatchLiveButton
              isSwitch={true}
              state={isScreenOn}
              title="Share screen"
              onClick={handleToggleScreen}
              switchIcon={[
                <ScreenShare size={22} />,
                <ScreenShareOff size={22} />,
              ]}
            />
            <BatchLiveButton
              isSwitch={false}
              title="Raise hand"
              icon={<Hand size={22} />}
            />
            <button
              className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-full text-white font-semibold transition-all shadow-lg hover:scale-110 flex items-center space-x-2"
              title="Leave"
              onClick={handleLeaveRoom}
            >
              <PhoneOff strokeWidth={2.5} size={22} />
              <span>Leave</span>
            </button>
          </div>

          {/* Side Controls */}
          <div className="flex items-center space-x-3">
            <BatchLiveButton
              isSwitch={true}
              state={isShowParticipants}
              title="Participants"
              onClick={handleShowParticipants}
              switchIcon={[<Users size={22} />, <Users size={22} />]}
            />
            <BatchLiveButton
              isSwitch={true}
              state={isShowChat}
              title="Chat"
              onClick={handleShowChat}
              switchIcon={[
                <MessageSquare size={22} />,
                <MessageSquare size={22} />,
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
