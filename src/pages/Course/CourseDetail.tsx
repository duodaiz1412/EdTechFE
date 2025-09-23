import {Link, useParams} from "react-router-dom";
import {courses} from "@/mockData/courses";
import ReadOnlyRating from "@/components/ReadOnlyRating";
import {Languages} from "lucide-react";
import CourseContentList from "./CourseContent/CourseContentList";

export default function CourseDetail() {
  const {courseId} = useParams();
  const course = courses.find((c) => c.id === courseId);

  return (
    <div className="w-full max-w-[1380px] mx-auto">
      <div className="flex items-start space-x-4 pt-6">
        <div className="w-2/3 space-y-10">
          <h2 className="text-3xl font-bold">{course?.title}</h2>
          <div className="space-y-3 text-sm">
            <p className="text-xl">{course?.shortIntroduction}</p>
            <div className="flex space-x-2 items-start">
              <span className="font-semibold text-orange-900">
                {course?.rating}
              </span>
              <ReadOnlyRating rating={course?.rating || 0} size="xs" />
              <span>({course?.enrolledStudents})</span>
            </div>
            <div>
              Created by
              {course?.instructors.map((instructor) => (
                <Link
                  to={`/user/${instructor}`}
                  key={instructor}
                  className="link ml-2"
                >
                  {instructor}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex space-x-2">
                <Languages size={20} />: <span>{course?.languages}</span>
              </div>
              <div className="flex space-x-2">
                {course?.categories.map((category) => (
                  <span key={category} className="badge badge-primary">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="card border border-slate-200">
            <div className="card-body">
              <div className="card-title mb-4">What you'll learn</div>
              <div className="grid grid-cols-2 gap-4">
                {course?.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Explore related topics
            </h3>
            {course?.topics.map((topic) => (
              <Link to="/" key={topic} className="btn mr-4">
                {topic}
              </Link>
            ))}
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Course contents</h3>
            <CourseContentList curriculum={course?.curriculum} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <p>{course?.description}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Requirements</h3>
            <ul className="list-disc list-inside space-y-2">
              {course?.requirements.map((req) => <li key={req}>{req}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Target audience</h3>
            <ul className="list-disc list-inside space-y-2">
              {course?.whoIsThisCourseFor.map((learner) => (
                <li key={learner}>{learner}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-1/3 card shadow rounded-lg">
          <figure>
            <img src={course?.thumbnail} />
          </figure>
          <div className="card-body space-y-2">
            {!course?.enroll && (
              <>
                <div className="card-title space-x-1">
                  <span>{course?.currency}</span>
                  <span>{course?.price}</span>
                </div>
                <Link
                  to={`/course/${courseId}/enroll`}
                  className="btn btn-neutral"
                >
                  Enroll this course
                </Link>
              </>
            )}
            {course?.enroll && (
              <>
                <div className="card-title">You purchased this course</div>
                <Link
                  to={`/course/${courseId}/learn/lesson`}
                  className="btn btn-neutral"
                >
                  Continue learning
                </Link>
              </>
            )}
            <h3 className="font-semibold">This course includes:</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
