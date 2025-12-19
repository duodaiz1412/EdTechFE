import {useQuery} from "@tanstack/react-query";

import {login} from "@/redux/slice/userSlice";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {enrollServices} from "@/lib/services/enroll.services";
import {Link} from "react-router-dom";

export default function MyLearningBatches() {
  const userData = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();

  const {data} = useQuery({
    queryKey: ["batch-enrollments"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await enrollServices.getBatchEnrollments(accessToken);
      dispatch(login({...userData, batchEnrollments: response}));
      return response;
    },
  });

  return (
    <div className="w-full grid grid-cols-3 gap-6">
      {data &&
        data.length > 0 &&
        data.map((enroll) => (
          <div className="card shadow">
            <figure className="h-56">
              <div className="w-full h-full bg-slate-200"></div>
            </figure>
            <div className="card-body space-y-2">
              <h3 className="card-title">{enroll.title}</h3>
              <Link
                to={`/batch/${enroll.slug}/detail`}
                className="btn btn-neutral"
              >
                Go to discussion
              </Link>
            </div>
          </div>
        ))}
      {data && data.length === 0 && (
        <span className="col-span-4">
          You have not enrolled in any batches yet.
        </span>
      )}
    </div>
  );
}
