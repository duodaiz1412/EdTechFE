import axios from "axios";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1/api/v1";

export const commentServices = {
  async getComments(accessToken?: string, lessonId?: string) {
    const response = await axios.get(
      BASE_API + `/lessons/${lessonId}/comments`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },
};
