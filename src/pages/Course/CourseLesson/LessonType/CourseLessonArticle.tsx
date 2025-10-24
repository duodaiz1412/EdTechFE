import HtmlDisplay from "@/components/HtmlDisplay";
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
    }, 15000);

    return () => clearTimeout(timer);
  }, [completeLesson]);

  return (
    <div className="w-5/6 h-[600px] bg-white overflow-y-auto p-6">
      <HtmlDisplay html={content} />
    </div>
  );
}
