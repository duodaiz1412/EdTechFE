import CourseContentList from "@/pages/Course/CourseContent/CourseContentList";
import {Chapter, LessonCurrent} from "@/types";
import {useParams} from "react-router-dom";

interface CourseSidebarProps {
  chapters?: Chapter[];
  currentLesson?: LessonCurrent;
}

export default function CourseSidebar({
  chapters,
  currentLesson,
}: CourseSidebarProps) {
  const {courseSlug} = useParams();

  return (
    <div className="w-1/4 h-full overflow-y-scroll border-l border-l-slate-200">
      <CourseContentList
        courseSlug={courseSlug}
        chapters={chapters}
        currentLesson={currentLesson}
      />
    </div>
  );
}
