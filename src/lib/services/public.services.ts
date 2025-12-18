import axios from "axios";

import {Batch, Chapter, Course} from "@/types";
import {config} from "@/config";

const BASE_API = config.BASE_API + "/public";

export const publicServices = {
  async getCourses(
    search: string = "",
    tags: string = "",
    labels: string = "",
    size?: number,
  ) {
    const api =
      BASE_API +
      "/courses" +
      `?search=${search}&tags=${tags}&labels=${labels}` +
      (size ? `&size=${size}` : "");
    const response = await axios.get(api);
    return response.data;
  },

  async getCourseBySlug(slug: string): Promise<Course> {
    const response = await axios.get(BASE_API + `/courses/${slug}`);
    return response.data;
  },

  async getChapters(slug: string): Promise<Chapter[]> {
    const response = await axios.get(BASE_API + `/courses/${slug}/chapters`);
    return response.data;
  },

  async getAverageRating(slug: string): Promise<number> {
    const response = await axios.get(
      BASE_API + `/courses/${slug}/average-rating`,
    );

    return response.data;
  },

  async getReviews(slug: string) {
    const response = await axios.get(BASE_API + `/courses/${slug}/reviews`);
    return response.data;
  },

  async getBatches(
    search: string = "",
    tags: string = "",
    labels: string = "",
    size?: number,
  ) {
    const api =
      BASE_API +
      "/batches" +
      `?search=${search}&tags=${tags}&labels=${labels}` +
      (size ? `&size=${size}` : "");
    const response = await axios.get(api);
    return response.data;
  },

  async getBatchBySlug(slug: string): Promise<Batch> {
    const response = await axios.get(BASE_API + `/batches/${slug}`);
    return response.data;
  },
};
