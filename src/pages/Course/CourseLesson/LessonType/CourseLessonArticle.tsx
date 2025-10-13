interface CourseLessonArticleProps {
  content: string;
}

export default function CourseLessonArticle({
  content,
}: CourseLessonArticleProps) {
  return (
    <div className="w-5/6 h-[600px] bg-white overflow-y-auto p-4">
      <div
        className="ql-editor ql-snow h-auto"
        dangerouslySetInnerHTML={{__html: content}}
      ></div>
    </div>
  );
}
