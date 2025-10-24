import {reviewServices} from "@/lib/services/review.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {Review} from "@/types";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

interface CourseMyReviewProps {
  myReview?: Review;
  setIsEditing: (value: boolean) => void;
  setMyReview: (review: Review) => void;
}

export default function CourseMyReview({
  myReview,
  setIsEditing,
  setMyReview,
}: CourseMyReviewProps) {
  const {courseSlug} = useParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating || 5);
      setComment(myReview.comment || "");
    }
  }, [myReview]);

  const handleSubmit = async () => {
    const accessToken = await getAccessToken();
    let response;
    if (!myReview) {
      // create new review
      response = await reviewServices.createReview(
        accessToken,
        courseSlug!,
        rating,
        comment,
      );
    } else {
      // update review
      response = await reviewServices.updateReview(
        accessToken,
        myReview.id!,
        rating,
        comment,
      );
    }

    setMyReview(response);
    setIsEditing(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 bg-black bg-opacity-30">
      <div className="w-1/4 flex flex-col space-y-4 bg-white p-6 rounded-lg">
        <h4 className="text-center text-lg font-semibold">Your rating</h4>
        {/* Stars */}
        <div className="rating rating-lg justify-center">
          {[1, 2, 3, 4, 5].map((value) => (
            <input
              key={value}
              type="radio"
              name="rating-11"
              className={`mask mask-star-2 bg-orange-400`}
              aria-label={`${value} star`}
              defaultChecked={
                myReview ? value === myReview.rating : value === rating
              }
              value={value}
              onClick={() => setRating(Number(value))}
            />
          ))}
        </div>
        {/* Review comment */}
        <textarea
          className="textarea w-full"
          placeholder="Your review"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        {/* Functional buttons */}
        <div className="flex justify-end space-x-4 w-full">
          <button className="btn btn-neutral" onClick={handleSubmit}>
            Send
          </button>
          <button className="btn" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
