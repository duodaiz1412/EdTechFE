import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosInstance,
} from "axios";
import axiosRetry from "axios-retry";
import {XCookie} from "@/lib/cookies";
import {API_VERSIONS, IApiResponse} from "@/types";

export type ApiVersion = keyof typeof API_VERSIONS;

// Custom Error Class
export class ApiError extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Enhanced Axios Instance Type
export interface EnhancedAxiosInstance {
  (config: InternalAxiosRequestConfig): Promise<any>;
  get: (url: string, config?: InternalAxiosRequestConfig) => Promise<any>;
  post: (
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig,
  ) => Promise<any>;
  put: (
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig,
  ) => Promise<any>;
  delete: (url: string, config?: InternalAxiosRequestConfig) => Promise<any>;
  patch: (
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig,
  ) => Promise<any>;
  interceptors: {
    request: {
      use: (onFulfilled?: any, onRejected?: any) => number;
    };
    response: {
      use: (onFulfilled?: any, onRejected?: any) => number;
    };
  };
}

// Request Controllers for cancellation
const requestControllers = new Set<AbortController>();

export const addController = (controller: AbortController) => {
  requestControllers.add(controller);
};

export const removeController = (controller: AbortController) => {
  requestControllers.delete(controller);
};

export const cancelAllRequests = () => {
  requestControllers.forEach((controller) => controller.abort());
  requestControllers.clear();
};

// Error Handler
const handleError = (error: AxiosError): Promise<never> => {
  const apiError = new ApiError(
    (error.response?.data as {message?: string})?.message ||
      "An error occurred",
    error.response?.status,
    error.response?.data,
  );

  // Handle specific status codes
  if (typeof window !== "undefined") {
    switch (error.response?.status) {
      case 401:
        // Unauthorized - redirect to login
        XCookie.clearAllCookies();
        break;
      case 403:
        // Forbidden - show access denied
        // eslint-disable-next-line no-console
        console.warn("Access denied");
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        // Server errors - show error page
        // eslint-disable-next-line no-console
        console.error("Server error:", error.response?.status);
        break;
      default:
        break;
    }
  }

  return Promise.reject(apiError);
};

// Create API Instance
const createApiInstance = (version: ApiVersion): AxiosInstance => {
  const instance = axios.create({
    ...API_VERSIONS[version],
  }) as AxiosInstance;

  // Apply axios-retry
  axiosRetry(instance, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
      // Retry on network errors and 5xx status codes
      return (
        axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        (error.response?.status ? error.response.status >= 500 : false)
      );
    },
  });

  // Request Interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add request controller for cancellation
      const controller = new AbortController();
      config.signal = controller.signal;
      addController(controller);

      // Add auth token
      const accessToken = XCookie.getAccessToken();
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error: any) => Promise.reject(error),
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Remove controller when request completes
      if (response.config.signal) {
        removeController(response.config.signal as unknown as AbortController);
      }

      // Return response data directly
      return response.data;
    },
    (error: any) => {
      // Remove controller on error
      if (error.config?.signal) {
        removeController(error.config.signal as unknown as AbortController);
      }

      return handleError(error);
    },
  );

  return instance;
};

// Create API instance
export const api = createApiInstance("V1");

// API Helper Functions
export const apiGet = <T>(
  url: string,
  config?: InternalAxiosRequestConfig,
): Promise<IApiResponse<T>> => {
  return api.get(url, config);
};

export const apiPost = <T>(
  url: string,
  data?: any,
  config?: InternalAxiosRequestConfig,
): Promise<IApiResponse<T>> => {
  return api.post(url, data, config);
};

export const apiPut = <T>(
  url: string,
  data?: any,
  config?: InternalAxiosRequestConfig,
): Promise<IApiResponse<T>> => {
  return api.put(url, data, config);
};

export const apiDelete = <T>(
  url: string,
  config?: InternalAxiosRequestConfig,
): Promise<IApiResponse<T>> => {
  return api.delete(url, config);
};

export const apiPatch = <T>(
  url: string,
  data?: any,
  config?: InternalAxiosRequestConfig,
): Promise<IApiResponse<T>> => {
  return api.patch(url, data, config);
};
