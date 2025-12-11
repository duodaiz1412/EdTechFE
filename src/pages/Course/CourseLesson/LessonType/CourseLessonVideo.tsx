import {useQuery} from "@tanstack/react-query";
import MuxPlayer from "@mux/mux-player-react";

import {getFileUrlFromMinIO} from "@/lib/services/upload.services";

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
  const {data, isLoading} = useQuery({
    queryKey: ["video-lesson-url", videoUrl],
    queryFn: async () => {
      const finalUrl = await getFileUrlFromMinIO(videoUrl!);
      return finalUrl.uploadUrl;
    },
  });

  return (
    <>
      {isLoading && (
        <div className="w-5/6 h-[600px] text-white flex justify-center items-center">
          <div className="loading loading-lg"></div>
        </div>
      )}
      {!isLoading && (
        <MuxPlayer
          src={data}
          onEnded={completeLesson}
          videoTitle={videoTitle}
          streamType="on-demand"
          className="w-5/6 min-h-[600px]"
          preferPlayback="mse"
          accentColor="#2b7fff"
          thumbnailTime={5}
        />
      )}
    </>
  );
}
