import axios from "axios";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1";

export const learnerServices = {
  async getLesson(accessToken?: string, lessonSlug?: string) {
    const response = await axios.get(BASE_API + `/lessons/${lessonSlug}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
};
