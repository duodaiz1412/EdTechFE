import {api} from "@/lib/api";
import {User} from "@/types";

const USER_ENDPOINTS = {
  ME: "/users/me",
} as const;

export const userServices = {
  getMe: async (): Promise<User> => {
    const response = await api.get(USER_ENDPOINTS.ME);
    // API interceptor trả về response.data trực tiếp
    return response as unknown as User;
  },
};
