import {useAppSelector} from "@/redux/hooks";
import {Link} from "react-router-dom";

export default function MyLearning() {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const userData = useAppSelector((state) => state.user.data);

  if (!isAuthenticated) {
    return (
      <h2 className="text-center text-2xl font-bold mt-10">
        Login or register to track your progress
      </h2>
    );
  }

  return (
    <div className="w-full lg:w-5/6 mx-auto my">
      <h2 className="text-2xl font-semibold mb-10">My Learning</h2>
      <div className="grid grid-cols-3 gap-6">
        {userData?.enrollments?.map((enroll) => (
          <div key={enroll.id} className="card shadow">
            <figure className="h-56">
              <div className="w-full h-full bg-slate-200"></div>
            </figure>
            <div className="card-body space-y-2">
              <h3 className="card-title">{enroll.courseTitle}</h3>
              <progress
                className="progress progress-primary w-full"
                value={enroll.progress}
                max="100"
              ></progress>
              <Link
                to={`/course/${enroll.courseId}/learn/lesson/${enroll.currentLessonId}`}
                className="btn btn-neutral"
              >
                {enroll.currentLessonId
                  ? "Continue learning"
                  : "Start learning"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
