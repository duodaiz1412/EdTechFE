import Avatar from "@/components/Avatar";
import {RoomParticipant} from "@/types";

interface BatchParticipantList {
  participants: RoomParticipant[];
}

export default function BatchParticipantList({
  participants,
}: BatchParticipantList) {
  return (
    <div className="space-y-3">
      {participants.length > 0 &&
        participants.map((person: RoomParticipant) => (
          <div
            key={person.id}
            className="flex items-center space-x-3 p-2 rounded-2xl border border-slate-500"
          >
            <Avatar name={person.display} />
            <p className="text-white">{person.display}</p>
          </div>
        ))}
    </div>
  );
}
