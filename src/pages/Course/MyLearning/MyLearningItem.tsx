import {Link} from "react-router-dom";

import {CourseEnrollment} from "@/types";

interface MyLearningItemProps {
  enroll: CourseEnrollment;
}

export default function MyLearningItem({enroll}: MyLearningItemProps) {
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
          to={`/course/${enroll.courseSlug}/learn/lesson/${enroll.currentLessonSlug}`}
          className="btn btn-neutral"
        >
          Continue Learning
        </Link>
      </div>
    </div>
  );
}
