import {cn} from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({className, width, height}: SkeletonProps) {
  return (
    <div
      className={cn("bg-gray-200 rounded animate-pulse", className)}
      style={{
        width:
          width !== undefined
            ? typeof width === "number"
              ? `${width}px`
              : width
            : undefined,
        height:
          height !== undefined
            ? typeof height === "number"
              ? `${height}px`
              : height
            : undefined,
      }}
    />
  );
}
