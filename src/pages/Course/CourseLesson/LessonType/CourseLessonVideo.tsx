import MuxPlayer from "@mux/mux-player-react";

interface CourseLessonVideoProps {
  videoUrl?: string;
  videoTitle?: string;
  onEnded?: () => void;
}

export default function CourseLessonVideo({
  videoUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  videoTitle = "Video title",
  onEnded,
}: CourseLessonVideoProps) {
  return (
    <MuxPlayer
      src={videoUrl}
      onEnded={onEnded}
      videoTitle={videoTitle}
      className="w-5/6 h-auto"
      accentColor="#2b7fff"
      thumbnailTime={5}
    />
  );
}
