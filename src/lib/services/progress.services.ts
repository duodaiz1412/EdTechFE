import { Progress } from "@/types";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1";

export const progressServices = {
  async getProgress(courseId: string, accessToken: string): Promise<Progress> {
    const response = await axios.get(
      `${BASE_API}/courses/${courseId}/my-progress`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },

  async completeLesson(lessonId: string, accessToken: string) {
    const response = await axios.post(
      `${BASE_API}/lessons/${lessonId}/progress`,
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
