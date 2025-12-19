import HtmlDisplay from "@/components/HtmlDisplay";

interface CourseLessonArticleProps {
  content: string;
}

export default function CourseLessonArticle({
  content,
}: CourseLessonArticleProps) {
  return (
    <div className="w-5/6 h-[600px] bg-white overflow-y-auto p-6">
      <HtmlDisplay html={content} />
    </div>
  );
}
