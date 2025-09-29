import Button from "@/components/Button";
import Chip from "@/components/Chip";
import {Edit3, Trash2} from "lucide-react";

export type CourseItemType = "lecture" | "quiz" | "assignment" | "coding";

export interface CourseItem {
  id: number;
  type: CourseItemType;
  title: string;
  status: "published" | "draft";
}

interface ChapterItemProps {
  chapterId: number;
  item: CourseItem;
  onEdit: (chapterId: number, itemId: number) => void;
  onDelete: (chapterId: number, itemId: number) => void;
}

const getItemIcon = (type: CourseItemType) => {
  switch (type) {
    case "lecture":
      return "📄";
    case "quiz":
      return "❓";
    case "assignment":
      return "📋";
    case "coding":
      return "</>";
    default:
      return "📄";
  }
};

const getStatusChip = (status: "published" | "draft") => {
  switch (status) {
    case "published":
      return <Chip variant="success">Published</Chip>;
    case "draft":
    default:
      return <Chip variant="warning">Draft</Chip>;
  }
};

export default function ChapterItem({
  chapterId,
  item,
  onEdit,
  onDelete,
}: ChapterItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-lg">{getItemIcon(item.type)}</span>
        <div>
          <p className="font-medium text-gray-900">
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} {item.id}:{" "}
            {item.title}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {getStatusChip(item.status)}
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Edit3 size={14} />}
          onClick={() => onEdit(chapterId, item.id)}
          className="text-green-600 hover:text-green-700"
        >
          Edit
        </Button>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Trash2 size={14} />}
          onClick={() => onDelete(chapterId, item.id)}
          className="text-red-600 hover:text-red-700"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
