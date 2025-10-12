import {Link, useNavigate, useParams} from "react-router-dom";
import ReadOnlyRating from "@/components/ReadOnlyRating";
import {Languages} from "lucide-react";
import CourseContentList from "./CourseContent/CourseContentList";
import {publicServices} from "@/lib/services/public.services";
import {Chapter, Course, CourseLabel, CourseTag, Review} from "@/types";
import {useEffect, useState} from "react";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {enrollServices} from "@/lib/services/enroll.services";
import {formatPrice} from "@/lib/utils/formatPrice";
import {toast} from "react-toastify";
import {useAppSelector} from "@/redux/hooks";
import {progressServices} from "@/lib/services/progress.services";
import {isCourseEnrolled} from "@/lib/utils/isCourseEnrolled";
import {useQuery} from "@tanstack/react-query";

export default function CourseDetail() {
  const {slug} = useParams();
  const [courseInfo, setCourseInfo] = useState<Course>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [currentLessonSlug, setCurrentLessonSlug] = useState("");

  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const userData = useAppSelector((state) => state.user.data);
  const navigate = useNavigate();

  useQuery({
    queryKey: ["course-info", slug],
    queryFn: async () => {
      if (!slug) return null;
      const course = await publicServices.getCourseBySlug(slug);
      setCourseInfo(course);
      return course;
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      // Get chapters and lessons
      const chapters = await publicServices.getChapters(slug);
      setChapters(chapters);

      // Get reviews
      const reviews = await publicServices.getReviews(slug);
      setReviews(reviews);

      // Check if user is enrolled this course
      const enrolled = isCourseEnrolled(userData?.enrollments || [], slug);
      setIsEnrolled(enrolled);

      // Get progress
      if (enrolled) {
        const accessToken = await getAccessToken();
        const progress = await progressServices.getProgress(slug, accessToken);

        setCurrentLessonSlug(
          progress.currentLessonSlug || chapters?.[0]?.lessons?.[0]?.slug || "",
        );
      }
    };

    fetchData();
  }, [slug, userData]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.info("Login required");
      navigate("/login");
    }

    const accessToken = await getAccessToken();
    const courseId = courseInfo?.id;

    const response = await enrollServices.enrollCourse(
      courseId as string,
      accessToken,
    );
    if (response.status === 201) {
      setIsEnrolled(true);
      toast.success("Enroll course successfully");
    }
  };

  return (
    <div className="w-full max-w-[1380px] mx-auto">
      <div className="flex items-start space-x-12 pt-6">
        {/* Course info */}
        <div className="w-2/3 space-y-10">
          <h2 className="text-3xl font-bold">{courseInfo?.title}</h2>
          {/* General info */}
          <div className="space-y-3 text-sm">
            <p className="text-xl">{courseInfo?.shortIntroduction}</p>
            <div className="flex space-x-2 items-start">
              <span className="font-semibold text-orange-900">
                {courseInfo?.rating || 0}
              </span>
              <ReadOnlyRating rating={courseInfo?.rating || 0} size="xs" />
              <span>({courseInfo?.enrollments || 0} students)</span>
            </div>
            <div>
              <span className="font-semibold">Create by: </span>
              {courseInfo?.instructors?.map((instructor) => (
                <Link
                  to={`/users/${instructor.id}/profile`}
                  key={instructor.id}
                  className="link link-hover"
                >
                  {instructor.fullName}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex space-x-2">
                <Languages size={20} />: <span>{courseInfo?.language}</span>
              </div>
              <div className="flex space-x-2">
                {courseInfo?.labels?.map((label: CourseLabel) => (
                  <span key={label.id} className="badge badge-primary">
                    {label.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* What you will learn: FIX */}
          <div className="card border border-slate-200">
            <div className="card-body">
              <div className="card-title mb-4">What you'll learn</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Course content 1</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Course content 2</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Course content 3</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Course content 4</span>
                </div>
              </div>
            </div>
          </div>
          {/* Topics (tags) */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Explore related topics
            </h3>
            {courseInfo?.tags?.map((tag: CourseTag) => (
              <Link to={`/?tags=${tag.name}`} key={tag.id} className="btn mr-4">
                {tag.name}
              </Link>
            ))}
          </div>
          {/* List of lessons */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Course contents</h3>
            <CourseContentList
              chapters={chapters}
              courseSlug={courseInfo?.slug}
            />
          </div>
          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <p
              className="ql-editor ql-snow h-auto p-0"
              dangerouslySetInnerHTML={{__html: courseInfo?.description || ""}}
            ></p>
          </div>
          {/* Skill level */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Course level</h3>
            <p>{courseInfo?.skillLevel}</p>
          </div>
          {/* Who is this course for*/}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Who is this course for ?
            </h3>
            <p>{courseInfo?.targetAudience}</p>
          </div>
          {/* Reviews */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Reviews</h3>
            <div className="grid grid-cols-2 gap-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id}>{review.comment}</div>
                ))
              ) : (
                <div>This course hasn't had review yet.</div>
              )}
            </div>
          </div>
        </div>
        {/* Course enroll */}
        <div className="w-1/3 card shadow rounded-lg">
          <figure className="h-56 border-b border-b-slate-200">
            {courseInfo?.image && <img src={courseInfo.image} />}
            {!courseInfo?.image && (
              <div className="w-full h-full bg-slate-200"></div>
            )}
          </figure>
          <div className="card-body space-y-2">
            {!isEnrolled ? (
              <>
                <p className="text-2xl font-bold">
                  {formatPrice(courseInfo?.sellingPrice, courseInfo?.currency)}
                </p>
                <button className="btn btn-primary" onClick={handleEnroll}>
                  Enroll this course
                </button>
              </>
            ) : (
              <Link
                to={`/course/${courseInfo?.slug}/learn/lesson/${currentLessonSlug}`}
                className="btn btn-neutral"
              >
                Continue learning
              </Link>
            )}
            <h3 className="font-semibold">This course includes:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>...lessons</li>
              <li>Complete certification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
