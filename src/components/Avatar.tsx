interface AvatarProps {
  imageUrl?: string;
  isBig?: boolean;
  name?: string;
}

export default function Avatar({
  imageUrl,
  isBig,
  name = "Anonymous",
}: AvatarProps) {
  return (
    <div className={`avatar ${imageUrl ? "" : "avatar-placeholder"}`}>
      {imageUrl && (
        <div className={`${isBig ? "w-16" : "w-10"} rounded-full`}>
          <img src={imageUrl} />
        </div>
      )}
      {!imageUrl && (
        <div
          className={`bg-black text-neutral-content ${isBig ? "w-16" : "w-10"} rounded-full`}
        >
          <span className={`${isBig ? "text-2xl" : "text-xl"}`}>
            {name?.[0]}
          </span>
        </div>
      )}
    </div>
  );
}
