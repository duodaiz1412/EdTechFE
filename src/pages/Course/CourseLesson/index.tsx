import {Lesson, Quiz} from "@/types";
import {Download} from "lucide-react";
import {useEffect, useState} from "react";

export default function CourseLesson({lesson}: {lesson?: Lesson}) {
  const [lessonType, setLessonType] = useState("video");
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    if (lesson?.content) {
      if (lesson.content.includes("quizId")) {
        setLessonType("quiz");
      } else {
        setLessonType("article");
      }
    }
  }, [lesson]);

  return (
    <div>
      {/* Lesson content */}
      <div className="h-[600px] bg-black flex justify-center border border-slate-200">
        {lessonType === "quiz" && <div className="w-5/6 bg-white"></div>}
      </div>
      {/* Info, rating & comments */}
      <div className="w-5/6 mx-auto py-6 h-[500px]">
        <div className="tabs tabs-lg tabs-border">
          <input
            type="radio"
            name="lesson_tabs"
            className="tab"
            defaultChecked
            aria-label="Overview"
          />
          <div className="tab-content px-3 py-4">
            <h2 className="text-xl font-semibold mb-6">{lesson?.title}</h2>
            {lesson?.fileUrl && (
              <div className="space-y-2">
                <p>Attachments</p>
                <a
                  href=""
                  download={lesson?.fileUrl}
                  className="p-3 text-blue-600 bg-blue-50 border border-blue-200 rounded-md flex items-center space-x-4"
                >
                  <Download size={20} />
                  <span>Download here</span>
                </a>
              </div>
            )}
          </div>

          <input
            type="radio"
            name="lesson_tabs"
            className="tab"
            aria-label="Q&A"
          />
          <div className="tab-content px-3 py-4">
            <h2 className="text-xl font-semibold mb-6">Q&A</h2>
          </div>

          <input
            type="radio"
            name="lesson_tabs"
            className="tab"
            aria-label="Reviews"
          />
          <div className="tab-content px-3 py-4">
            <h2 className="text-xl font-semibold mb-6">Reviews</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
