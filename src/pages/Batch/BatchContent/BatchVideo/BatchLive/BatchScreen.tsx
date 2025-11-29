import {RoomParticipant} from "@/types";

interface BatchScreenProps {
  p: RoomParticipant;
}

export default function BatchScreen({p}: BatchScreenProps) {
  return (
    <div className="col-span-1 bg-gray-600 h-40 md:h-48 lg:h-52 xl:h-56 relative rounded-lg flex items-center justify-center">
      {p.display}
    </div>
  );
}
