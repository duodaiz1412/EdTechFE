import {PlayCircle} from "lucide-react";
import Button from "./Button";
import MuxPlayer from "@mux/mux-player-react/lazy";

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
                videoUrl || "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
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
