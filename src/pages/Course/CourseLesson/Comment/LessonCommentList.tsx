import {Comment} from "@/types";
import {useState} from "react";
import LessonCommentItem from "./LessonCommentItem";
import {getRepliedComment} from "@/lib/utils/getRepliedComment";
import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {commentServices} from "@/lib/services/comment.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {useAppSelector} from "@/redux/hooks";

export default function LessonCommentList() {
  const {lessonSlug} = useParams();
  const userData = useAppSelector((state) => state.user.data);

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  useQuery({
    queryKey: ["comments", lessonSlug],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await commentServices.getComments(
        accessToken,
        lessonSlug,
      );
      setComments(response.content);
      return response;
    },
  });

  const handleNewComment = async (content: string, parentId?: string) => {
    const accessToken = await getAccessToken();
    const comment = await commentServices.postComment(
      accessToken,
      lessonSlug!,
      content,
      parentId,
    );
    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  const handleEditComment = async (
    order: number,
    commentId: string,
    content: string,
    parentId?: string,
  ) => {
    const accessToken = await getAccessToken();
    const updatedComment = await commentServices.editComment(
      accessToken,
      commentId,
      content,
      parentId,
    );
    setComments((prevComments) => {
      const updatedComments = [...prevComments];
      updatedComments[order] = updatedComment;
      return updatedComments;
    });
  };

  const handleDeleteComment = async (order: number, commentId: string) => {
    const confirm = window.confirm("Delete this comment?");
    if (!confirm) return;
    const accessToken = await getAccessToken();
    await commentServices.deleteComment(accessToken, commentId);
    setComments((prevComments) => {
      const updatedComments = [...prevComments];
      updatedComments.splice(order, 1);
      return updatedComments;
    });
  };

  const handleVote = async (
    order: number,
    commentId: string,
    type: "UPVOTE" | "DOWNVOTE",
  ) => {
    const accessToken = await getAccessToken();
    const votedComment = await commentServices.voteComment(
      accessToken,
      commentId,
      type,
    );
    setComments((prevComments) => {
      const updatedComments = [...prevComments];
      updatedComments[order] = votedComment;
      return updatedComments;
    });
  };

  return (
    <div className="space-y-4">
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
          handleNewComment={handleNewComment}
          handleEditComment={handleEditComment}
          handleDeleteComment={handleDeleteComment}
          handleVote={handleVote}
          replyTo={getRepliedComment(comments, comment.parentId)}
        />
      ))}
    </div>
  );
}
