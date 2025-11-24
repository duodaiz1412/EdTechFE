import {Link} from "react-router-dom";

import {Batch} from "@/types";
import {formatPrice} from "@/lib/utils/formatPrice";

interface BatchItemProps {
  batch: Batch;
  isEnrolled?: boolean;
}

export default function BatchItem({batch}: BatchItemProps) {
  return (
    <Link
      key={batch.id}
      to={`/batch/${batch.slug}`}
      className="card border border-slate-200 shadow-sm hover:-translate-y-1 transition-all overflow-hidden"
    >
      {/* Course image */}
      <figure className="h-56 border-b border-b-slate-200">
        {batch.image && (
          <img className="w-full h-full object-cover" src={batch.image} />
        )}
        {!batch.image && (
          <div className="w-full h-full bg-slate-100 flex justify-center items-center text-slate-500">
            No image
          </div>
        )}
      </figure>
      {/* batch info */}
      <div className="card-body">
        <h2 className="card-title">{batch.title}</h2>
        <div className="flex space-x-2 items-start"></div>

        {
          <span className="text-lg font-bold">
            {batch.paidBatch && formatPrice(batch.sellingPrice, "VND")}
            {!batch.paidBatch && "Free"}
          </span>
        }
      </div>
    </Link>
  );
}
