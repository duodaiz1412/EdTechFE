import {useEffect, useState, useRef} from "react";
import {PlayCircle} from "lucide-react";
import Button from "./Button";
import MuxPlayer from "@mux/mux-player-react/lazy";
import {getFileUrl} from "@/lib/services/upload.services";

interface VideoPreviewProps {
  videoUrl: string;
  onEdit: () => void;
  className?: string;
}

export default function VideoPreview({
  videoUrl,
  onEdit,
  className = "",
}: VideoPreviewProps) {
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState<string>("");
  const isMountedRef = useRef(true);
  const currentVideoUrlRef = useRef<string>("");

  useEffect(() => {
    // Reset mounted flag
    isMountedRef.current = true;

    const fetchVideoUrl = async () => {
      if (!videoUrl) {
        if (isMountedRef.current) {
          setResolvedVideoUrl("");
          currentVideoUrlRef.current = "";
        }
        return;
      }

      // Nếu đã là URL đầy đủ, sử dụng luôn
      if (videoUrl.startsWith("http://") || videoUrl.startsWith("https://")) {
        if (isMountedRef.current) {
          setResolvedVideoUrl(videoUrl);
          currentVideoUrlRef.current = videoUrl;
        }
        return;
      }

      // Nếu đã fetch URL này rồi, không fetch lại
      if (currentVideoUrlRef.current === videoUrl) {
        return;
      }

      // Đánh dấu videoUrl hiện tại
      currentVideoUrlRef.current = videoUrl;

      // Nếu là objectName, lấy URL từ API
      try {
        const url = await getFileUrl(videoUrl);
        // Chỉ set state nếu component vẫn mounted và videoUrl vẫn là videoUrl hiện tại
        if (isMountedRef.current && currentVideoUrlRef.current === videoUrl) {
          setResolvedVideoUrl(url);
        }
      } catch {
        // Ignore errors if component unmounted or videoUrl changed
        if (isMountedRef.current && currentVideoUrlRef.current === videoUrl) {
          setResolvedVideoUrl("");
        }
      }
    };

    fetchVideoUrl();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [videoUrl]);

  return (
    <div
      className={`flex items-center justify-between p-3 bg-blue-50 rounded-lg ${className}`}
    >
      <div className="flex items-center gap-3 w-full">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-row items-center gap-3 justify-between w-full">
            <div className="flex flex-row items-center gap-3">
              <PlayCircle size={20} className="text-blue-600" />
              <div className="flex flex-col">
                <p className="font-medium text-blue-900">Video preview</p>
                <p className="text-sm text-blue-700">
                  Click Edit to replace or update
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={onEdit}
              className="text-blue-700 hover:text-blue-800"
            >
              Edit
            </Button>
          </div>
          <div className="flex justify-center">
            <MuxPlayer
              src={
                resolvedVideoUrl ||
                "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
              }
              videoTitle="Video preview"
              className="w-2/3 aspect-video"
              accentColor="#2b7fff"
              thumbnailTime={5}
              preferPlayback="mse"
              defaultStreamType="on-demand"
              streamType="on-demand"
              loading="page"
              maxResolution="1440p"
              disableTracking
            />
          </div>
        </div>
      </div>
    </div>
  );
}
