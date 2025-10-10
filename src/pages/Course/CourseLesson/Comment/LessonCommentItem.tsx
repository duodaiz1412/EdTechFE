import {Comment} from "@/types";
import {Reply, ThumbsDown, ThumbsUp} from "lucide-react";
import {useState} from "react";

interface LessonCommentItemProps {
  comment: Comment;
  replyTo?: Comment;
}

export default function LessonCommentItem({
  comment,
  replyTo,
}: LessonCommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);

  return (
    <>
      <div className="flex rounded-md border border-slate-300">
        {/* Name, avatar */}
        <div className="w-1/6 p-4 flex flex-col items-center space-y-2 bg-slate-200">
          <div
            className={`avatar ${comment.authorImage ? "" : "avatar-placeholder"}`}
          >
            {comment.authorImage && (
              <div className="w-10 rounded-full">
                <img src={comment.authorImage} />
              </div>
            )}
            {!comment.authorImage && (
              <div className="bg-neutral text-neutral-content w-10 rounded-full">
                <span className="text-xl">{comment.authorName?.[0]}</span>
              </div>
            )}
          </div>
          <p className="text-center font-semibold">{comment.authorName}</p>
        </div>
        {/* Comment content */}
        <div className="w-5/6 p-4 space-y-4">
          {/* Reply comment */}
          {replyTo && (
            <div className="p-2 space-y-1 text-sm italic bg-slate-200 border-l-2 border-l-blue-500">
              <p className="font-semibold">{replyTo.authorName} said:</p>
              <p>{replyTo.content}</p>
            </div>
          )}
          {/* Actual comment */}
          <p>{comment.content}</p>
          {/* Functional buttons */}
          <div className="flex justify-end space-x-2">
            {/* Reply comment */}
            {!isReplying && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setIsReplying(true)}
              >
                <Reply size={20} />
                <span>Reply</span>
              </button>
            )}
            {/* Vote comment */}
            <button className="btn btn-ghost btn-sm">
              <ThumbsUp size={20} />
              <span>{comment.upvotes}</span>
            </button>
            <button className="btn btn-ghost btn-sm">
              <ThumbsDown size={20} />
              <span>{comment.downvotes}</span>
            </button>
          </div>
        </div>
      </div>
      {/* Reply box */}
      {isReplying && (
        <div className="flex">
          <div className="w-1/6"></div>
          <div className="w-5/6 border border-slate-200 px-4 py-2 space-y-2 rounded-md">
            <p className="font-semibold">Reply to {comment.authorName}:</p>
            <textarea
              className="textarea w-full"
              placeholder="Reply message"
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button className="btn btn-neutral">Send</button>
              <button className="btn" onClick={() => setIsReplying(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
