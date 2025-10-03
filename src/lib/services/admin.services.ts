import {UserInfoProps} from "@/types";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1/admin/users";

export const adminServices = {
  async getUserList(page: number, size: number, accessToken: string) {
    const response = await axios.get(BASE_API + `?page=${page}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  },

  async getUser(userId: string, accessToken: string) {
    const response = await axios.get(BASE_API + `/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  },

  async updateUser(
    userId: string,
    userData: UserInfoProps,
    accessToken: string,
  ) {
    const response = await axios.put(BASE_API + `/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  },

  async getUserRoles(accessToken: string, userId: string) {
    const response = await axios.get(BASE_API + `/${userId}/roles`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) return [];

    return response.data.map(
      (role: {id: string; name: string; role: string}) => role.role,
    );
  },
};
