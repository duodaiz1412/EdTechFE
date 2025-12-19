import axios from "axios";

import {Progress} from "@/types";
import {config} from "@/config";

const BASE_API = config.BASE_API + "/api/v1";

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
