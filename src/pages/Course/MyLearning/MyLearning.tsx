import {useQuery} from "@tanstack/react-query";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";

import {login} from "@/redux/slice/userSlice";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {enrollServices} from "@/lib/services/enroll.services";
import MyLearningItem from "./MyLearningItem";

export default function MyLearning() {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const userData = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();

  useQuery({
    queryKey: ["enrollments"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await enrollServices.getEnrollments(accessToken);
      dispatch(login({...userData, enrollments: response}));
      return response;
    },
  });

  if (!isAuthenticated) {
    return (
      <h2 className="text-center text-2xl font-bold mt-10">
        Login to track your progress
      </h2>
    );
  }

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-semibold mb-10">My Learning</h2>
      <div className="grid grid-cols-4 gap-6">
        {userData?.enrollments &&
          userData?.enrollments?.map((enroll) => (
            <MyLearningItem key={enroll.id} enroll={enroll} />
          ))}
      </div>
    </div>
  );
}
