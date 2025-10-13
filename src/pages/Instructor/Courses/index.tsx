import {PlusCircle, Search, Loader2} from "lucide-react";
import {useNavigate} from "react-router";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import CourseItem, {
  Course,
} from "@/pages/Instructor/Courses/components/CourseItem";
import {Heading3} from "@/components/Typography";
import {useState, useEffect, useCallback} from "react";
import DeleteModal from "@/components/DeleteModal";
import useCourseHook from "@/hooks/useCourse";
// import {toast} from "react-hot-toast";

export default function InstructorCourse() {
  const navigate = useNavigate();
  const {
    state: courseState,
    getMyCourses,
    deleteCourse,
    clearError,
  } = useCourseHook();
  const [deleteState, setDeleteState] = useState<{
    open: boolean;
    course: Course | null;
  }>({open: false, course: null});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage] = useState(0);
  const [pageSize] = useState(10);

  const loadCourses = useCallback(async () => {
    try {
      const coursesData = await getMyCourses(currentPage, pageSize);
      // Transform API data to match Course interface
      const transformedCourses: Course[] = coursesData.map((course) => ({
        id: course.id,
        title: course.title,
        status: course.status === "PUBLISHED" ? "Published" : "Draft",
        publishedAt:
          course.status === "PUBLISHED"
            ? new Date(course.updatedAt).toLocaleDateString()
            : undefined,
      }));
      setCourses(transformedCourses);
    } catch {
      // console.error("Error loading courses:", error);
    }
  }, [getMyCourses, currentPage, pageSize]);

  // Load courses on mount
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleCreateCourse = useCallback(() => {
    navigate("/instructor/courses/create");
  }, [navigate]);

  const handleEditCourse = useCallback(
    (course: Course) => {
      navigate(`/instructor/courses/${course.id}/edit`);
    },
    [navigate],
  );

  const handleDeleteCourse = useCallback((course: Course) => {
    setDeleteState({open: true, course});
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteState.course) return;

    try {
      const success = await deleteCourse(deleteState.course.id);
      if (success) {
        // toast.success("Course deleted successfully");
        setDeleteState({open: false, course: null});
        // Refresh courses list
        await loadCourses();
      } else {
        // toast.error("Failed to delete course");
      }
    } catch {
      // toast.error("Error deleting course");
    }
  }, [deleteState.course, deleteCourse, loadCourses]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    // TODO: Implement search functionality
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
    // TODO: Implement sort functionality
  }, []);

  return (
    <div className="w-full h-full container mx-auto flex flex-col gap-6">
      {/* Error display */}
      {courseState.error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{courseState.error}</p>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 text-sm mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Page header */}
      <div className="flex flex-col gap-3 justify-between">
        <div className="flex justify-between items-center w-full">
          <Heading3>Courses</Heading3>
          {courseState.isLoading && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Search your course"
              size="md"
              className="w-64"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <Button
              variant="secondary"
              leftIcon={<Search size={16} />}
              onClick={() => handleSearch(searchTerm)}
            >
              Search
            </Button>

            <Select
              size="md"
              className="w-40"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              options={[
                {value: "newest", label: "Newest"},
                {value: "oldest", label: "Oldest"},
                {value: "a-z", label: "A-Z"},
                {value: "z-a", label: "Z-A"},
              ]}
            />
          </div>

          <Button
            leftIcon={<PlusCircle size={18} />}
            size="md"
            onClick={handleCreateCourse}
            disabled={courseState.isLoading}
          >
            New course
          </Button>
        </div>
      </div>

      {/* Course list */}
      <div className="space-y-4">
        {courseState.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 size={24} className="animate-spin" />
              <span>Loading courses...</span>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No courses found</p>
            <Button onClick={handleCreateCourse}>
              Create your first course
            </Button>
          </div>
        ) : (
          courses.map((course) => (
            <CourseItem
              key={course.id}
              course={course}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          ))
        )}
      </div>

      <DeleteModal
        open={deleteState.open}
        title="Delete course"
        message={
          deleteState.course
            ? `Are you sure you want to delete "${deleteState.course.title}"?`
            : "Are you sure you want to delete this course?"
        }
        onClose={() => setDeleteState({open: false, course: null})}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
