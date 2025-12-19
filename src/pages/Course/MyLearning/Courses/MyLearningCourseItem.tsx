import {Link} from "react-router-dom";

import {CourseEnrollment} from "@/types";
import {useQuery} from "@tanstack/react-query";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {progressServices} from "@/lib/services/progress.services";

interface MyLearningItemProps {
  enroll: CourseEnrollment;
}

export default function MyLearningCourseItem({enroll}: MyLearningItemProps) {
  const {data} = useQuery({
    queryKey: ["enrollment-progress", enroll.id],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await progressServices.getProgress(
        enroll.courseSlug!,
        accessToken,
      );
      return response;
    },
  });

  return (
    <div className="card shadow">
      <figure className="h-56">
        <div className="w-full h-full bg-slate-200"></div>
      </figure>
      <div className="card-body space-y-2">
        <h3 className="card-title">{enroll.courseTitle}</h3>
        <progress
          className="progress progress-neutral w-full"
          value={enroll.progress}
          max="100"
        ></progress>
        <Link
          to={`/course/${enroll.courseSlug}/learn/lesson/${data?.currentLessonSlug}`}
          className="btn btn-neutral"
        >
          Continue Learning
        </Link>
      </div>
    </div>
  );
}
