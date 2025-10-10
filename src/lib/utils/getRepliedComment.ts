import {Comment} from "@/types";

export const getRepliedComment = (comments: Comment[], parentId?: string) => {
  if (!parentId) return undefined;
  return comments.find((comment) => comment.id === parentId);
};
