import {useState} from "react";
import {useQuery} from "@tanstack/react-query";

import {BatchRecordInfo} from "@/types";
import {getFileUrlFromMinIO} from "@/lib/services/upload.services";
import {formatDate} from "@/lib/utils/formatDate";

interface BatchRecordItemProps {
  record: BatchRecordInfo;
}

export default function BatchRecordItem({record}: BatchRecordItemProps) {
  const [videoUrl, setVideoUrl] = useState<string>("");

  const {isLoading} = useQuery({
    queryKey: ["record-video-url", record.objectName],
    queryFn: async () => {
      const response = await getFileUrlFromMinIO(record.objectName!);
      setVideoUrl(response.uploadUrl);
      return response.uploadUrl;
    },
  });

  return (
    <div className="border border-slate-200 bg-white rounded-lg p-6 mb-4 space-y-4">
      <h3 className="font-semibold text-lg">
        Record at {formatDate(record.recordedAt)}
      </h3>
      <div className="p-4 rounded-lg bg-slate-200">
        <h4 className="font-semibold">Info</h4>
        <p>RoomID: {record.roomId}</p>
        <p>Instructor: {record.instructorName}</p>
      </div>
      <div className="w-full h-90 bg-black flex justify-center">
        {!isLoading && (
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-contain"
          ></video>
        )}
      </div>
    </div>
  );
}
