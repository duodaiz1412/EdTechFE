import {Comment} from "@/types";
import {ArrowBigDown, ArrowBigUp, Reply, SquarePen, Trash2} from "lucide-react";
import {useState} from "react";

interface LessonCommentItemProps {
  order: number;
  comment: Comment;
  isOwnComment: boolean;
  handleNewComment: (content: string, parentId?: string) => void;
  handleEditComment: (
    order: number,
    commentId: string,
    content: string,
    parentId?: string,
  ) => void;
  handleDeleteComment: (order: number, commentId: string) => void;
  handleVote: (
    order: number,
    commentId: string,
    type: "UPVOTE" | "DOWNVOTE",
  ) => void;
  replyTo?: Comment;
}

export default function LessonCommentItem({
  order,
  comment,
  isOwnComment,
  handleNewComment,
  handleEditComment,
  handleDeleteComment,
  handleVote,
  replyTo,
}: LessonCommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyComment, setReplyComment] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState(comment.content || "");

  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);

  const handleReply = async (commentId: string) => {
    handleNewComment(replyComment, commentId);
    setReplyComment("");
    setIsReplying(false);
  };

  const handleEdit = async () => {
    handleEditComment(order, comment.id, editComment, comment.parentId);
    setIsEditing(false);
  };

  const handleUpvote = async () => {
    handleVote(order, comment.id, "UPVOTE");
    setIsUpvoted((prev) => !prev);
  };

  const handleDownvote = async () => {
    handleVote(order, comment.id, "DOWNVOTE");
    setIsDownvoted((prev) => !prev);
  };

  return (
    <div id={`comment-${comment.id}`}>
      {/* Comment content box */}
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
          {/* Time */}
          <span className="text-sm font-semibold">
            {new Date(comment.modified!).toLocaleDateString("vi-VN")}
          </span>
          {/* Reply comment */}
          {replyTo && (
            <a
              href={`#comment-${replyTo.id}`}
              className="block p-2 space-y-1 text-sm italic bg-slate-200 border-l-4 border-l-blue-500 rounded-md"
            >
              <p className="font-semibold">{replyTo.authorName} said:</p>
              <p>{replyTo.content}</p>
            </a>
          )}
          {/* Actual comment */}
          {!isEditing && <p>{comment.content}</p>}
          {isEditing && (
            <div className="space-y-2">
              <textarea
                className="textarea w-full"
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                placeholder="Edit your comment"
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button className="btn btn-neutral" onClick={handleEdit}>
                  Save
                </button>
                <button className="btn" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
          {/* Functional buttons */}
          <div className="flex justify-end items-center space-x-4">
            {/* Edit, delete */}
            {isOwnComment && (
              <>
                <button onClick={() => setIsEditing(true)}>
                  <SquarePen size={20} />
                </button>
                <button onClick={() => handleDeleteComment(order, comment.id)}>
                  <Trash2 size={20} />
                </button>
              </>
            )}
            {/* Reply comment */}
            <button onClick={() => setIsReplying(true)}>
              <Reply size={20} />
            </button>
            {/* Vote comment */}
            <button onClick={handleUpvote}>
              <ArrowBigUp
                size={20}
                className={`${isUpvoted && "fill-current text-green-500"}`}
              />
            </button>
            <span className="text-sm font-semibold">
              {Number(comment.upvotes) - Number(comment.downvotes)}
            </span>
            <button onClick={handleDownvote}>
              <ArrowBigDown
                size={20}
                className={`${isDownvoted && "fill-current text-red-500"}`}
              />
            </button>
          </div>
        </div>
      </div>
      {/* Reply box */}
      {isReplying && (
        <div className="flex">
          <div className="w-1/6"></div>
          <div className="w-5/6 border border-slate-200 p-4 mt-2 space-y-2 rounded-md">
            <p className="font-semibold">Reply to {comment.authorName}:</p>
            <textarea
              className="textarea w-full"
              placeholder="Reply message"
              value={replyComment}
              onChange={(e) => setReplyComment(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                className="btn btn-neutral"
                onClick={() => handleReply(comment.id)}
              >
                Reply
              </button>
              <button className="btn" onClick={() => setIsReplying(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
