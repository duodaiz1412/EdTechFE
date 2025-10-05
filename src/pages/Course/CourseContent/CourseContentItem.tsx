import {Lesson} from "@/types";
import {FileText, Video} from "lucide-react";
import {Link} from "react-router-dom";

export default function CourseContentItem({lesson}: {lesson: Lesson}) {
  return (
    <Link to="/" className="p-4 block">
      <div className="flex items-center space-x-3">
        {lesson.videoUrl && <Video size={16} />}
        {lesson.content && <FileText size={16} />}
        <p className="font-medium">{lesson.title}</p>
      </div>
    </Link>
  );
}
