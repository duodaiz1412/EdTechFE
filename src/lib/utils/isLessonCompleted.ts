import {Chapter} from "@/types";

export const isLessonCompleted = (lessonId: string, chapters?: Chapter[]) => {
  if (chapters) {
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      if (chapter.lessons) {
        for (let j = 0; j < chapter.lessons.length; j++) {
          const lesson = chapter.lessons[j];
          if (lesson.id === lessonId) {
            return true;
          }
        }
      }
    }
  }
  return false;
};
