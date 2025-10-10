export default function CourseNewReview({
  setIsRating,
}: {
  setIsRating: (value: boolean) => void;
}) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 bg-black bg-opacity-30">
      <div className="w-96 flex flex-col space-y-4 bg-white p-4 rounded-md">
        <h4 className="text-center text-lg font-semibold">Your rating</h4>
        <div className="rating rating-lg rating-half justify-center">
          <input type="radio" name="rating-11" className="rating-hidden" />
          <input
            type="radio"
            name="rating-11"
            className="mask mask-star-2 mask-half-1 bg-orange-400"
            aria-label="0.5 star"
          />
          <input
            type="radio"
            name="rating-11"
            className="mask mask-star-2 mask-half-2 bg-orange-400"
            aria-label="1 star"
          />
          <input
            type="radio"
            name="rating-11"
            className="mask mask-star-2 mask-half-1 bg-orange-400"
            aria-label="1.5 star"
          />
          <input
            type="radio"
            name="rating-11"
            className="mask mask-star-2 mask-half-2 bg-orange-400"
            aria-label="2 star"
          />
          <input
            type="radio"
            name="rating-11"
            className="mask mask-star-2 mask-half-1 bg-orange-400"
            aria-label="2.5 star"
          />
          <input
            type="radio"
            name="rating-11"
            className="mask mask-star-2 mask-half-2 bg-orange-400"
            aria-label="3 star"
          />
          <input
            type="radio"
            name="rating-11"
            className="mask mask-star-2 mask-half-1 bg-orange-400"
            aria-label="3.5 star"
          />
          <input
            type="radio"
            name="rating-11"
            className="mask mask-star-2 mask-half-2 bg-orange-400"
            aria-label="4 star"
          />
          <input
            type="radio"
            name="rating-11"
            className="mask mask-star-2 mask-half-1 bg-orange-400"
            aria-label="4.5 star"
          />
          <input
            type="radio"
            name="rating-11"
            className="mask mask-star-2 mask-half-2 bg-orange-400"
            aria-label="5 star"
            defaultChecked
          />
        </div>
        <textarea
          className="textarea w-full"
          placeholder="New review..."
        ></textarea>
        <div className="flex justify-end space-x-4 w-full">
          <button className="btn btn-neutral">Send</button>
          <button className="btn" onClick={() => setIsRating(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
