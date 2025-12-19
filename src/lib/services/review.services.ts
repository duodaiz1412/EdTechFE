import axios from "axios";

import {Review} from "@/types";
import {config} from "@/config";

const BASE_API = config.BASE_API + "/api/v1";

export const reviewServices = {
  async getMyReview(accessToken: string, slug: string): Promise<Review> {
    const response = await axios.get(
      BASE_API + `/courses/slug/${slug}/my-review`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },

  async createReview(
    accessToken: string,
    slug: string,
    rating: number,
    comment?: string,
  ) {
    const response = await axios.post(
      BASE_API + `/courses/slug/${slug}/reviews`,
      {
        rating: rating,
        comment: comment || "",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },

  async updateReview(
    accessToken: string,
    reviewId: string,
    rating: number,
    comment?: string,
  ) {
    const response = await axios.put(
      BASE_API + `/reviews/${reviewId}`,
      {
        rating: rating,
        comment: comment || "",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },

  async deleteReview(accessToken: string, reviewId: string) {
    const response = await axios.delete(BASE_API + `/reviews/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  },
};
