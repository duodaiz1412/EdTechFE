import Button from "@/components/Button";
import {
  Edit3,
  Trash2,
  PlayCircle,
  HelpCircle,
  ClipboardList,
} from "lucide-react";

import {CourseItem} from "@/context/CourseContext";

interface LessonItemProps {
  chapterId: string;
  item: CourseItem;
  onEdit: (chapterId: string, itemId: string) => void;
  onDelete: (chapterId: string, itemId: string) => void;
}

const getItemIcon = (item: CourseItem) => {
  if (item.videoUrl) return <PlayCircle size={20} />;
  if (item.quizDto) return <HelpCircle size={20} />;
  if (item.fileUrl) return <ClipboardList size={20} />;
  return <PlayCircle size={20} />;
};


export default function LessonItem({
  chapterId,
  item,
  onEdit,
  onDelete,
}: LessonItemProps) {

  if (!item) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-lg"><PlayCircle size={20} /></span>
          <div>
            <p className="font-medium text-red-500">
              Invalid item data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-lg">{getItemIcon(item)}</span>
        <div>
          <p className="font-medium text-gray-900">
            Lesson {item.position}: {item.title}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Edit3 size={14} />}
          onClick={() => onEdit(chapterId, item.id || '')}
          className="text-green-600 hover:text-green-700"
        >
          Edit
        </Button>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Trash2 size={14} />}
          onClick={() => onDelete(chapterId, item.id || '')}
          className="text-red-600 hover:text-red-700"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
