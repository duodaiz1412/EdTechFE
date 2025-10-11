import ReadOnlyRating from "@/components/ReadOnlyRating";
import {Review} from "@/types";

export default function CourseReviewItem({review}: {review: Review}) {
  return (
    <div className="p-4 rounded-lg bg-slate-200 flex">
      <div className="w-10">
        <div className="avatar avatar-placeholder">
          <div className="bg-neutral text-neutral-content w-10 rounded-full">
            <span className="text-xl">{review.studentName?.[0]}</span>
          </div>
        </div>
      </div>
      <div className="px-4 space-y-2 w-full">
        <p className="font-semibold">{review.studentName}</p>
        <ReadOnlyRating rating={review.rating!} size="sm" />
        <p>{review.comment}</p>
      </div>
    </div>
  );
}
