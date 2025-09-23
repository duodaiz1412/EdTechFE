import {Clock, Users, Award} from "lucide-react";
import {ProfileCourse} from "@/types";

type Props = {
  courses: ProfileCourse[];
};

export default function CoursesTab({courses}: Props) {
  const getStatusClass = (status: ProfileCourse["status"]) => {
    switch (status) {
      case "In Progress":
        return "badge-primary";
      case "Completed":
        return "badge-secondary";
      case "Not Started":
        return "badge-outline";
      default:
        return "badge-outline";
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-base-content">My Courses</h2>

      <div className="grid gap-6">
        {courses.map((course) => (
          <div key={course.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title flex items-center justify-between">
                <span>{course.title}</span>
                <div className={`badge ${getStatusClass(course.status)}`}>
                  {course.status}
                </div>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-base-content/70">
                  {course.status === "Completed" && course.certificate && (
                    <>
                      <Award className="w-4 h-4" />
                      <span>Certificate earned</span>
                    </>
                  )}
                  {course.status === "In Progress" && course.hoursRemaining && (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>{course.hoursRemaining} hours remaining</span>
                    </>
                  )}
                  {course.status === "Not Started" && (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>{course.hoursRemaining} hours estimated</span>
                    </>
                  )}
                  {course.status === "Completed" && course.hoursCompleted && (
                    <>
                      <Clock className="w-4 h-4 ml-4" />
                      <span>Completed in {course.hoursCompleted} hours</span>
                    </>
                  )}
                  {course.students && (
                    <>
                      <Users className="w-4 h-4 ml-4" />
                      <span>{course.students.toLocaleString()} students</span>
                    </>
                  )}
                </div>
                <progress
                  className="progress progress-primary w-full"
                  value={course.progress}
                  max="100"
                ></progress>
                <p className="text-sm">
                  {course.progress}% Complete
                  {course.modules &&
                    ` - ${course.modules.completed} of ${course.modules.total} modules finished`}
                  {course.status === "Not Started" &&
                    course.modules &&
                    ` - ${course.modules.total} modules available`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
