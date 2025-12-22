import {
  Hand,
  Info,
  MessageSquare,
  Mic,
  MicOff,
  PauseCircle,
  PhoneOff,
  PinOff,
  PlayCircle,
  ScreenShare,
  ScreenShareOff,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {toast} from "react-toastify";
import {motion} from "motion/react";

import {ChatMessage, ChatMessageType, RoomPublisher} from "@/types";
import {useAppSelector} from "@/redux/hooks";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {publicServices} from "@/lib/services/public.services";
import {liveServices} from "@/lib/services/live.services";
import {checkIsInstructor} from "@/lib/utils/isBatchInstructor";
import {usePublishMedia} from "@/hooks/usePublishMedia";
import {usePublishScreen} from "@/hooks/usePublishScreen";
import {useRecording} from "@/hooks/useRecording";
import {useChatSocket} from "@/hooks/useChatSocket";

import BatchLiveError from "./BatchLiveError";
import BatchLiveButton from "./BatchLiveButton";
import BatchScreen from "./BatchScreen";
import BatchParticipantList from "./BatchParticipantList";

export default function BatchLive() {
  const userData = useAppSelector((state) => state.user.data);
  const navigate = useNavigate();
  const [isInstructor, setIsInstructor] = useState(false);
  const liveSessionIdRef = useRef<string>();

  // Room and navigation state
  const {roomId, batchSlug} = useParams();
  const [isJoin, setIsJoin] = useState(false);
  const [sessionId, setSessionId] = useState<number>();

  // Pin screen
  const [isPin, setIsPin] = useState(false);
  const [pinStream, setPinStream] = useState<MediaStream | null>(null);
  const pinVideoRef = useRef<HTMLVideoElement | null>(null);

  // Camera, mic
  const {
    publishMedia,
    isCamOn,
    isMicOn,
    isMediaPublished,
    localMediaStream,
    toggleCam,
    toggleMic,
    unpublishMedia,
  } = usePublishMedia();
  const localMediaRef = useRef<HTMLVideoElement | null>(null);

  // Share screen
  const {publishScreen, isScreenPublished, localScreenStream, unpublishScreen} =
    usePublishScreen();
  const localScreenRef = useRef<HTMLVideoElement | null>(null);

  // Recording
  const {isRecording, startRecording, stopRecording} = useRecording();

  // Participants
  const [isShowParticipants, setIsShowParticipants] = useState(false);
  const [publishers, setPublishers] = useState<RoomPublisher[]>([]);

  // Chat and raise hand
  const {
    connect,
    disconnect,
    subscribeToSession,
    unsubscribeFromSession,
    addUser,
    sendMessage,
    raiseHand,
    lowerHand,
  } = useChatSocket();
  const [isShowChat, setIsShowChat] = useState(false);
  const [isRaiseHand, setIsRaiseHand] = useState(false);
  const [raiseStudents, setRaiseStudents] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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
      liveSessionIdRef.current = response.data.liveSessionId;

      return response;
    },
  });

  // Handle chat message and raise hand
  const handleSendMessage = () => {
    sendMessage(
      liveSessionIdRef.current!,
      userData?.name || "Anonymous",
      newMessage,
    );
    setNewMessage("");
  };
  const handleReceiveMessage = useCallback((msg: ChatMessage) => {
    if (msg.type === ChatMessageType.CHAT) {
      setMessages((prev) => [...prev, msg]);
    } else if (msg.type === ChatMessageType.RAISE_HAND) {
      setRaiseStudents((prev) => [...prev, msg.sender!]);
      toast.info(msg.content);
    } else if (msg.type === ChatMessageType.LOWER_HAND) {
      setRaiseStudents((prev) => prev.filter((name) => name !== msg.sender));
      toast.info(msg.content);
    } else {
      toast.info(msg.content);
    }
  }, []);
  const handleRaiseHand = () => {
    const studentName = userData?.name || "Anonymous";

    if (isRaiseHand) {
      setIsRaiseHand(false);
      lowerHand(liveSessionIdRef.current!, studentName);
    } else {
      setIsRaiseHand(true);
      raiseHand(liveSessionIdRef.current!, studentName);
    }
  };

  // Connect to chat after join room
  useEffect(() => {
    if (!isJoin) return;

    const fetchData = async () => {
      const response = await publicServices.getBatchBySlug(batchSlug || "");
      setIsInstructor(
        checkIsInstructor(userData?.id || "", response.instructors),
      );
      // Connect to chat socket
      const accessToken = await getAccessToken();
      connect(
        accessToken,
        () => {
          subscribeToSession(liveSessionIdRef.current!, handleReceiveMessage);
          addUser(liveSessionIdRef.current!, userData?.name || "Anonymous");
        },
        () => {},
      );
    };

    fetchData();

    return () => {
      unsubscribeFromSession(liveSessionIdRef.current!);
      disconnect();
    };
  }, [
    isJoin,
    batchSlug,
    userData,
    addUser,
    connect,
    disconnect,
    subscribeToSession,
    unsubscribeFromSession,
    handleReceiveMessage,
  ]);

  // Publish media when joined
  useQuery({
    queryKey: ["publish-media", isJoin, roomId],
    queryFn: async () => {
      if (!isJoin) return null;

      const response = await publishMedia(
        Number(roomId),
        sessionId!,
        setSessionId,
      );
      return response;
    },
  });
  useEffect(() => {
    if (isMediaPublished && localMediaRef.current && localMediaStream.current) {
      localMediaRef.current.srcObject = localMediaStream.current;
    }
  }, [isMediaPublished, localMediaStream]);

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
    refetchInterval: 30000,
  });

  // Fetch publishers
  useQuery({
    queryKey: ["publishers", roomId],
    queryFn: async () => {
      if (!isJoin) return null;

      const accessToken = await getAccessToken();
      const response = await liveServices.getPublishers(
        accessToken,
        Number(roomId),
      );

      const publishers = response.data.participants?.filter(
        (p: RoomPublisher) => p.publisher,
      );
      setPublishers(publishers || []);
      return response;
    },
    refetchInterval: 3000,
  });

  // Handlers pin stream
  const handlePin = (stream: MediaStream) => {
    setIsPin(true);
    setPinStream(stream);
  };
  const handleUnpin = () => {
    setIsPin(false);
    setPinStream(null);
  };
  useEffect(() => {
    if (isPin && pinStream && pinVideoRef.current) {
      pinVideoRef.current.srcObject = pinStream;
    }
  }, [isPin, pinStream]);

  // Handlers cam, mic and screen
  const handleToggleCam = () => {
    toggleCam();
  };
  const handleToggleMic = () => {
    toggleMic();
  };
  const handleToggleScreen = () => {
    if (isScreenPublished) {
      unpublishScreen(Number(roomId));
    } else {
      publishScreen(Number(roomId), sessionId!, setSessionId);
    }
  };
  useEffect(() => {
    if (
      isScreenPublished &&
      localScreenRef.current &&
      localScreenStream.current
    ) {
      localScreenRef.current.srcObject = localScreenStream.current;
    }
  }, [isScreenPublished, localScreenStream]);

  // Handle record
  const handleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording(Number(roomId));
    }
  };

  // Handle show participants and chat
  const handleShowParticipants = () => {
    setIsShowParticipants((prev) => !prev);
    if (isShowChat) setIsShowChat(false);
  };
  const handleShowChat = () => {
    setIsShowChat((prev) => !prev);
    if (isShowParticipants) setIsShowParticipants(false);
  };

  // Handler leave room
  const handleLeaveRoom = async () => {
    if (!isJoin) return;

    const confirm = window.confirm("Leave room now?");
    if (!confirm) return;

    // 1. Unpublish all local feeds
    await unpublishMedia(Number(roomId));
    if (isScreenPublished) {
      await unpublishScreen(Number(roomId));
    }

    // 2. Leave room or end room
    const accessToken = await getAccessToken();
    if (isInstructor) {
      if (isRecording) {
        await stopRecording();
      }
      await liveServices.endRoom(accessToken, Number(roomId));
    } else {
      await liveServices.leaveRoom(accessToken, Number(roomId));
    }

    // 3. Navigate back to batch discussion
    navigate(`/batch/${batchSlug}/detail`);
  };

  // Render loading, error state
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
        className="absolute top-0 left-0 right-0 bottom-24 overflow-y-scroll z-10 p-6 grid gap-4 items-start"
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
          scrollbarWidth: "thin",
          scrollbarColor: "#4B5563 transparent",
        }}
      >
        {/* Pin screen */}
        <div
          className={`${!isPin && "hidden"} relative h-[calc(100vh-200px)] bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-2xl flex items-center justify-center border border-gray-600`}
        >
          {isPin && (
            <button
              onClick={handleUnpin}
              className="absolute top-4 left-4 rounded-full p-2 text-white hover:bg-slate-200 hover:text-black transition-all z-10"
            >
              <PinOff size={24} />
            </button>
          )}
          <video
            autoPlay
            playsInline
            ref={pinVideoRef}
            className="w-full h-full rounded-xl object-cover"
          ></video>
        </div>

        {/* All screens */}
        <div
          className={`bg-transparent grid gap-4 transition-all 
            ${isPin ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}
          `}
        >
          {/* Local camera screen */}
          <div className="col-span-1 bg-blue-600 rounded-lg h-40 md:h-48 lg:h-52 xl:h-56 relative">
            <video
              ref={localMediaRef}
              autoPlay
              playsInline
              muted
              className={`${isCamOn ? "w-full h-full" : "w-0 h-0"} rounded-lg object-cover`}
            ></video>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center font-semibold text-white">
              {userData?.name || ""} (You)
            </div>
          </div>
          {/* Local share screen */}
          <div
            className={`${isScreenPublished ? "col-span-1 h-40 md:h-48 lg:h-52 xl:h-56" : "hidden h-0"} bg-blue-600 rounded-lg relative`}
          >
            <video
              ref={localScreenRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full rounded-lg object-cover"
            ></video>
            {isScreenPublished && (
              <div className="absolute bottom-0 left-0 right-0 p-6 text-center font-semibold text-white">
                {userData?.name || ""} (You)
              </div>
            )}
          </div>
          {/* Other publishers screen */}
          {publishers.length > 0 &&
            publishers.map((p: RoomPublisher) => (
              <BatchScreen
                key={p.id}
                p={p}
                roomId={Number(roomId)}
                handlePin={handlePin}
              />
            ))}
        </div>

        {/* Chat and participants */}
        {(isShowChat || isShowParticipants) && (
          <div className="h-full bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-2xl border border-gray-600 p-6 relative">
            <h3 className="text-white font-semibold text-lg mb-4">
              {isShowParticipants ? "Participants" : "Chat"}
            </h3>
            {isShowParticipants ? (
              <BatchParticipantList
                roomId={Number(roomId)}
                raiseStudents={raiseStudents}
              />
            ) : (
              <>
                <div
                  className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-2"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#4B5563 transparent",
                  }}
                >
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className="bg-slate-300 rounded-lg px-4 py-2 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <p className="font-semibold text-sm mb-2 space-x-2">
                        <span>{msg.sender}</span>
                        {msg.sender === userData?.name && (
                          <div className="badge badge-xs badge-info">You</div>
                        )}
                      </p>
                      <p className="text-base leading-relaxed break-words">
                        {msg.content}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex space-x-2">
                  <input
                    className="input rounded-lg bg-slate-200"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    className="btn btn-neutral rounded-lg"
                    onClick={handleSendMessage}
                  >
                    Send
                  </button>
                </div>
              </>
            )}
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
            {isRecording && (
              <motion.div
                initial={{opacity: 0, scale: 0}}
                animate={{opacity: 1, scale: 1}}
                transition={{
                  duration: 0.3,
                  scale: {type: "spring", visualDuration: 0.4, bounce: 0.5},
                }}
                className="rounded-full px-4 py-3 border-2 border-red-600 text-white font-semibold"
              >
                Recording
              </motion.div>
            )}
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
              state={isScreenPublished}
              title="Share screen"
              onClick={handleToggleScreen}
              switchIcon={[
                <ScreenShare size={22} />,
                <ScreenShareOff size={22} />,
              ]}
            />
            {isInstructor && (
              <BatchLiveButton
                isSwitch={true}
                state={isRecording}
                title="Record"
                onClick={handleRecord}
                switchIcon={[
                  <PauseCircle size={22} />,
                  <PlayCircle size={22} />,
                ]}
              />
            )}
            {!isInstructor && (
              <BatchLiveButton
                isSwitch={true}
                state={isRaiseHand}
                title="Raise hand"
                onClick={handleRaiseHand}
                switchIcon={[<Hand size={22} />, <Hand size={22} />]}
              />
            )}
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
