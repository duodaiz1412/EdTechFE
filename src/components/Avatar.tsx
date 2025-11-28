interface AvatarProps {
  imageUrl?: string;
  name?: string;
}

export default function Avatar({imageUrl, name = "Anonymous"}: AvatarProps) {
  return (
    <div className={`avatar ${imageUrl ? "" : "avatar-placeholder"}`}>
      {imageUrl && (
        <div className="w-10 rounded-full">
          <img src={imageUrl} />
        </div>
      )}
      {!imageUrl && (
        <div className="bg-blue-500 text-neutral-content w-10 rounded-full">
          <span className="text-xl">{name?.[0]}</span>
        </div>
      )}
    </div>
  );
}
