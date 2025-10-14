import {useEffect} from "react";

interface CourseLessonArticleProps {
  content: string;
  completeLesson?: () => void;
}

export default function CourseLessonArticle({
  content,
  completeLesson,
}: CourseLessonArticleProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (completeLesson) {
        completeLesson();
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [completeLesson]);

  return (
    <div className="w-5/6 h-[600px] bg-white overflow-y-auto p-4">
      <div
        className="ql-editor ql-snow h-auto"
        dangerouslySetInnerHTML={{__html: content}}
      ></div>
    </div>
  );
}
