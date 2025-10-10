import {Comment} from "@/types";
import {useEffect, useState} from "react";
import {comments as mockComments} from "@/mockData/comments";
import LessonCommentItem from "./LessonCommentItem";
import {getRepliedComment} from "@/lib/utils/getRepliedComment";

export default function LessonCommentList() {
  const [comments, setComments] = useState<Comment[]>();
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    setComments(mockComments);
  }, []);

  return (
    <div className="space-y-4">
      {/* New comment */}
      <h3>New comment</h3>
      {!isCommenting && (
        <button
          className="btn btn-neutral"
          onClick={() => setIsCommenting(true)}
        >
          Add Comment
        </button>
      )}
      {isCommenting && (
        <>
          <textarea
            className="textarea w-full"
            placeholder="New comment..."
          ></textarea>
          <div className="flex justify-end space-x-4 w-full">
            <button className="btn btn-neutral">Send</button>
            <button className="btn" onClick={() => setIsCommenting(false)}>
              Cancel
            </button>
          </div>
        </>
      )}
      {/* List comments */}
      <h3 className="pt-4">All comments ({comments?.length})</h3>
      {comments?.map((comment) => (
        <LessonCommentItem
          key={comment.id}
          comment={comment}
          replyTo={getRepliedComment(comments, comment.parentId)}
        />
      ))}
    </div>
  );
}
