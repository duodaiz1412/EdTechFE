import CourseContentList from "@/pages/Course/CourseContent/CourseContentList";
import {Chapter, LessonIndex} from "@/types";
import {useParams} from "react-router-dom";

interface CourseSidebarProps {
  chapters?: Chapter[];
  currentLesson?: LessonIndex;
}

export default function CourseSidebar({
  chapters,
  currentLesson,
}: CourseSidebarProps) {
  const {courseId} = useParams();

  return (
    <div className="w-1/4 h-full overflow-y-scroll border-l border-l-slate-200">
      <CourseContentList
        courseId={courseId}
        chapters={chapters}
        currentLesson={currentLesson}
      />
    </div>
  );
}
