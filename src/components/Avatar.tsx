import {useEffect, useState} from "react";
import {getFileUrlFromMinIO} from "@/lib/services/upload.services";

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
  const [finalUrl, setFinalUrl] = useState<string>();

  useEffect(() => {
    async function fetchImage() {
      if (imageUrl) {
        const url = await getFileUrlFromMinIO(imageUrl);
        setFinalUrl(url.uploadUrl);
      }
    }
    fetchImage();
  }, [imageUrl]);

  return (
    <div className={`avatar ${finalUrl ? "" : "avatar-placeholder"}`}>
      {finalUrl && (
        <div className={`${isBig ? "w-16" : "w-10"} rounded-full`}>
          <img src={imageUrl} />
        </div>
      )}
      {!finalUrl && (
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
