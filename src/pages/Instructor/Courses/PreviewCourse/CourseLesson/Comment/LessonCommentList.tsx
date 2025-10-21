import {Comment} from "@/types";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useAppSelector} from "@/redux/hooks";
import LessonCommentItem from "./LessonCommentItem";

interface LessonCommentListProps {
  lessonId?: string;
}

export default function LessonCommentList({lessonId}: LessonCommentListProps) {
  const {lessonSlug} = useParams();
  const userData = useAppSelector((state) => state.user.data);

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    // Preview mode - show sample comments
    const sampleComments: Comment[] = [
      {
        id: "1",
        content: "This lesson is very helpful!",
        authorId: "user1",
        authorName: "John Doe",
        authorImage: undefined,
        creation: new Date().toISOString(),
        upvotes: 5,
        downvotes: 0,
        parentId: undefined,
      },
      {
        id: "2",
        content:
          "I have a question about the third point mentioned in the video.",
        authorId: "user2",
        authorName: "Jane Smith",
        authorImage: undefined,
        creation: new Date(Date.now() - 3600000).toISOString(),
        upvotes: 3,
        downvotes: 1,
        parentId: undefined,
      },
    ];
    setComments(sampleComments);
  }, [lessonSlug, lessonId, userData?.id]);

  const handleNewComment = async (content: string) => {
    // Preview mode - simulate adding comment
    const newComment: Comment = {
      id: Date.now().toString(),
      content,
      authorId: userData?.id || "current-user",
      authorName: userData?.name || "You",
      authorImage: userData?.image || undefined,
      creation: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      parentId: undefined,
    };
    setComments((prev) => [...prev, newComment]);
    setNewComment("");
  };

  const handleEditComment = async (order: number, content: string) => {
    // Preview mode - simulate editing comment
    setComments((prevComments) => {
      const updatedComments = [...prevComments];
      updatedComments[order] = {
        ...updatedComments[order],
        content,
      };
      return updatedComments;
    });
  };

  const handleDeleteComment = async (order: number) => {
    const confirm = window.confirm("Delete this comment?");
    if (!confirm) return;
    // Preview mode - simulate deleting comment
    setComments((prevComments) => {
      const updatedComments = [...prevComments];
      updatedComments.splice(order, 1);
      return updatedComments;
    });
  };

  return (
    <div className="space-y-4 h-[600px] overflow-y-auto custom-scrollbar">
      {/* New comment */}
      <textarea
        className="textarea w-full"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="New comment..."
      ></textarea>
      <div className="flex justify-end space-x-4 w-full">
        <button
          className="btn btn-neutral"
          onClick={() => handleNewComment(newComment)}
        >
          Send
        </button>
      </div>
      {/* List comments */}
      <h3 className="pt-4">All comments ({comments?.length})</h3>
      {comments?.map((comment, idx) => (
        <LessonCommentItem
          key={comment.id}
          order={idx}
          comment={comment}
          isOwnComment={userData?.id === comment.authorId}
          isOwnUpvoted={false}
          handleNewComment={handleNewComment}
          handleEditComment={handleEditComment}
          handleDeleteComment={handleDeleteComment}
          handleVote={() => {}}
        />
      ))}
    </div>
  );
}
