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
  const Icon = () => {
    if (lesson.content) {
      if (lesson.content.includes("quizId")) {
        return <CircleQuestionMark size={16} />;
      } else {
        return <FileText size={16} />;
      }
    }
    return <Video size={16} />;
  };

  return (
    <Link
      to={`/course/${courseId}/learn/lesson/${lesson.id}`}
      className={`p-4 block hover:bg-slate-300 ${isActive ? "bg-slate-300" : ""}`}
    >
      <div className="flex items-center space-x-3">
        <Icon />
        <p className="font-medium">{lesson.title}</p>
      </div>
    </Link>
  );
}
