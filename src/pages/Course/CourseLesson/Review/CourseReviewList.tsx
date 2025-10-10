import {Review} from "@/types";
import {useEffect, useState} from "react";
import {reviews as mockReviews} from "@/mockData/reviews";
import CourseReviewItem from "./CourseReviewItem";
import CourseNewReview from "./CourseNewReview";

export default function CourseReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isRating, setIsRating] = useState(false);

  useEffect(() => {
    setReviews(mockReviews);
  }, []);

  return (
    <div className="space-y-4">
      {/* New review */}
      <h3>New review</h3>
      {!isRating && (
        <button className="btn btn-neutral" onClick={() => setIsRating(true)}>
          Add Review
        </button>
      )}
      {isRating && <CourseNewReview setIsRating={setIsRating} />}
      {/* List review */}
      <h3 className="pt-4">All reviews ({reviews.length})</h3>
      {reviews.map((review) => (
        <CourseReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
}
