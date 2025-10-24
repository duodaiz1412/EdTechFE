import MuxPlayer from "@mux/mux-player-react";

interface CourseLessonVideoProps {
  videoUrl?: string | null;
  videoTitle?: string;
  completeLesson?: () => void;
}

export default function CourseLessonVideo({
  videoUrl,
  videoTitle = "Video title",
  completeLesson,
}: CourseLessonVideoProps) {
  return (
    <MuxPlayer
      src={videoUrl}
      onEnded={completeLesson}
      videoTitle={videoTitle}
      streamType="on-demand"
      className="w-5/6 min-h-[600px]"
      preferPlayback="mse"
      accentColor="#2b7fff"
      thumbnailTime={5}
    />
  );
}
