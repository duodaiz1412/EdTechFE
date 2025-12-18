import axios from "axios";
import {getAccessToken} from "@/lib/utils/getAccessToken";

// RAG API Base URL - defaults to localhost:8000 if not set
const RAG_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// RAG API Endpoints
const RAG_ENDPOINTS = {
  ASK: RAG_API_BASE_URL + "/api/v1/rag/ask",
  HEALTH: RAG_API_BASE_URL + "/health",
} as const;

// Types
export interface ChatMessage {
  question: string;
  answer: string;
}

export interface Source {
  rank?: number;
  document_id?: string;
  metadata?: {
    [key: string]: any;
  };
}

export interface AskRAGRequest {
  question: string;
  user_id?: string;
  lesson_id?: string;
  lessonId?: string; // Backend uses camelCase
  chat_history?: ChatMessage[];
}

export interface AskRAGResponse {
  answer: string;
  sources: Source[];
  chat_history: ChatMessage[];
  trace?: string;
}

export const ragServices = {
  /**
   * Ask a question to the RAG system
   */
  async askRAG(request: AskRAGRequest): Promise<AskRAGResponse> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error("Authentication required. Please login.");
    }

    try {
      const response = await axios.post<AskRAGResponse>(
        RAG_ENDPOINTS.ASK,
        request,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle timeout errors
        if (
          error.code === "ECONNABORTED" ||
          error.message.includes("timeout")
        ) {
          throw new Error(
            "Request timeout. The AI is taking longer than expected to respond. Please try again with a simpler question.",
          );
        }

        // Handle network errors
        if (error.code === "ERR_NETWORK" || !error.response) {
          throw new Error(
            "Network error. Please check your connection and try again.",
          );
        }

        // Handle server errors
        if (error.response?.status >= 500) {
          const errorMessage = error.response?.data?.message || error.message;

          if (
            errorMessage.includes("timeout") ||
            errorMessage.includes("timed out")
          ) {
            throw new Error(
              "The AI service is taking too long to respond. This might be due to high load. Please try again in a moment.",
            );
          }
          throw new Error(
            errorMessage || "Server error. Please try again later.",
          );
        }

        // Handle client errors (4xx)
        if (error.response?.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        }

        if (error.response?.status === 403) {
          throw new Error(
            "You do not have permission to access this resource.",
          );
        }

        if (error.response?.status === 404) {
          throw new Error("The requested service is not available.");
        }

        // Generic error
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage || "An error occurred. Please try again.");
      }

      // Non-axios error
      throw error instanceof Error
        ? error
        : new Error("An unexpected error occurred. Please try again.");
    }
  },

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{status: string}> {
    const accessToken = await getAccessToken();

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    try {
      const response = await axios.get<{status: string}>(RAG_ENDPOINTS.HEALTH, {
        headers,
        timeout: 10000, // 10 seconds for health check
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Health check failed: ${error.message || "Unable to reach the service"}`,
        );
      }
      throw error;
    }
  },
};
