import Button from "@/components/Button";
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
          📄 Lecture
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="bg-blue-50 text-blue-700"
          onClick={() => onAddItem(chapterId, "quiz")}
        >
          ❓ Quiz
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onAddItem(chapterId, "assignment")}
        >
          📋 Assignment
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onAddItem(chapterId, "coding")}
        >
          &lt;/&gt; Coding exercise
        </Button>
      </div>
    </div>
  );
}
