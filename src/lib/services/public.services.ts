import axios from "axios";

import {Batch, Chapter, Course, User} from "@/types";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1/public";

export const publicServices = {
  async getCourses(
    search: string = "",
    tags: string = "",
    labels: string = "",
    size: number = 10,
  ) {
    const response = await axios.get(
      BASE_API +
        "/courses" +
        `?search=${search}&tags=${tags}&labels=${labels}&size=${size}`,
    );
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

  async getPublicProfile(userId: string): Promise<User> {
    const response = await axios.get(BASE_API + `/users/${userId}`);
    return response.data;
  },

  async getBatches(
    search: string = "",
    tags: string = "",
    labels: string = "",
    size: number = 10,
  ) {
    const response = await axios.get(
      BASE_API +
        "/batches" +
        `?search=${search}&tags=${tags}&labels=${labels}&size=${size}`,
    );
    return response.data;
  },

  async getBatchBySlug(slug: string): Promise<Batch> {
    const response = await axios.get(BASE_API + `/batches/${slug}`);
    return response.data;
  },
};
