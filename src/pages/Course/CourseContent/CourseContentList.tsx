import {Chapter} from "@/types";
import CourseContentItem from "./CourseContentItem";

export default function CourseContentList({chapters}: {chapters?: Chapter[]}) {
  return (
    <div className="space-y-2">
      {chapters?.map((chapter, index) => (
        <div
          key={chapter.title}
          className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-none"
        >
          <input type="checkbox" className="chapter-toggle" />
          <div className="collapse-title bg-slate-200 space-x-2 flex items-center">
            <h2 className="font-semibold">
              Section {index + 1}: {chapter.title}
            </h2>
            <span className="text-sm">
              {chapter.lessons ? chapter.lessons.length : "0"} lessons
            </span>
          </div>
          <div className="collapse-content p-0">
            <div className="pt-3 divide-solid divide-y">
              {chapter.lessons ? (
                chapter.lessons.map((lesson) => (
                  <CourseContentItem key={lesson.id} lesson={lesson} />
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
