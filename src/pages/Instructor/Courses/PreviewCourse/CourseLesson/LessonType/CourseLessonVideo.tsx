import MuxPlayer from "@mux/mux-player-react";

interface CourseLessonVideoProps {
  videoUrl?: string | null;
  videoTitle?: string;
}

export default function CourseLessonVideo({
  videoUrl,
  videoTitle = "Video title",
}: CourseLessonVideoProps) {
  return (
    <MuxPlayer
      src={videoUrl}
      videoTitle={videoTitle}
      streamType="on-demand"
      className="w-5/6 min-h-[600px]"
      preferPlayback="mse"
      accentColor="#2b7fff"
      thumbnailTime={5}
    />
  );
}
