import {useQuery} from "@tanstack/react-query";
import MuxPlayer from "@mux/mux-player-react";

import {getFileUrlFromMinIO} from "@/lib/services/upload.services";
import {useEffect, useState} from "react";

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
  const [counter, setCounter] = useState(0);
  const {data, isLoading} = useQuery({
    queryKey: ["video-lesson-url", videoUrl],
    queryFn: async () => {
      if (!videoUrl) return "";

      const finalUrl = await getFileUrlFromMinIO(videoUrl);
      return finalUrl.uploadUrl;
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [data]);

  useEffect(() => {
    if (counter > 5) {
      if (completeLesson) {
        completeLesson();
      }
    }
  }, [counter, completeLesson]);

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
