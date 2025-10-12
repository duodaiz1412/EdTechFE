import {Review} from "@/types";
import {useEffect, useState} from "react";
import CourseReviewItem from "./CourseReviewItem";
import CourseMyReview from "./CourseMyReview";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {reviewServices} from "@/lib/services/review.services";
import {useParams} from "react-router-dom";
import {publicServices} from "@/lib/services/public.services";
import ReadOnlyRating from "@/components/ReadOnlyRating";
import {SquarePen, Trash2} from "lucide-react";

export default function CourseReviewList() {
  const {courseSlug} = useParams();
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessToken();
      const getMyReview = await reviewServices.getMyReview(
        accessToken,
        courseSlug!,
      );
      setMyReview(getMyReview);

      const getAllReviews = await publicServices.getReviews(courseSlug!);
      setReviews(getAllReviews.content);
    };

    fetchData();
  }, [courseSlug]);

  const handleDelete = async () => {
    const confirm = window.confirm("Delete your review?");
    if (!confirm) return;

    const accessToken = await getAccessToken();
    await reviewServices.deleteReview(accessToken, myReview!.id!);
    setReviews(reviews.filter((review) => review.id !== myReview!.id));
    setMyReview(null);
  };

  return (
    <div className="space-y-4">
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
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content w-10 rounded-full">
                <span className="text-xl">{myReview.studentName?.[0]}</span>
              </div>
            </div>
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
