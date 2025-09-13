import {api} from "@/lib/api";
import {AuthTokens} from "@/types";

// Auth API Endpoints
const AUTH_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  VERIFY: "/auth/verify",
  REFRESH: "/auth/refresh",
} as const;

// Request Types
export interface RegisterRequest {
  fullName: string;
  email: string;
}

export interface LoginRequest {
  email: string;
}

export interface VerifyRequest {
  token: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Auth Services
export const authServices = {
  // Register new user
  register: async (data: RegisterRequest): Promise<void> => {
    await api.post(AUTH_ENDPOINTS.REGISTER, data);
  },

  // Login user (sends verification email)
  login: async (data: LoginRequest): Promise<void> => {
    await api.post(AUTH_ENDPOINTS.LOGIN, data);
  },

  // Verify email token and get auth tokens
  verify: async (token: string): Promise<AuthTokens> => {
    const response = await api.post(
      `${AUTH_ENDPOINTS.VERIFY}?token=${encodeURIComponent(token)}`,
    );

    return {
      accessToken: (response as any).accessToken,
      refreshToken: (response as any).refreshToken,
      tokenType: (response as any).tokenType,
    };
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await api.post(AUTH_ENDPOINTS.REFRESH, {
      refreshToken,
    });

    return {
      accessToken: (response as any).accessToken,
      refreshToken: (response as any).refreshToken,
      tokenType: (response as any).tokenType,
    };
  },
};
