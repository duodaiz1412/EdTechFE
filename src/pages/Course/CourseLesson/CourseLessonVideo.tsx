import MuxPlayer from "@mux/mux-player-react";

interface CourseLessonVideoProps {
  videoUrl?: string;
  videoTitle?: string;
  onEnded?: () => void;
}

export default function CourseLessonVideo({
  videoUrl = "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
  videoTitle = "Video title",
  onEnded,
}: CourseLessonVideoProps) {
  return (
    <MuxPlayer
      src={videoUrl}
      onEnded={onEnded}
      videoTitle={videoTitle}
      className="w-5/6 h-[600px]"
      accentColor="#2b7fff"
      thumbnailTime={5}
      autoPlay={true}
    />
  );
}
