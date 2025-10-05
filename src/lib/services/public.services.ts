import {Chapter} from "@/types";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1/public";

export const publicServices = {
  async getCourses() {
    const response = await axios.get(BASE_API + "/courses");
    return response.data;
  },

  async getCourseBySlug(slug: string) {
    const response = await axios.get(BASE_API + `/courses/${slug}`);
    return response.data;
  },

  async getChapters(courseId: string): Promise<Chapter[]> {
    const response = await axios.get(
      BASE_API + `/courses/${courseId}/chapters`,
    );
    return response.data;
  },
};
