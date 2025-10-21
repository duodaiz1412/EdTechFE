import {useEffect, useState} from "react";

import {Comment} from "@/types";

import Avatar from "@/components/Avatar";
import {ArrowBigDown, ArrowBigUp, Reply, SquarePen, Trash2} from "lucide-react";

interface LessonCommentItemProps {
  order: number;
  comment: Comment;
  isOwnComment: boolean;
  isOwnUpvoted?: boolean;
  handleNewComment: (content: string, parentId?: string) => void;
  handleEditComment: (
    order: number,
    commentId: string,
    content: string,
    parentId?: string,
  ) => void;
  handleDeleteComment: (order: number, commentId: string) => void;
  handleVote: (order: number, commentId: string, isUpvote: boolean) => void;
}

export default function LessonCommentItem({
  order,
  comment,
  isOwnComment,
  isOwnUpvoted,
  handleNewComment,
  handleEditComment,
  handleDeleteComment,
  handleVote,
}: LessonCommentItemProps) {
  const [replyTo, setReplyTo] = useState<Comment>();

  const [isReplying, setIsReplying] = useState(false);
  const [replyComment, setReplyComment] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState(comment.content || "");

  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);

  useEffect(() => {
    setIsUpvoted((isOwnUpvoted != undefined && isOwnUpvoted) || false);
    setIsDownvoted((isOwnUpvoted != undefined && !isOwnUpvoted) || false);
  }, [isOwnUpvoted]);

  // Preview mode - simulate reply to comment
  useEffect(() => {
    if (comment.parentId) {
      // Simulate finding parent comment
      setReplyTo({
        id: comment.parentId,
        content: "This is a sample parent comment for preview.",
        authorId: "parent-user",
        authorName: "Parent User",
        authorImage: null,
        creation: new Date(Date.now() - 7200000).toISOString(),
        upvotes: 2,
        downvotes: 0,
        parentId: null,
      });
    }
  }, [comment.parentId]);

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
    handleVote(order, comment.id, true);
    setIsUpvoted((prev) => !prev);
    if (isDownvoted) setIsDownvoted(false);
  };

  const handleDownvote = async () => {
    handleVote(order, comment.id, false);
    setIsDownvoted((prev) => !prev);
    if (isUpvoted) setIsUpvoted(false);
  };

  return (
    <div>
      {/* Comment content box */}
      <div className="flex rounded-md border border-slate-300">
        {/* Name, avatar */}
        <div className="w-1/6 py-4 px-2 flex flex-col items-center space-y-2 bg-slate-200">
          <Avatar imageUrl={comment.authorImage} name={comment.authorName} />
          <p className="text-center font-semibold">{comment.authorName}</p>
          {isOwnComment && (
            <span className="badge badge-primary badge-sm">You</span>
          )}
        </div>
        {/* Comment content */}
        <div className="w-5/6 p-4 space-y-2">
          {/* Time */}
          <span className="text-sm font-semibold">
            {new Date(comment.creation!).toLocaleString("vi-VN")}
          </span>
          {/* Reply to comment */}
          {replyTo && (
            <div className="block py-2 px-3 space-y-1 text-sm italic bg-slate-200 border-l-4 border-l-blue-500 rounded-md">
              <span className="text-xs text-slate-700">
                {new Date(replyTo.creation!).toLocaleString("vi-VN")}
              </span>
              <p className="font-semibold">{replyTo.authorName} said:</p>
              <p>{replyTo.content}</p>
            </div>
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
            {/* Reply this comment */}
            <button onClick={() => setIsReplying(true)}>
              <Reply size={20} />
            </button>
            {/* Vote comment */}
            <button onClick={handleUpvote}>
              <ArrowBigUp
                size={20}
                className={`${isUpvoted && "text-orange-500"}`}
              />
            </button>
            <span className="text-sm font-semibold">
              {Number(comment.upvotes) - Number(comment.downvotes)}
            </span>
            <button onClick={handleDownvote}>
              <ArrowBigDown
                size={20}
                className={`${isDownvoted && "text-blue-500"}`}
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
