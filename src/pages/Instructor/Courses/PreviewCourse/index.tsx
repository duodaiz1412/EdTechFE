import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router";
import {ArrowLeft, Eye, AlertCircle} from "lucide-react";
import Button from "@/components/Button";
import {Heading3} from "@/components/Typography";
import {useCourseContext} from "@/context/CourseContext";
import CourseContentList from "./CourseContent/CourseContentList";
import CourseLesson from "./CourseLesson";
import {instructorServices} from "@/lib/services/instructor.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";

export default function PreviewCourse() {
  const navigate = useNavigate();
  const {courseId, lessonSlug} = useParams();
  const {formData, loadCourse} = useCourseContext();
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load course data with instructor API and check access
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
          // Check if user has access to this course (instructor owns it)
          setHasAccess(true);
          // Load course into context
          await loadCourse(courseId);
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
  }, [courseId, loadCourse]);

  // Find and set selected lesson
  useEffect(() => {
    if (lessonSlug && formData.chapters) {
      const allLessons = formData.chapters.flatMap(
        (chapter: any) => chapter.lessons || [],
      );
      const lesson = allLessons.find((l: any) => l.slug === lessonSlug);
      if (lesson) {
        setSelectedLesson(lesson);
        setCurrentLesson({
          chapter:
            formData.chapters.find((c: any) =>
              c.lessons?.some((l: any) => l.slug === lessonSlug),
            )?.position || 1,
          lesson: lesson,
        });
      }
    }
  }, [lessonSlug, formData.chapters]);

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
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
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
    <div className="flex h-screen bg-gray-50">
      {/* Main Content - Lesson */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {selectedLesson ? (
          <CourseLesson
            lesson={selectedLesson}
            status={false} // Preview mode - not completed
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Eye size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a lesson to preview
              </h3>
              <p className="text-gray-500">
                Choose a lesson from the sidebar to see how it will appear to
                students
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar - Course Content */}
      <div className="w-1/3 bg-white border-l border-gray-200 overflow-y-auto custom-scrollbar">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() =>
                navigate(`/instructor/courses/${courseId}/edit/curriculum`)
              }
            >
              Back to Edit
            </Button>
            <div className="flex items-center gap-2 text-orange-600">
              <Eye size={16} />
              <span className="text-sm font-medium">Preview Mode</span>
            </div>
          </div>
          <Heading3>Course Content</Heading3>
        </div>

        <div className="p-4">
          <CourseContentList
            courseSlug={formData.title?.toLowerCase().replace(/\s+/g, "-")}
            chapters={formData.chapters as any}
            currentLesson={currentLesson}
          />
        </div>
      </div>
    </div>
  );
}
