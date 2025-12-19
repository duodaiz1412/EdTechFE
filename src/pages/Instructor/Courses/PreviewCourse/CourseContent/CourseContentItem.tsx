import {Lesson} from "@/types";
import {FileText, PlayCircle, HelpCircle, ClipboardList} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";

interface CourseContentItemProps {
  lesson: Lesson;
  courseSlug?: string;
  isActive?: boolean | null;
}

const getLessonIcon = (lesson: Lesson) => {
  if (lesson.videoUrl) return <PlayCircle size={20} />;
  if (lesson.quizDto) return <HelpCircle size={20} />;
  if (lesson.content) return <ClipboardList size={20} />;
  return <FileText size={20} />;
};

export default function CourseContentItem({
  lesson,
  isActive,
}: CourseContentItemProps) {
  const navigate = useNavigate();
  const {courseId} = useParams();

  const handleClick = () => {
    if (lesson.slug) {
      navigate(`/instructor/courses/${courseId}/preview/lesson/${lesson.slug}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 block hover:bg-slate-300 cursor-pointer ${isActive ? "bg-slate-300" : ""}`}
    >
      <div className="flex items-center space-x-3">
        {getLessonIcon(lesson)}
        <p className="font-medium">{lesson.title}</p>
      </div>
    </div>
  );
}
