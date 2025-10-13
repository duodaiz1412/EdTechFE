import {useMemo, useEffect, useCallback} from "react";
import {Outlet, useLocation, useNavigate, useParams} from "react-router";
import {ArrowLeft, Settings, Loader2} from "lucide-react";
import Button from "@/components/Button";
import {Heading2} from "@/components/Typography";
import Chip from "@/components/Chip";
import {useCourseContext} from "@/context/CourseContext";
// import {toast} from "react-hot-toast";

const navigationItems = [
  {
    section: "Plan your course",
    items: [
      {id: "intended-learners", label: "Intended learners", active: true},
      {id: "course-structure", label: "Course structure"},
      {id: "setup-test", label: "Setup & test video"},
    ],
  },
  {
    section: "Create your content",
    items: [
      {id: "film-edit", label: "Film & edit"},
      {id: "curriculum", label: "Curriculum"},
      {id: "caption", label: "Caption (optional)"},
      {id: "accessibility", label: "Accessibility (optional)"},
    ],
  },
  {
    section: "Publish your course",
    items: [
      {id: "landing-page", label: "Course landing page"},
      {id: "pricing", label: "Pricing"},
      {id: "promotions", label: "Promotions"},
      {id: "messages", label: "Course messages"},
    ],
  },
];

export default function EditCourse() {
  const navigate = useNavigate();
  const {courseId} = useParams();
  const location = useLocation();
  const {
    // API Operations (from hook via context)
    loadCourse,

    // API State (from hook via context)
    state: courseState,
    clearError,
  } = useCourseContext();
  const {course} = courseState;

  const activeSection = useMemo(() => {
    const match = location.pathname.match(/\/edit\/(.+)$/);
    return match?.[1] ?? "intended-learners";
  }, [location.pathname]);

  // Load course data when component mounts
  useEffect(() => {
    if (courseId) {
      loadCourse(courseId);
    }
  }, [courseId, loadCourse]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleBackToCourses = useCallback(() => {
    navigate("/instructor");
  }, [navigate]);

  const handleSettings = useCallback(() => {
    navigate(`/instructor/courses/${courseId}/edit/settings`);
  }, [navigate, courseId]);

  return (
    <div className="min-h-screen bg-white">
      {/* Error display */}
      {courseState.error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mx-6 mt-4">
          <p className="text-red-800">{courseState.error}</p>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 text-sm mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              leftIcon={<ArrowLeft size={16} />}
              onClick={handleBackToCourses}
              className="text-gray-600 hover:text-gray-800"
            >
              Back to courses
            </Button>
            <div className="flex items-center gap-3">
              {courseState.isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={20} className="animate-spin" />
                  <Heading2>Loading...</Heading2>
                </div>
              ) : (
                <>
                  <Heading2>{course?.title || "Course name"}</Heading2>
                  <Chip
                    variant={
                      course?.status === "PUBLISHED" ? "success" : "warning"
                    }
                  >
                    {course?.status || "Draft"}
                  </Chip>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              leftIcon={<Settings size={16} />}
              onClick={handleSettings}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              disabled={courseState.isLoading}
            >
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="flex px-32 gap-4">
        {/* Sidebar Navigation */}
        <div className="w-1/5 bg-white min-h-screen">
          <div className="px-6 py-12">
            {navigationItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {section.section}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() =>
                        navigate(
                          `/instructor/courses/${courseId}/edit/${item.id}`,
                        )
                      }
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeSection === item.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 mt-4 mb-20 bg-white border border-[#D9D9D9] rounded-lg">
          <div className="px-10 py-6">
            {courseState.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 size={24} className="animate-spin" />
                  <span>Loading course...</span>
                </div>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
