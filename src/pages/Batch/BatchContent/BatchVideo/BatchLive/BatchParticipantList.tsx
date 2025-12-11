import {useQuery} from "@tanstack/react-query";

import {RoomParticipant} from "@/types";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {liveServices} from "@/lib/services/live.services";
import Avatar from "@/components/Avatar";

interface BatchParticipantListProps {
  roomId: number;
}

export default function BatchParticipantList({
  roomId,
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
      <div className="space-y-3 p-4 border border-slate-600 rounded-lg">
        {data &&
          data?.map((p: RoomParticipant) => (
            <div key={p.id} className="space-x-3 flex items-center">
              <Avatar name={p.displayName} />
              <span className="font-medium text-white">{p.displayName}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
