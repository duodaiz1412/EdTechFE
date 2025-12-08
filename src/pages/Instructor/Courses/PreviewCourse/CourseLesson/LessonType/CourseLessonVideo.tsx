import {useEffect, useState, useRef} from "react";
import MuxPlayer from "@mux/mux-player-react";
import {getFileUrl} from "@/lib/services/upload.services";

interface CourseLessonVideoProps {
  videoObjectName?: string | null;
  videoTitle?: string;
}

export default function CourseLessonVideo({
  videoObjectName,
  videoTitle = "Video title",
}: CourseLessonVideoProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const currentObjectNameRef = useRef<string | null>(null);

  useEffect(() => {
    // Reset mounted flag
    isMountedRef.current = true;

    const fetchVideoUrl = async () => {
      if (!videoObjectName) {
        if (isMountedRef.current) {
          setVideoUrl(null);
          currentObjectNameRef.current = null;
        }
        return;
      }

      // Nếu đã fetch objectName này rồi, không fetch lại
      if (currentObjectNameRef.current === videoObjectName) {
        return;
      }

      // Đánh dấu objectName hiện tại
      currentObjectNameRef.current = videoObjectName;

      try {
        const url = await getFileUrl(videoObjectName);
        // Chỉ set state nếu component vẫn mounted và objectName vẫn là objectName hiện tại
        if (
          isMountedRef.current &&
          currentObjectNameRef.current === videoObjectName
        ) {
          setVideoUrl(url);
        }
      } catch {
        // Ignore errors if component unmounted or objectName changed
        if (
          isMountedRef.current &&
          currentObjectNameRef.current === videoObjectName
        ) {
          setVideoUrl(null);
        }
      }
    };

    fetchVideoUrl();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [videoObjectName]);

  if (!videoUrl) {
    return (
      <div className="w-5/6 min-h-[600px] flex items-center justify-center bg-gray-900 text-white">
        <p>Loading video...</p>
      </div>
    );
  }

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
