import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import {Review} from "@/types";

import {SquarePen, Trash2} from "lucide-react";
import Avatar from "@/components/Avatar";
import ReadOnlyRating from "@/components/ReadOnlyRating";
import CourseReviewItem from "./CourseReviewItem";
import CourseMyReview from "./CourseMyReview";

export default function CourseReviewList() {
  const {courseSlug} = useParams();
  const [myReview, setMyReview] = useState<Review>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Preview mode - show sample reviews
    const sampleReviews: Review[] = [
      {
        id: "1",
        studentName: "John Doe",
        rating: 5,
        comment: "Excellent course! Very well structured and easy to follow.",
      },
      {
        id: "2",
        studentName: "Jane Smith", 
        rating: 4,
        comment: "Good content but could use more examples in the later chapters.",
      },
      {
        id: "3",
        studentName: "Mike Johnson",
        rating: 5,
        comment: "Amazing instructor and great learning materials!",
      },
    ];
    setReviews(sampleReviews);
  }, [courseSlug]);

  const handleDelete = async () => {
    const confirm = window.confirm("Delete your review?");
    if (!confirm) return;
    // Preview mode - simulate deleting review
    setReviews(reviews.filter((review) => review.id !== myReview!.id));
    setMyReview(undefined);
  };

  return (
    <div className="space-y-4 h-[600px] overflow-y-auto custom-scrollbar">
      {/* My review */}
      <h3>Your review</h3>
      {!myReview && (
        <button className="btn btn-neutral" onClick={() => setIsEditing(true)}>
          Rate this course
        </button>
      )}
      {myReview && (
        <div className="p-4 rounded-lg bg-slate-200 flex">
          <div className="w-10">
            <Avatar name={myReview.studentName} />
          </div>
          <div className="px-4 space-y-2 w-full">
            <p className="font-semibold">{myReview.studentName}</p>
            <ReadOnlyRating rating={myReview.rating!} size="sm" />
            <p>{myReview.comment}</p>
          </div>
          <div className="flex justify-center items-center space-x-4">
            <button onClick={() => setIsEditing(true)}>
              <SquarePen size={20} />
            </button>
            <button onClick={handleDelete}>
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      )}
      {isEditing && (
        <CourseMyReview
          myReview={myReview}
          setIsEditing={setIsEditing}
          setMyReview={setMyReview}
        />
      )}
      {/* All reviews */}
      <h3 className="pt-4">All reviews ({reviews.length})</h3>
      {reviews &&
        reviews.map((review) => (
          <CourseReviewItem key={review.id} review={review} />
        ))}
    </div>
  );
}
