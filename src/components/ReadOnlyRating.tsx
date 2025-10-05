interface RatingProps {
  rating: number | null;
  size?: "xs" | "sm" | "md" | "lg";
}

export default function ReadOnlyRating({rating, size = "md"}: RatingProps) {
  return (
    <div className={`rating rating-half rating-${size}`}>
      {rating !== null ? (
        <>
          <div
            className="mask mask-star-2 mask-half-1 bg-orange-400"
            aria-current={rating >= 0.5 && "true"}
          ></div>
          <div
            className="mask mask-star-2 mask-half-2 bg-orange-400"
            aria-current={rating >= 1 && "true"}
          ></div>
          <div
            className="mask mask-star-2 mask-half-1 bg-orange-400"
            aria-current={rating >= 1.5 && "true"}
          ></div>
          <div
            className="mask mask-star-2 mask-half-2 bg-orange-400"
            aria-current={rating >= 2 && "true"}
          ></div>
          <div
            className="mask mask-star-2 mask-half-1 bg-orange-400"
            aria-current={rating >= 2.5 && "true"}
          ></div>
          <div
            className="mask mask-star-2 mask-half-2 bg-orange-400"
            aria-current={rating >= 3 && "true"}
          ></div>
          <div
            className="mask mask-star-2 mask-half-1 bg-orange-400"
            aria-current={rating >= 3.5 && "true"}
          ></div>
          <div
            className="mask mask-star-2 mask-half-2 bg-orange-400"
            aria-current={rating >= 4 && "true"}
          ></div>
          <div
            className="mask mask-star-2 mask-half-1 bg-orange-400"
            aria-current={rating >= 4.5 && "true"}
          ></div>
          <div
            className="mask mask-star-2 mask-half-2 bg-orange-400"
            aria-current={rating === 5 && "true"}
          ></div>
        </>
      ) : (
        <>
          <div
            className="mask mask-star-2 bg-orange-400"
            aria-label="1 star"
          ></div>
          <div
            className="mask mask-star-2 bg-orange-400"
            aria-label="2 star"
          ></div>
          <div
            className="mask mask-star-2 bg-orange-400"
            aria-label="3 star"
          ></div>
          <div
            className="mask mask-star-2 bg-orange-400"
            aria-label="4 star"
          ></div>
          <div
            className="mask mask-star-2 bg-orange-400"
            aria-label="5 star"
          ></div>
        </>
      )}
    </div>
  );
}
