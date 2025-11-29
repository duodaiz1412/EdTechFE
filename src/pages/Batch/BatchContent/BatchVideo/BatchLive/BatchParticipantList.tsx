import {useMemo, useState} from "react";
import {RoomParticipant} from "@/types";

import Avatar from "@/components/Avatar";

interface BatchParticipantList {
  participants: RoomParticipant[];
}

export default function BatchParticipantList({
  participants,
}: BatchParticipantList) {
  const [search, setSearch] = useState("");

  const filteredParticipants = useMemo(() => {
    if (!search.trim()) return participants;

    return participants.filter((person) =>
      person.display?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [participants, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="space-y-4 ">
      <input
        className="input w-full rounded-lg bg-transparent border border-slate-600 text-white"
        placeholder="Search for participants..."
        value={search}
        onChange={handleSearch}
      />
      <div className="space-y-3 p-4 border border-slate-600 rounded-lg">
        {filteredParticipants.length > 0 &&
          filteredParticipants.map((person: RoomParticipant) => (
            <div key={person.id} className="flex items-center space-x-3">
              <Avatar name={person.display} />
              <p className="text-white">{person.display}</p>
            </div>
          ))}
        {filteredParticipants.length === 0 && (
          <p className="text-white/50 text-center">No participant found.</p>
        )}
      </div>
    </div>
  );
}
