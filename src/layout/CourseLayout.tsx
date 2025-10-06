import CourseNavbar from "./components/Course/CourseNavbar";
import CourseSidebar from "./components/Course/CourseSidebar";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Chapter, CurrentLesson, Progress} from "@/types";
import {publicServices} from "@/lib/services/public.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {progressServices} from "@/lib/services/progress.services";
import CourseLesson from "@/pages/Course/CourseLesson";
import {getCurrentLesson} from "@/lib/utils/getCurrentLesson";

export default function CourseLayout() {
  const [progress, setProgress] = useState<Progress>();
  const [chapters, setChapters] = useState<Chapter[]>();
  const [currentLesson, setCurrentLesson] = useState<CurrentLesson>();
  const {courseId, lessonId} = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const getChapters = await publicServices.getChapters(courseId as string);
      setChapters(getChapters);

      const accessToken = await getAccessToken();
      const getProgress = await progressServices.getProgress(
        courseId as string,
        accessToken,
      );
      setProgress(getProgress);

      setCurrentLesson(getCurrentLesson(getChapters, lessonId));
    };

    fetchData();
  }, [courseId, lessonId]);

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
          <CourseLesson lesson={currentLesson?.lesson} />
        </main>
        <CourseSidebar chapters={chapters} currentLesson={currentLesson} />
      </div>
    </div>
  );
}
