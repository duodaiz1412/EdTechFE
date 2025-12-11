import axios from "axios";

import {BatchEnrollment, CourseEnrollment, Order} from "@/types";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1";

export const enrollServices = {
  async enrollFreeCourse(courseSlug: string, accessToken: string) {
    const response = await axios.post(
      `${BASE_API}/courses/${courseSlug}/enroll-free`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async enrollPaidCourse(
    courseSlug: string,
    accessToken: string,
  ): Promise<Order> {
    const response = await axios.post(
      `${BASE_API}/courses/${courseSlug}/enroll-paid`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  },

  async getCourseEnrollments(accessToken: string): Promise<CourseEnrollment[]> {
    const response = await axios.get(`${BASE_API}/enrollments/my-courses`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  async enrollFreeBatch(batchSlug: string, accessToken: string) {
    const response = await axios.post(
      `${BASE_API}/batches/${batchSlug}/enroll-free`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async enrollPaidBatch(
    batchSlug: string,
    accessToken: string,
  ): Promise<Order> {
    const response = await axios.post(
      `${BASE_API}/batches/${batchSlug}/enroll-paid`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },

  async getBatchEnrollments(accessToken: string): Promise<BatchEnrollment[]> {
    const response = await axios.get(
      `${BASE_API}/enrollments/enrolled-batches`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },

  async getPurchaseHistory(
    accessToken: string,
    filterBy: "COURSE" | "BATCH",
    page: number = 0,
    size: number = 10,
  ) {
    const response = await axios.get(
      BASE_API +
        "/enrollments/me" +
        `?filterBy=${filterBy}&page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  },
};
