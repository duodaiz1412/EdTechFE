import {useState} from "react";
import {useQuery} from "@tanstack/react-query";

import {Batch} from "@/types";
// import {useAppSelector} from "@/redux/hooks";
import {publicServices} from "@/lib/services/public.services";
import BatchItem from "./BatchItem";
import {useParams} from "react-router-dom";

export default function BatchesByTag() {
  const {tag} = useParams();
  const [batches, setBatches] = useState<Batch[]>();
  //   const userData = useAppSelector((state) => state.user.data);

  useQuery({
    queryKey: ["batches-by-tag"],
    queryFn: async () => {
      const response = await publicServices.getBatches("", tag as string);
      setBatches(response.content);
      return response;
    },
  });

  return (
    <div className="w-full space-y-10 py-6">
      <h2 className="text-2xl font-semibold">
        Explore batches with tag "{tag}"
      </h2>
      <div className="w-full grid grid-cols-4 gap-4">
        {batches?.map((batch: Batch) => {
          return <BatchItem key={batch.id} batch={batch} />;
        })}
      </div>
    </div>
  );
}
