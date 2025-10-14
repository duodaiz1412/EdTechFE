import axios from "axios";

import {Enrollment} from "@/types";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1";

export const enrollServices = {
  async enrollCourse(courseId: string, accessToken: string) {
    const response = await axios.post(
      `${BASE_API}/courses/${courseId}/enroll`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async getEnrollments(accessToken: string): Promise<Enrollment[]> {
    const response = await axios.get(`${BASE_API}/enrollments/my-courses`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
};
