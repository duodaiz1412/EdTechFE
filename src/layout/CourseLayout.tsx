import {useParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
// import {useQuery} from "@tanstack/react-query";
import {useAppSelector} from "@/redux/hooks";

import {Chapter, Lesson, LessonCurrent, Progress} from "@/types";
import {publicServices} from "@/lib/services/public.services";
import {progressServices} from "@/lib/services/progress.services";
import {learnerServices} from "@/lib/services/learner.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {getCurrentLesson} from "@/lib/utils/getCurrentLesson";
import {isLessonCompleted} from "@/lib/utils/isLessonCompleted";
import {isCourseEnrolled} from "@/lib/utils/isCourseEnrolled";

import {Lock} from "lucide-react";
import CourseNavbar from "./components/Course/CourseNavbar";
import CourseSidebar from "./components/Course/CourseSidebar";
import CourseLesson from "@/pages/Course/CourseLesson";

export default function CourseLayout() {
  const {courseSlug, lessonSlug} = useParams();
  const userData = useAppSelector((state) => state.user.data);

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState<Progress>();
  const [chapters, setChapters] = useState<Chapter[]>();
  const [currentLesson, setCurrentLesson] = useState<LessonCurrent>();
  const [lesson, setLesson] = useState<Lesson>();

  const fetchChapters = useCallback(async () => {
    const getChapters = await publicServices.getChapters(courseSlug as string);
    setChapters(getChapters);
    setCurrentLesson(getCurrentLesson(getChapters, lessonSlug));
    setIsEnrolled(isCourseEnrolled(userData?.courseEnrollments, courseSlug));
  }, [courseSlug, lessonSlug, userData]);

  const fetchProgress = useCallback(async () => {
    const accessToken = await getAccessToken();
    const getProgress = await progressServices.getProgress(
      courseSlug as string,
      accessToken,
    );
    setProgress(getProgress);
  }, [courseSlug]);

  const fetchLesson = useCallback(async () => {
    const accessToken = await getAccessToken();
    const getLesson = await learnerServices.getLesson(accessToken, lessonSlug);
    setLesson(getLesson);
  }, [lessonSlug]);

  useEffect(() => {
    fetchChapters();
    fetchProgress();
    fetchLesson();
  }, [fetchChapters, fetchProgress, fetchLesson]);

  return (
    <div>
      <CourseNavbar
        courseName={progress?.courseTitle || "Back to course"}
        progressPercent={progress?.overallProgress}
        courseSlug={courseSlug}
      />

      <div className="fixed top-16 bottom-0 left-0 right-0 flex">
        <main className="w-3/4 h-full overflow-y-scroll">
          {!isEnrolled && (
            <div className="w-full h-full bg-slate-200 flex flex-col space-y-6 items-center justify-center text-slate-500">
              <Lock size={48} />
              <h3 className="text-lg font-semibold">
                Enroll this course to have full access
              </h3>
            </div>
          )}
          {isEnrolled && (
            <CourseLesson
              lesson={lesson}
              status={isLessonCompleted(lesson?.id, progress)}
            />
          )}
        </main>

        <CourseSidebar
          chapters={chapters}
          currentLesson={currentLesson}
          lessonId={lesson?.id}
        />
      </div>
    </div>
  );
}
