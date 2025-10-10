import {Chapter, LessonIndex} from "@/types";
import CourseContentItem from "./CourseContentItem";
import {useEffect, useState} from "react";

interface CourseContentListProps {
  courseId?: string;
  chapters?: Chapter[];
  currentLesson?: LessonIndex;
}

export default function CourseContentList({
  courseId,
  chapters,
  currentLesson,
}: CourseContentListProps) {
  const [openChapter, setOpenChapter] = useState<number | undefined>(undefined);

  // Mỗi khi currentLesson thay đổi, tự động mở chương chứa bài học hiện tại
  useEffect(() => {
    if (currentLesson?.chapter != null) {
      setOpenChapter(currentLesson.chapter);
    }
  }, [currentLesson]);
  return (
    <div>
      {chapters?.map((chapter, index) => (
        <div
          key={chapter.title}
          className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-none"
        >
          <input
            type="checkbox"
            checked={openChapter === chapter.position}
            onChange={() =>
              setOpenChapter(
                openChapter === chapter.position ? undefined : chapter.position,
              )
            }
            className="chapter-toggle"
          />
          <div className="collapse-title bg-slate-100 space-x-2 flex items-center">
            <h2 className="font-semibold">
              Section {index + 1}: {chapter.title}
            </h2>
            <span className="text-sm">
              {chapter.lessons ? chapter.lessons.length : "0"} lessons
            </span>
          </div>
          <div className="collapse-content p-0">
            <div className="divide-solid divide-y">
              {chapter.lessons ? (
                chapter.lessons.map((lesson) => (
                  <CourseContentItem
                    key={lesson.id}
                    lesson={lesson}
                    courseId={courseId}
                    isActive={
                      !!currentLesson?.lesson?.id &&
                      lesson.id === currentLesson?.lesson?.id
                    }
                  />
                ))
              ) : (
                <span className="px-4">No content available</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
