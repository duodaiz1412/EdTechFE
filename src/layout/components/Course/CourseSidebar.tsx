import {Chapter, LessonCurrent} from "@/types";
import {LessonChatWidget} from "@/components/Chat/LessonChatWidget";

interface CourseSidebarProps {
  chapters?: Chapter[];
  currentLesson?: LessonCurrent;
  lessonId?: string;
}

export default function CourseSidebar({
  chapters,
  currentLesson,
  lessonId,
}: CourseSidebarProps) {
  return (
    <div className="w-1/4 h-full flex flex-col border-l border-l-slate-200">
      {lessonId && (
        <LessonChatWidget
          lessonId={lessonId}
          chapters={chapters}
          currentLesson={currentLesson}
        />
      )}
    </div>
  );
}
