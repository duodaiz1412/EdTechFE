import {useQuery} from "@tanstack/react-query";

import {RoomParticipant} from "@/types";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {liveServices} from "@/lib/services/live.services";
import Avatar from "@/components/Avatar";
import {Hand} from "lucide-react";

interface BatchParticipantListProps {
  roomId: number;
  raiseStudents?: string[];
}

export default function BatchParticipantList({
  roomId,
  raiseStudents,
}: BatchParticipantListProps) {
  const {data} = useQuery({
    queryKey: ["participants", roomId],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await liveServices.getParticipants(accessToken, roomId);
      return response.data.participants;
    },
    refetchInterval: 1000,
  });

  return (
    <div className="space-y-4">
      {data &&
        data?.map((p: RoomParticipant) => (
          <div key={p.id} className="space-x-3 flex items-center">
            <Avatar name={p.displayName} />
            <p className="font-medium text-white">
              <span>{p.displayName}</span>
            </p>
            {raiseStudents?.includes(p.displayName!) && (
              <Hand size={20} className="text-yellow-600" />
            )}
          </div>
        ))}
    </div>
  );
}
