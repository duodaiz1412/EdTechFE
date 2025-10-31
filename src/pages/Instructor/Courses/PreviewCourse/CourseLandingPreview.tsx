import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router";
import {ArrowLeft, Eye, Languages} from "lucide-react";
import Button from "@/components/Button";
import {instructorServices} from "@/lib/services/instructor.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {formatPrice} from "@/lib/utils/formatPrice";
import ReadOnlyRating from "@/components/ReadOnlyRating";
import CourseReviewItem from "@/pages/Course/CourseLesson/Review/CourseReviewItem";
import CourseContentList from "./CourseContent/CourseContentList";

export default function CourseLandingPreview() {
  const navigate = useNavigate();
  const {courseId} = useParams();
  const [courseInfo, setCourseInfo] = useState<any>();
  const [chapters, setChapters] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load course data with instructor API
  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Use instructor API to get course data
        const accessToken = await getAccessToken();
        if (!accessToken) {
          setError("Authentication required");
          return;
        }

        const response = await instructorServices.getCourseForInstructor(
          courseId,
          accessToken,
        );
        if (response.data) {
          setCourseInfo(response.data);
          setChapters(response.data.chapters || []);
          setReviews([]); // No reviews in preview mode
          setHasAccess(true);
        }
      } catch (error: any) {
        if (error.response?.status === 403) {
          setError("You don't have permission to preview this course");
        } else if (error.response?.status === 404) {
          setError("Course not found");
        } else {
          setError("Failed to load course data");
        }
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseData();
  }, [courseId]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course preview...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !hasAccess) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye size={32} className="text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600 mb-4">
            {error || "You don't have permission to preview this course"}
          </p>
          <Button
            variant="secondary"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate("/instructor/courses")}
          >
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<ArrowLeft size={16} />}
                onClick={() =>
                  navigate(`/instructor/courses/${courseId}/edit/landing-page`)
                }
              >
                Back to Edit
              </Button>
              <div className="flex items-center gap-2 text-orange-600">
                <Eye size={16} />
                <span className="text-sm font-medium">
                  Landing Page Preview
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Detail Content */}
      <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start space-x-12">
          {/* Course info */}
          <div className="w-2/3 space-y-10">
            <h2 className="text-3xl font-bold">
              {courseInfo?.title || "Course Title"}
            </h2>
            {/* General info */}
            <div className="space-y-3 text-sm">
              <p className="text-xl">
                {courseInfo?.shortIntroduction || "Course short introduction"}
              </p>
              <div className="flex space-x-2 items-start">
                <span className="font-semibold text-orange-900">
                  {courseInfo?.rating || 0}
                </span>
                <ReadOnlyRating rating={courseInfo?.rating || 0} size="xs" />
                <span>({courseInfo?.enrollments || 0} students)</span>
              </div>
              {/* Instructors */}
              <div>
                <span className="font-semibold">Create by: </span>
                {courseInfo?.instructors?.map((instructor: any) => (
                  <span key={instructor.id} className="link link-hover">
                    {instructor.fullName || "Instructor"}
                  </span>
                )) || <span>No instructor</span>}
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex space-x-2">
                  <Languages size={20} />:{" "}
                  <span>{courseInfo?.language || "English"}</span>
                </div>
                <div className="flex space-x-2">
                  {courseInfo?.labels?.map((label: any) => (
                    <span key={label.id} className="badge badge-primary">
                      {label.name || "Label"}
                    </span>
                  )) || <span className="badge badge-primary">No labels</span>}
                </div>
              </div>
            </div>
            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Description</h3>
              <div
                className="ql-editor ql-snow h-auto p-0"
                dangerouslySetInnerHTML={{
                  __html: courseInfo?.description || "No description available",
                }}
              />
            </div>
            {/* Topics (tags) */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Explore related topics
              </h3>
              {courseInfo?.tags?.map((tag: any) => (
                <span key={tag.id} className="btn mr-4">
                  {tag.name || "Tag"}
                </span>
              )) || <span className="btn mr-4">No tags</span>}
            </div>
            {/* List of lessons */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Course contents</h3>
              <CourseContentList
                chapters={chapters || []}
                courseSlug={courseInfo?.slug || ""}
              />
            </div>
            {/* Skill level */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Course level</h3>
              <p>{courseInfo?.skillLevel || "Not specified"}</p>
            </div>
            {/* Who is this course for*/}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Who is this course for ?
              </h3>
              <p>{courseInfo?.targetAudience || "Not specified"}</p>
            </div>
            {/* Reviews */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Reviews</h3>
              <div className="grid grid-cols-2 gap-6">
                {reviews.length > 0 &&
                  reviews.map((review) => (
                    <CourseReviewItem key={review.id} review={review} />
                  ))}
              </div>
            </div>
          </div>
          {/* Course enroll */}
          <div className="w-1/3 card border border-slate-200 shadow-sm rounded-lg">
            <figure className="h-56 border-b border-b-slate-200">
              {courseInfo?.image && (
                <img
                  src={courseInfo.image}
                  alt={courseInfo.title || "Course image"}
                />
              )}
              {!courseInfo?.image && (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </figure>
            <div className="card-body space-y-2">
              <p className="text-2xl font-bold">
                {formatPrice(
                  courseInfo?.sellingPrice || 0,
                  courseInfo?.currency || "USD",
                )}
              </p>
              {courseInfo?.coursePrice &&
                courseInfo.coursePrice > courseInfo.sellingPrice && (
                  <p className="text-lg text-gray-500 line-through">
                    {formatPrice(
                      courseInfo.coursePrice,
                      courseInfo.currency || "USD",
                    )}
                  </p>
                )}

              <div className="bg-orange-100 border border-orange-200 rounded p-3 text-center">
                <p className="text-sm text-black font-medium">
                  Preview Mode - No enrollment available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
