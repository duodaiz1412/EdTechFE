import {Lesson} from "@/types";
import {CircleQuestionMark, FileText, Video} from "lucide-react";
import {Link} from "react-router-dom";

interface CourseContentItemProps {
  lesson: Lesson;
  courseId?: string;
  isActive?: boolean | null;
}

export default function CourseContentItem({
  lesson,
  courseId,
  isActive,
}: CourseContentItemProps) {
  return (
    <Link
      to={`/course/${courseId}/learn/lesson/${lesson.id}`}
      className={`p-4 block hover:bg-slate-300 ${isActive ? "bg-slate-300" : ""}`}
    >
      <div className="flex items-center space-x-3">
        {lesson.videoUrl && <Video size={16} />}
        {lesson.content && !lesson.content.includes("quizId") && (
          <FileText size={16} />
        )}
        {lesson.content && lesson.content.includes("quizId") && (
          <CircleQuestionMark size={16} />
        )}
        <p className="font-medium">{lesson.title}</p>
      </div>
    </Link>
  );
}
