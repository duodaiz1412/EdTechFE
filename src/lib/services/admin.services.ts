import axios from "axios";

import {Role, User} from "@/types";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1/admin/users";

export const adminServices = {
  async getUserList(accessToken: string, page: number = 0, size: number = 10) {
    const response = await axios.get(BASE_API + `?page=${page}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  },

  async getUser(userId: string, accessToken: string): Promise<User> {
    const response = await axios.get(BASE_API + `/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  },

  async updateUser(userId: string, userData: User, accessToken: string) {
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

    return response.data.map((role: Role) => role.role);
  },

  async addRoleToUser(accessToken: string, userId: string, role: string) {
    const response = await axios.post(
      BASE_API + `/${userId}/roles`,
      {role: role},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async deleteRoleFromUser(accessToken: string, userId: string, role: string) {
    const response = await axios.delete(BASE_API + `/${userId}/roles`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        role: role,
      },
    });
    return response;
  },
};
