import axios from "axios";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1";

export const batchServices = {
  async createDiscussionPost(
    accessToken: string,
    batchId: string,
    title: string,
    content: string,
    replyToId?: string,
  ) {
    const body = {
      title: title,
      content: content,
    };
    if (replyToId) {
      Object.assign(body, {replyToId: replyToId});
    }
    const response = await axios.post(
      `${BASE_API}/discussions/batch/${batchId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async getDiscussionPosts(
    accessToken: string,
    batchId: string,
    page: number = 0,
  ) {
    const size = 10;
    const response = await axios.get(
      `${BASE_API}/discussions/batch/${batchId}?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },

  async getDiscussionPostReplies(accessToken: string, discussionId: string) {
    const response = await axios.get(
      `${BASE_API}/discussions/${discussionId}/replies`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },
};
