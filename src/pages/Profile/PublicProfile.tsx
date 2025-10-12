import {publicServices} from "@/lib/services/public.services";
import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";

export default function PublicProfile() {
  const {userId} = useParams();

  const {data} = useQuery({
    queryKey: ["public-profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const profile = await publicServices.getPublicProfile(userId);
      return profile;
    },
  });

  return (
    <div className="w-2/3 mx-auto flex">
      <div className="w-2/3">
        <h2 className="text-2xl font-semibold mb-10">{data?.fullName}</h2>
        <p>
          <span className="font-semibold">Username:</span>{" "}
          <span>{data?.username}</span>
        </p>
        <p>
          <span className="font-semibold">Email:</span>{" "}
          <a href={`mailto:${data?.email}`} className="link link-hover">
            {data?.email}
          </a>
        </p>
      </div>
      <div className="w-1/3">
        <div className="card border border-slate-200">
          <div className="card-body">
            <div className="rounded-full h-48 w-48 overflow-hidden mx-auto mb-10">
              {data?.userImage && <img src={data?.userImage} />}
              {!data?.userImage && (
                <div className="bg-slate-200 w-full h-full"></div>
              )}
            </div>
            <button className="btn btn-lg btn-neutral">Send message</button>
          </div>
        </div>
      </div>
    </div>
  );
}
