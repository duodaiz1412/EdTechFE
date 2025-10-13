import {useAppSelector} from "@/redux/hooks";

import MyLearningItem from "./MyLearningItem";

export default function MyLearning() {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const userData = useAppSelector((state) => state.user.data);

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
        {userData?.enrollments?.map((enroll) => (
          <MyLearningItem key={enroll.id} enroll={enroll} />
        ))}
      </div>
    </div>
  );
}
