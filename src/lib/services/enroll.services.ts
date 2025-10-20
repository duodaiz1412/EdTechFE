import axios from "axios";

import {CourseEnrollment, Order} from "@/types";

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

  async getEnrollments(accessToken: string): Promise<CourseEnrollment[]> {
    const response = await axios.get(`${BASE_API}/enrollments/my-courses`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
};
