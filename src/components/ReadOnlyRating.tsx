interface RatingProps {
  rating: number | null;
  size?: "xs" | "sm" | "md" | "lg";
}

export default function ReadOnlyRating({rating, size = "xs"}: RatingProps) {
  return (
    <div className={`flex items-center rating rating-${size}`}>
      {rating !== null && (
        <>
          <div
            className="mask mask-star-2 bg-orange-600"
            aria-label="1 star"
            aria-current={rating >= 1 && rating < 2}
          ></div>
          <div
            className="mask mask-star-2 bg-orange-600"
            aria-label="2 star"
            aria-current={rating >= 2 && rating < 3}
          ></div>
          <div
            className="mask mask-star-2 bg-orange-600"
            aria-label="3 star"
            aria-current={rating >= 3 && rating < 4}
          ></div>
          <div
            className="mask mask-star-2 bg-orange-600"
            aria-label="4 star"
            aria-current={rating >= 4 && rating < 5}
          ></div>
          <div
            className="mask mask-star-2 bg-orange-600"
            aria-label="5 star"
            aria-current={rating == 5}
          ></div>
        </>
      )}
      {rating === null && (
        <>
          <div
            className="mask mask-star-2 bg-orange-600"
            aria-label="1 star"
          ></div>
          <div
            className="mask mask-star-2 bg-orange-600"
            aria-label="2 star"
          ></div>
          <div
            className="mask mask-star-2 bg-orange-600"
            aria-label="3 star"
          ></div>
          <div
            className="mask mask-star-2 bg-orange-600"
            aria-label="4 star"
          ></div>
          <div
            className="mask mask-star-2 bg-orange-600"
            aria-label="5 star"
          ></div>
        </>
      )}
    </div>
  );
}
