import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Tooltip} from "react-tooltip";

import {Batch} from "@/types";
import {getFileUrlFromMinIO} from "@/lib/services/upload.services";
import {formatPrice} from "@/lib/utils/formatPrice";
import {BatchTooltip} from "./BatchTooltip";

interface BatchItemProps {
  batch: Batch;
  isEnrolled?: boolean;
}

export default function BatchItem({batch, isEnrolled}: BatchItemProps) {
  const [imgLink, setImgLink] = useState<string>();

  useEffect(() => {
    async function fetchImage() {
      if (batch.image) {
        const imgLink = await getFileUrlFromMinIO(batch.image);
        setImgLink(imgLink.uploadUrl);
      }
    }
    fetchImage();
  }, [batch.image]);

  return (
    <>
      <Link
        key={batch.id}
        to={`/batch/${batch.slug}`}
        className="bg-base-50 border border-slate-300 rounded-lg overflow-hidden"
        data-tooltip-id={`batch-tooltip-${batch.id}`}
      >
        {/* Course image */}
        <figure className="h-56 border-b border-b-slate-200">
          {imgLink && (
            <img className="w-full h-full object-cover" src={imgLink} />
          )}
          {!imgLink && (
            <div className="w-full h-full bg-slate-100 flex justify-center items-center text-slate-500">
              No image
            </div>
          )}
        </figure>
        {/* batch info */}
        <div className="card-body">
          <h2 className="card-title">{batch.title}</h2>
          <div className="flex space-x-2 items-start"></div>
          {isEnrolled && (
            <div className="badge bg-blue-600 text-white">Enrolled</div>
          )}
          {!isEnrolled && (
            <span className="text-lg font-bold">
              {batch.paidBatch &&
                formatPrice(batch.sellingPrice, batch.currency)}
              {!batch.paidBatch && "Free"}
            </span>
          )}
        </div>
      </Link>
      <Tooltip
        id={`batch-tooltip-${batch.id}`}
        place="right-start"
        variant="light"
        className="!p-0 border-0 shadow-xl"
        opacity={1}
        clickable
        delayShow={50}
      >
        <BatchTooltip batch={batch} />
      </Tooltip>
    </>
  );
}
