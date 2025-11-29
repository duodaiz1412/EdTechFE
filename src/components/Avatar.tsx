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
          className={`bg-blue-500 text-neutral-content ${isBig ? "w-16" : "w-10"} rounded-full`}
        >
          <span className="text-xl">{name?.[0]}</span>
        </div>
      )}
    </div>
  );
}
