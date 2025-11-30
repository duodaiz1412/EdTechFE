import {useEffect, useRef} from "react";
import {useQuery} from "@tanstack/react-query";

import {RoomPublisher} from "@/types";
import {useSubscribeFeed} from "@/hooks/useSubscribeFeed";
import {Pin} from "lucide-react";

interface BatchScreenProps {
  p: RoomPublisher;
  roomId: number;
  handlePin: (stream: MediaStream) => void;
}

export default function BatchScreen({p, roomId, handlePin}: BatchScreenProps) {
  const {subscribeFeed, remoteStream, isReceived} = useSubscribeFeed();
  const localStreamRef = useRef<HTMLVideoElement | null>(null);

  useQuery({
    queryKey: [`subscribe-feed-${p.id}`, roomId, p.id],
    queryFn: async () => {
      const response = await subscribeFeed(roomId, p.id!);
      return response;
    },
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (isReceived && localStreamRef.current && remoteStream.current) {
      localStreamRef.current.srcObject = remoteStream.current;
    }
  }, [isReceived, remoteStream]);

  const handlePinClick = () => {
    // if (!isReceived) return;
    handlePin(remoteStream.current!);
  };

  return (
    <div className="col-span-1 bg-gray-600 h-40 md:h-48 lg:h-52 xl:h-56 rounded-lg relative flex items-center justify-center">
      <video
        autoPlay
        playsInline
        ref={localStreamRef}
        className="w-full h-full rounded-lg object-cover"
      ></video>
      <button
        className="rounded-full absolute top-4 left-4 p-2 text-white hover:text-black hover:bg-slate-200 transition-all"
        onClick={handlePinClick}
      >
        <Pin size={20} />
      </button>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-center font-semibold text-white">
        {p.display}
      </div>
    </div>
  );
}
