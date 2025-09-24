// import {api} from "@/lib/api";
// import {AuthTokens} from "@/types";

// // Auth API Endpoints
// const AUTH_ENDPOINTS = {
//   REGISTER: "/auth/register",
//   LOGIN: "/auth/login",
//   VERIFY: "/auth/verify",
//   REFRESH: "/auth/refresh",
// } as const;

// // Request Types
// export interface RegisterRequest {
//   fullName: string;
//   email: string;
// }

// export interface LoginRequest {
//   email: string;
// }

// export interface VerifyRequest {
//   token: string;
// }

// export interface RefreshTokenRequest {
//   refreshToken: string;
// }

// // Auth Services
// export const authServices = {
//   // Register new user
//   register: async (data: RegisterRequest): Promise<void> => {
//     await api.post(AUTH_ENDPOINTS.REGISTER, data);
//   },

//   // Login user (sends verification email)
//   login: async (data: LoginRequest): Promise<void> => {
//     await api.post(AUTH_ENDPOINTS.LOGIN, data);
//   },

//   // Verify email token and get auth tokens
//   verify: async (token: string): Promise<AuthTokens> => {
//     const response = await api.post(
//       `${AUTH_ENDPOINTS.VERIFY}?token=${encodeURIComponent(token)}`,
//     );

//     return {
//       accessToken: (response as any).accessToken,
//       refreshToken: (response as any).refreshToken,
//       tokenType: (response as any).tokenType,
//     };
//   },

//   // Refresh access token
//   refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
//     const response = await api.post(AUTH_ENDPOINTS.REFRESH, {
//       refreshToken,
//     });

//     return {
//       accessToken: (response as any).accessToken,
//       refreshToken: (response as any).refreshToken,
//       tokenType: (response as any).tokenType,
//     };
//   },
// };

import axios from "axios";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1";
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

    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      tokenType: response.data.tokenType,
    };
  },
};
