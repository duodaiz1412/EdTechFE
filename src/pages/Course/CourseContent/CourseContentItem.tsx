import {Lesson} from "@/types";
import {FileText} from "lucide-react";
import {Link} from "react-router-dom";

interface CourseContentItemProps {
  lesson: Lesson;
  courseSlug?: string;
  isActive?: boolean | null;
}

export default function CourseContentItem({
  lesson,
  courseSlug,
  isActive,
}: CourseContentItemProps) {
  return (
    <Link
      to={`/course/${courseSlug}/learn/lesson/${lesson.slug}`}
      className={`p-4 block hover:bg-slate-300 ${isActive ? "bg-slate-300" : ""}`}
    >
      <div className="flex items-center space-x-3">
        <FileText size={20} />
        <p className="font-medium">{lesson.title}</p>
      </div>
    </Link>
  );
}
