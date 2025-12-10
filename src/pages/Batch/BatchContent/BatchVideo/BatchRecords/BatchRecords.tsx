import {useQuery} from "@tanstack/react-query";
import {useState} from "react";

import {BatchRecordInfo} from "@/types";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {liveServices} from "@/lib/services/live.services";
import BatchRecordItem from "./BatchRecordItem";

interface BatchRecordsProps {
  batchId?: string;
}

export default function BatchRecords({batchId}: BatchRecordsProps) {
  const [records, setRecords] = useState<BatchRecordInfo[]>([]);

  const {isLoading} = useQuery({
    queryKey: ["batch-records", batchId],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await liveServices.getListRecords(accessToken, batchId!);
      setRecords(response.data.recordings || []);
      return response;
    },
  });

  if (isLoading) {
    return (
      <div className="w-full flex flex-col justify-center items-center space-y-4">
        <div className="loading loading-xl"></div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {records.length === 0 && (
        <div className="p-6 border border-slate-200 bg-slate-50 rounded-lg text-center text-slate-400">
          No record found.
        </div>
      )}
      {records.length > 0 &&
        records.map((record) => (
          <BatchRecordItem key={record.sessionId} record={record} />
        ))}
    </div>
  );
}
