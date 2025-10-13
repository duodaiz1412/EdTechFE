import MuxPlayer from "@mux/mux-player-react";

interface CourseLessonVideoProps {
  videoUrl?: string | null;
  videoTitle?: string;
  onEnded?: () => void;
}

export default function CourseLessonVideo({
  videoUrl,
  videoTitle = "Video title",
  onEnded,
}: CourseLessonVideoProps) {
  return (
    <MuxPlayer
      src={videoUrl || "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"}
      onEnded={onEnded}
      videoTitle={videoTitle}
      className="w-5/6 min-h-[600px]"
      accentColor="#2b7fff"
      thumbnailTime={5}
    />
  );
}
