import {Skeleton} from "@/components/Skeleton";

interface CourseSkeletonProps {
  count?: number;
}

export function CourseSkeleton({count = 8}: CourseSkeletonProps) {
  return (
    <div className="grid grid-cols-3 gap-4" role="status" aria-live="polite">
      {Array.from({length: count}).map((_, index) => (
        <div
          key={index}
          className="card border border-slate-300 shadow-sm overflow-hidden"
        >
          {/* Course image skeleton */}
          <figure className="h-56 border-b border-b-slate-200">
            <Skeleton className="w-full h-full" />
          </figure>
          {/* Course info skeleton */}
          <div className="card-body space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex space-x-2 items-center">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
