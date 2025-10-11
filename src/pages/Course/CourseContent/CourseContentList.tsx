import {Chapter, LessonIndex} from "@/types";
import CourseContentItem from "./CourseContentItem";

interface CourseContentListProps {
  courseSlug?: string;
  chapters?: Chapter[];
  currentLesson?: LessonIndex;
}

export default function CourseContentList({
  courseSlug,
  chapters,
  currentLesson,
}: CourseContentListProps) {
  return (
    <div>
      {chapters?.map((chapter, index) => (
        <div
          key={chapter.title}
          className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-none"
        >
          <input
            type="checkbox"
            defaultChecked={currentLesson?.chapter === chapter.position}
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
                    courseSlug={courseSlug}
                    isActive={
                      !!currentLesson?.lesson?.slug &&
                      lesson.slug === currentLesson?.lesson?.slug
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
