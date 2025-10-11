import {Progress} from "@/types";

export const isLessonCompleted = (lessonId?: string, progress?: Progress) => {
  if (progress && progress.chapters) {
    for (let i = 0; i < progress.chapters.length; i++) {
      const chapter = progress.chapters[i];
      if (chapter.lessons) {
        for (let j = 0; j < chapter.lessons.length; j++) {
          const lesson = chapter.lessons[j];
          if (lesson.lessonId === lessonId) {
            if (lesson.status === "COMPLETE") return true;
          }
        }
      }
    }
  }
  return false;
};
