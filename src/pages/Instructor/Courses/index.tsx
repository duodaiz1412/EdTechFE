import {PlusCircle, Search} from "lucide-react";
import {useNavigate} from "react-router";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import CourseItem, {
  Course,
} from "@/pages/Instructor/Courses/components/CourseItem";
import {Heading3} from "@/components/Typography";
import {useState} from "react";
import DeleteModal from "@/components/DeleteModal";

const mockCourses: Course[] = [
  {id: "1", title: "Course 1", status: "Draft"},
  {id: "2", title: "Course 2", status: "Published", publishedAt: "7/9/2025"},
];

export default function InstructorCourse() {
  const navigate = useNavigate();
  const [deleteState, setDeleteState] = useState<{open: boolean; course: Course | null}>({open: false, course: null});

  const handleCreateCourse = () => {
    navigate("/instructor/courses/create");
  };

  const handleEditCourse = (course: Course) => {
    // TODO: Implement edit functionality
    navigate(`/instructor/courses/${course.id}/edit`);
  };

  const handleDeleteCourse = (course: Course) => {
    setDeleteState({open: true, course});
  };

  return (
    <div className="w-full h-full container mx-auto flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 justify-between">
        <div className="flex justify-between items-center w-full">
          <Heading3>Courses</Heading3>
        </div>
        {/* Toolbar */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Search your course"
              size="md"
              className="w-64"
            />

            <Button variant="secondary" leftIcon={<Search size={16} />}>
              Search
            </Button>

            <Select
              size="md"
              className="w-40"
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
          >
            New course
          </Button>
        </div>
      </div>

      {/* Course list */}
      <div className="space-y-4">
        {mockCourses.map((course) => (
          <CourseItem
            key={course.id}
            course={course}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
          />
        ))}
      </div>

      <DeleteModal
        open={deleteState.open}
        title="Delete course"
        message={deleteState.course ? `Are you sure you want to delete "${deleteState.course.title}"?` : "Are you sure you want to delete this course?"}
        onClose={() => setDeleteState({open: false, course: null})}
        onConfirm={() => {
          // TODO: call API delete
          setDeleteState({open: false, course: null});
        }}
      />
    </div>
  );
}
