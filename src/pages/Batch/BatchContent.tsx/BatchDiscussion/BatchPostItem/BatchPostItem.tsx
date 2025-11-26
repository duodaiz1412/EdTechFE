import {BatchPost} from "@/types";
import {MessageSquare} from "lucide-react";
import BatchPostContent from "./BatchPostContent";
import BatchPostDetail from "./BatchPostDetail";
import {useState} from "react";

interface BatchPostItemProps {
  post: BatchPost;
  batchId?: string;
}

export default function BatchPostItem({post, batchId}: BatchPostItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Current post */}
      <div className="border border-slate-200 bg-white rounded-lg pt-6 mb-4">
        <BatchPostContent post={post} />
        <div className="py-6 px-6 border-t border-t-slate-200">
          <button
            className="text-slate-900 hover:text-slate-700 font-semibold text-sm space-x-2 flex items-center"
            onClick={() => setIsOpen(true)}
          >
            <MessageSquare size={16} />
            <span>View replies</span>
          </button>
        </div>
      </div>
      {/* View replies */}
      {isOpen && (
        <BatchPostDetail post={post} batchId={batchId} setIsOpen={setIsOpen} />
      )}
    </>
  );
}
