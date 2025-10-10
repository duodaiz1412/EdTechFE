import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {Chapter, Lesson, LessonIndex, Progress} from "@/types";

import CourseNavbar from "./components/Course/CourseNavbar";
import CourseSidebar from "./components/Course/CourseSidebar";
import CourseLesson from "@/pages/Course/CourseLesson";

import {publicServices} from "@/lib/services/public.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {progressServices} from "@/lib/services/progress.services";
import {getCurrentLesson} from "@/lib/utils/getCurrentLesson";
import {isLessonCompleted} from "@/lib/utils/isLessonCompleted";

export default function CourseLayout() {
  const [progress, setProgress] = useState<Progress>();
  const [chapters, setChapters] = useState<Chapter[]>();
  const [lesson, setLesson] = useState<Lesson>();
  const [currentLesson, setCurrentLesson] = useState<LessonIndex>();
  const {courseId, lessonId} = useParams();

  useQuery({
    queryKey: ["chapters"],
    queryFn: async () => {
      const getChapters = await publicServices.getChapters(courseId as string);
      setChapters(getChapters);
      return getChapters;
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessToken();
      const getProgress = await progressServices.getProgress(
        courseId as string,
        accessToken,
      );
      setProgress(getProgress);
      setCurrentLesson(getCurrentLesson(chapters, lessonId));
    };

    fetchData();
  }, [courseId, lessonId, chapters]);

  return (
    <div>
      <CourseNavbar
        courseName={progress?.courseTitle}
        totalLessons={progress?.totalLessons}
        completedLessons={progress?.completedLessons}
        progressPercent={progress?.overallProgress}
      />
      <div className="fixed top-16 bottom-0 left-0 right-0 flex">
        <main className="w-3/4 h-full overflow-y-scroll">
          <CourseLesson
            lesson={currentLesson?.lesson}
            status={isLessonCompleted(lessonId!, chapters)}
          />
        </main>
        <CourseSidebar chapters={chapters} currentLesson={currentLesson} />
      </div>
    </div>
  );
}
