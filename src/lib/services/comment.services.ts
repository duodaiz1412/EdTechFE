import axios from "axios";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1";

export const commentServices = {
  async getComments(accessToken?: string, slug?: string) {
    const response = await axios.get(
      BASE_API + `/lessons/slug/${slug}/comments`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },

  async postComment(
    accessToken: string,
    lessonSlug: string,
    content: string,
    parentId?: string,
  ) {
    const response = await axios.post(
      BASE_API + `/lessons/slug/${lessonSlug}/comments`,
      {
        content: content,
        parentId: parentId || null,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },

  async editComment(
    accessToken: string,
    commentId: string,
    content: string,
    parentId?: string,
  ) {
    const response = await axios.put(
      BASE_API + `/comments/${commentId}`,
      {content, parentId: parentId || null},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },

  async deleteComment(accessToken: string, commentId: string) {
    const response = await axios.delete(BASE_API + `/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  },

  async voteComment(
    accessToken: string,
    commentId: string,
    type: "UPVOTE" | "DOWNVOTE",
  ) {
    const response = await axios.post(
      BASE_API + `/comments/${commentId}/vote`,
      {voteType: type},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },
};
