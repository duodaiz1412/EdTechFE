import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {motion} from "motion/react";

import {Lesson} from "@/types";

import {Download} from "lucide-react";
import CourseLessonVideo from "./LessonType/CourseLessonVideo";

import LessonCommentList from "./Comment/LessonCommentList";
import CourseReviewList from "./Review/CourseReviewList";
import CourseLessonQuiz from "./LessonType/CourseLessonQuiz";
import CourseLessonArticle from "./LessonType/CourseLessonArticle";

interface CourseLessonProps {
  lesson?: Lesson;
  status?: boolean;
}

export default function CourseLesson({lesson, status}: CourseLessonProps) {
  const [lessonType, setLessonType] = useState("video");
  const [isCompleted, setIsCompleted] = useState(status);

  useEffect(() => {
    if (!lesson) return;
    setIsCompleted(status);

    if (lesson.content) {
      setLessonType("article");
    } else if (lesson.quizDto) {
      setLessonType("quiz");
    } else {
      setLessonType("video");
    }
  }, [status, lesson]);

  const handleComplete = async (lessonTitle?: string) => {
    // Preview mode - simulate lesson completion
    setIsCompleted(true);
    toast.success(`${lessonTitle} completed! (Preview Mode)`);
  };

  return (
    <div>
      {/* Lesson content */}
      <div className="w-full flex justify-center bg-black border border-slate-200">
        {lessonType === "video" && (
          <CourseLessonVideo
            videoUrl={lesson?.videoUrl}
            videoTitle={lesson?.title}
          />
        )}
        {lessonType === "quiz" && <CourseLessonQuiz quiz={lesson?.quizDto} />}
        {lessonType === "article" && (
          <CourseLessonArticle content={lesson?.content || ""} />
        )}
      </div>

      <div className="w-5/6 mx-auto py-6 h-[500px]">
        {/* Lesson status */}
        <div className="flex mb-6 justify-end">
          {isCompleted && (
            <motion.span
              className="badge badge-xl badge-success"
              initial={{scale: 0.8}}
              animate={{scale: 1}}
              transition={{duration: 0.3}}
            >
              Completed
            </motion.span>
          )}
          {!isCompleted && (
            <button
              className="btn btn-neutral"
              onClick={() => handleComplete(lesson?.title)}
            >
              Mark as completed
            </button>
          )}
        </div>
        {/* Info, rating & comments */}
        <div>
          <div className="tabs tabs-lg tabs-border">
            {/* Overview */}
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
            {/* Comments */}
            <input
              type="radio"
              name="lesson_tabs"
              className="tab"
              aria-label="Comments"
            />
            <div className="tab-content px-3 py-4">
              <h2 className="text-xl font-semibold mb-6">Comments</h2>
              <LessonCommentList lessonId={lesson?.id} />
            </div>
            {/* Reviews */}
            <input
              type="radio"
              name="lesson_tabs"
              className="tab"
              aria-label="Reviews"
            />
            <div className="tab-content px-3 py-4">
              <h2 className="text-xl font-semibold mb-6">Reviews</h2>
              <CourseReviewList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
