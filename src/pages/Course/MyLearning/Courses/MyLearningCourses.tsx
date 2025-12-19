import {useQuery} from "@tanstack/react-query";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";

import {login} from "@/redux/slice/userSlice";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {enrollServices} from "@/lib/services/enroll.services";
import MyLearningCourseItem from "./MyLearningCourseItem";

export default function MyLearningCourses() {
  const userData = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();

  const {data} = useQuery({
    queryKey: ["course-enrollments"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await enrollServices.getCourseEnrollments(accessToken);
      dispatch(login({...userData, enrollments: response}));
      return response;
    },
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-6">
        {data &&
          data.length > 0 &&
          data.map((enroll) => (
            <MyLearningCourseItem key={enroll.id} enroll={enroll} />
          ))}
        {data && data.length === 0 && (
          <span className="col-span-4">
            You have not enrolled in any courses yet.
          </span>
        )}
      </div>
    </div>
  );
}
