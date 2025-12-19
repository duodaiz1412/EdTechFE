import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";

import {Batch} from "@/types";
import {useAppSelector} from "@/redux/hooks";
import {publicServices} from "@/lib/services/public.services";
import {isBatchEnrolled} from "@/lib/utils/isBatchEnrolled";
import BatchItem from "./BatchItem";
import notFoundImg from "@/assets/not_found.svg";

export default function BatchesByTag() {
  const {tag} = useParams();
  const [batches, setBatches] = useState<Batch[]>([]);
  const userData = useAppSelector((state) => state.user.data);

  useQuery({
    queryKey: ["batches-by-tag"],
    queryFn: async () => {
      const response = await publicServices.getBatches("", tag as string);
      setBatches(response.content);
      return response;
    },
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 py-6">
      <h2 className="text-2xl font-semibold">
        Explore batches with tag "{tag}"
      </h2>
      <div className="w-full grid grid-cols-3 gap-4">
        {batches.length > 0 &&
          batches?.map((batch: Batch) => {
            const isEnrolled = isBatchEnrolled(
              userData?.batchEnrollments || [],
              batch.slug,
            );

            return (
              <BatchItem key={batch.id} batch={batch} isEnrolled={isEnrolled} />
            );
          })}
        {batches.length === 0 && (
          <div className="col-span-3 flex justify-center">
            <img src={notFoundImg} alt="Not found" className="w-1/2" />
          </div>
        )}
      </div>
    </div>
  );
}
