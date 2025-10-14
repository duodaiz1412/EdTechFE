import axios from "axios";

import {User} from "@/types";
import {authServices} from "./auth.services";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1";

const USER_ENDPOINTS = {
  USER_INFO: BASE_API + "/users/me",
  ASSIGN_ROLE: BASE_API + "/users/me/roles",
};

export const userServices = {
  async getUserInfo(accessToken: string) {
    const response = await axios.get(USER_ENDPOINTS.USER_INFO, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  },

  async changeUserInfo(accessToken: string, userInfo: User) {
    const response = await axios.put(
      USER_ENDPOINTS.USER_INFO,
      {...userInfo},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response;
  },

  async assignRole(
    accessToken: string,
    role:
      | "SYSTEM_MANAGER"
      | "COURSE_CREATOR"
      | "LMS_STUDENT"
      | "MODERATOR"
      | "BATCH_EVALUATOR",
  ) {
    const response = await axios.post(
      USER_ENDPOINTS.ASSIGN_ROLE,
      {role: role},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await authServices.refresh(refreshToken);
    }

    return response;
  },
};
