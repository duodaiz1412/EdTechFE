import ReadOnlyRating from "@/components/ReadOnlyRating";
import {Review} from "@/types";

export default function CourseReviewItem({review}: {review: Review}) {
  return (
    <div className="flex rounded-md border border-slate-300">
      {/* Name, avatar */}
      <div className="w-1/6 p-4 flex flex-col items-center space-y-2 bg-slate-200">
        <div className="avatar avatar-placeholder">
          <div className="bg-neutral text-neutral-content w-10 rounded-full">
            <span className="text-xl">{review.studentName?.[0]}</span>
          </div>
        </div>
        <p className="text-center font-semibold">{review.studentName}</p>
      </div>
      {/* Review content */}
      <div className="w-5/6 p-4 space-y-4">
        {/* Review star */}
        <ReadOnlyRating rating={review.rating || null} size="sm" />
        {/* Actual comment */}
        <p>{review.comment}</p>
      </div>
    </div>
  );
}
