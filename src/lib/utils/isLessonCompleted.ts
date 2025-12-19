import {Progress} from "@/types";

export const isLessonCompleted = (lessonId?: string, progress?: Progress) => {
  return (
    progress?.chapters?.some((chapter) =>
      chapter.lessons?.some(
        (lesson) =>
          lesson.lessonId === lessonId && lesson.status === "COMPLETE",
      ),
    ) || false
  );
};
