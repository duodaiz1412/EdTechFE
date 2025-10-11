import {Progress} from "@/types";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1";

export const progressServices = {
  async getProgress(slug: string, accessToken: string): Promise<Progress> {
    const response = await axios.get(
      `${BASE_API}/courses/slug/${slug}/my-progress`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },

  async completeLesson(lessonSlug?: string, accessToken?: string) {
    const response = await axios.post(
      `${BASE_API}/lessons/slug/${lessonSlug}/progress`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },
};
