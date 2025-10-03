import Button from "@/components/Button";
import {Edit3, Trash2} from "lucide-react";
import ChapterItem, {CourseItem} from "./ChapterItem";
import NewItemAction from "./NewItemAction";

export interface Chapter {
  id: number;
  title: string;
  summary?: string;
  items: CourseItem[];
}

interface ChapterListProps {
  chapters: Chapter[];
  onEditChapter: (chapterId: number) => void;
  onDeleteChapter: (chapterId: number) => void;
  onAddItem: (chapterId: number, type: CourseItem["type"]) => void;
  onEditItem: (chapterId: number, itemId: number) => void;
  onDeleteItem: (chapterId: number, itemId: number) => void;
}

export default function ChapterList({
  chapters,
  onEditChapter,
  onDeleteChapter,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: ChapterListProps) {
  return (
    <div className="space-y-6">
      {chapters.map((chapter) => (
        <div key={chapter.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Chapter {chapter.id}: {chapter.title}
            </h4>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Edit3 size={14} />}
                onClick={() => onEditChapter(chapter.id)}
                className="text-green-600 hover:text-green-700"
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Trash2 size={14} />}
                onClick={() => onDeleteChapter(chapter.id)}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {chapter.items.map((item) => (
              <ChapterItem
                key={item.id}
                chapterId={chapter.id}
                item={item}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
              />
            ))}
          </div>

          <NewItemAction chapterId={chapter.id} onAddItem={onAddItem} />
        </div>
      ))}
    </div>
  );
}
