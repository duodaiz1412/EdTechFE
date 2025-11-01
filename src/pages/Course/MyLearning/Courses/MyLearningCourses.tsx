import {useQuery} from "@tanstack/react-query";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";

import {login} from "@/redux/slice/userSlice";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {enrollServices} from "@/lib/services/enroll.services";
import MyLearningCourseItem from "./MyLearningCourseItem";

export default function MyLearningCourses() {
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

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-6">
        {userData?.courseEnrollments &&
          userData.courseEnrollments.length > 0 &&
          userData?.courseEnrollments?.map((enroll) => (
            <MyLearningCourseItem key={enroll.id} enroll={enroll} />
          ))}
        {userData?.courseEnrollments &&
          userData.courseEnrollments.length === 0 && (
            <span className="col-span-4">
              You have not enrolled in any courses yet.
            </span>
          )}
      </div>
    </div>
  );
}
