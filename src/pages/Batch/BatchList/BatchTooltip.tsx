import ReactPlayer from "react-player";
import HtmlDisplay from "@/components/HtmlDisplay";
import {Batch} from "@/types";

interface BatchTooltipProps {
  batch: Batch;
  isEnrolled?: boolean;
}

export function BatchTooltip({batch}: BatchTooltipProps) {
  return (
    <div className="w-96 p-0 bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Video Preview */}
      <div className="w-full h-48 bg-slate-900 flex items-center justify-center">
        {batch?.videoLink ? (
          <ReactPlayer
            src={batch?.videoLink}
            className="h-full object-cover"
            autoPlay
          />
        ) : (
          <div className="text-slate-600">No video available</div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title and Introduction */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 leading-tight">
            {batch.title}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            <span className="font-semibold">Duration: </span>
            {new Date(batch?.startTime || "").toLocaleDateString(
              "vi-VN",
            )} - {new Date(batch?.endTime || "").toLocaleDateString("vi-VN")}
          </p>
        </div>

        {/* Language Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Language:
          </span>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
            {batch.language}
          </span>
        </div>

        {/* Description */}
        <div className="max-h-32 overflow-y-auto text-sm text-slate-700 leading-relaxed border-t border-slate-200 pt-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <HtmlDisplay html={batch.description || ""} />
        </div>

        {/* Enroll Button */}
        {/* {!isEnrolled && (
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
            Enroll this batch
          </button>
        )}
        {isEnrolled && (
          <div className="w-full bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg text-center">
            You enrolled this batch
          </div>
        )} */}
      </div>
    </div>
  );
}
