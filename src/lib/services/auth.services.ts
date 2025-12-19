import axios from "axios";
import {config} from "@/config";

const BASE_API = config.BASE_API + "/api/v1";
const AUTH_ENDPOINTS = {
  LOGIN: BASE_API + "/auth/login",
  REGISTER: BASE_API + "/auth/register",
  VERIFY: BASE_API + "/auth/verify",
  REFRESH: BASE_API + "/auth/refresh",
};

export const authServices = {
  async login(email: string) {
    const response = await axios.post(AUTH_ENDPOINTS.LOGIN, {email: email});
    return response;
  },

  async register(fullName: string, email: string) {
    const response = await axios.post(AUTH_ENDPOINTS.REGISTER, {
      fullName: fullName,
      email: email,
    });
    return response;
  },

  async verify(token: string) {
    const response = await axios.post(
      AUTH_ENDPOINTS.VERIFY + `?token=${token}`,
    );

    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);

    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      tokenType: response.data.tokenType,
    };
  },

  async refresh(refreshToken: string) {
    const response = await axios.post(AUTH_ENDPOINTS.REFRESH, {
      refreshToken: refreshToken,
    });

    if (response.status !== 200) return null;

    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);

    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      tokenType: response.data.tokenType,
    };
  },
};
