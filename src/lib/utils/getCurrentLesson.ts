import {Chapter, LessonIndex} from "@/types";

export const getCurrentLesson = (
  chapters?: Chapter[],
  lessonId?: string | null,
): LessonIndex => {
  let currentLesson = {lesson: chapters?.[0]?.lessons?.[0], chapter: 1};
  for (let i = 0; i < (chapters?.length ?? 0); i++) {
    const chapter = chapters?.[i];
    for (let j = 0; j < (chapter?.lessons?.length ?? 0); j++) {
      const lesson = chapter?.lessons?.[j];
      if (lesson?.id === lessonId) {
        currentLesson = {lesson: lesson, chapter: i + 1};
        return currentLesson;
      }
    }
  }
  return currentLesson;
};
