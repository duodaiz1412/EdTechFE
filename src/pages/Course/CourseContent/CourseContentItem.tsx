import {FileText, Video} from "lucide-react";
import {Link} from "react-router-dom";

export default function CourseContentItem({lesson}: {lesson: any}) {
  const type: string = lesson.type;
  const subType: string = lesson.subType || "";

  return (
    <Link to="/" className="p-4 block">
      <div className="flex items-center space-x-3">
        {type === "lecture" && subType === "video" && <Video size={16} />}
        {type === "lecture" && subType === "article" && <FileText size={16} />}
        {type === "quiz" && <FileText size={16} />}
        <p className="font-medium">{lesson.title}</p>
      </div>
    </Link>
  );
}
