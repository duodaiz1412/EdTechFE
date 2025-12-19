import Button from "@/components/Button";
import {Edit3, Trash2} from "lucide-react";
import LessonItem from "./LessonItem";
import {CourseItem} from "@/context/CourseContext";
import NewItemAction from "./NewItemAction";

export interface Chapter {
  id: string;
  title: string;
  summary?: string;
  slug?: string;
  position: number;
  lessons?: CourseItem[];
}

interface ChapterListProps {
  chapters: Chapter[];
  onEditChapter: (chapterId: string) => void;
  onDeleteChapter: (chapterId: string) => void;
  onDeleteItem: (chapterId: string, itemId: string) => void;
  onLessonCreated?: (lesson: any, chapterId: string) => void;
}

export default function ChapterList({
  chapters,
  onEditChapter,
  onDeleteChapter,
  onDeleteItem,
  onLessonCreated,
}: ChapterListProps) {
  return (
    <div className="space-y-6">
      {chapters?.map((chapter) => (
        <div key={chapter.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Chapter {chapter?.position}: {chapter?.title}
            </h4>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Edit3 size={14} />}
                onClick={() => onEditChapter(chapter?.id)}
                className="text-green-600 hover:text-green-700"
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Trash2 size={14} />}
                onClick={() => onDeleteChapter(chapter?.id)}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {chapter?.lessons?.map((item) => (
              <LessonItem
                key={item.id}
                chapterId={chapter?.id || ""}
                item={item}
                onDelete={onDeleteItem}
              />
            ))}
          </div>

          <NewItemAction
            chapterId={chapter?.id}
            onLessonCreated={(lesson) =>
              onLessonCreated?.(lesson, chapter?.id || "")
            }
          />
        </div>
      ))}
    </div>
  );
}
