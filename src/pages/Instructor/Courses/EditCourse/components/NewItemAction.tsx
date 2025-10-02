import Button from "@/components/Button";
import {HelpCircle, ClipboardList, Code2, FileText} from "lucide-react";
import {useNavigate, useParams} from "react-router";
import {CourseItem} from "./ChapterItem";

interface NewItemActionProps {
  chapterId: number;
  onAddItem: (chapterId: number, type: CourseItem["type"]) => void;
}

export default function NewItemAction({
  chapterId,
  onAddItem,
}: NewItemActionProps) {
  const navigate = useNavigate();
  const {courseId} = useParams();
  return (
    <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
      <p className="text-sm text-gray-600 mb-3">Add new item:</p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            navigate(`/instructor/courses/${courseId}/edit/lecture/create`)
          }
        >
          <span className="inline-flex items-center gap-2">
            <FileText size={16} /> Lecture
          </span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="bg-blue-50 text-blue-700"
          onClick={() => onAddItem(chapterId, "quiz")}
        >
          <span className="inline-flex items-center gap-2">
            <HelpCircle size={16} /> Quiz
          </span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onAddItem(chapterId, "assignment")}
        >
          <span className="inline-flex items-center gap-2">
            <ClipboardList size={16} /> Assignment
          </span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onAddItem(chapterId, "coding")}
        >
          <span className="inline-flex items-center gap-2">
            <Code2 size={16} /> Coding exercise
          </span>
        </Button>
      </div>
    </div>
  );
}
