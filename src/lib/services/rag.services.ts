import axios from "axios";

// RAG API Base URL - defaults to localhost:8001 if not set
// Port 8001 to avoid conflict with Spring Boot backend (port 8000)
const RAG_API_BASE_URL =
  import.meta.env.VITE_RAG_API_BASE_URL || "http://localhost:8001";

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
  doc_type?: string;
  course_id?: string;
  course_title?: string;
  chapter_id?: string;
  chapter_title?: string;
  lesson_id?: string;
  lesson_title?: string;
  requires_enrollment?: boolean;
  tags?: string[];
  language?: string;
  course_skill_level?: string;
  chapter_summary?: string;
  last_modified?: string;
  distance?: number;
  metadata?: Record<string, any>;
}

export interface AskRequest {
  question: string;
  user_id?: string;
  chat_history?: ChatMessage[];
}

export interface AskResponse {
  answer: string;
  trace: string;
  sources: Source[];
  chat_history: ChatMessage[];
}

/**
 * Ask a question to the Agentic RAG system
 * @param request - The question and optional context
 * @returns Promise with the RAG response
 */
export const askRAG = async (request: AskRequest): Promise<AskResponse> => {
  try {
    const response = await axios.post<AskResponse>(RAG_ENDPOINTS.ASK, request, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 60000, // 60 seconds timeout for RAG processing
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `RAG API Error: ${error.response.data?.detail || error.message}`,
        );
      } else if (error.request) {
        throw new Error(
          "RAG API Error: No response from server. Please check if the RAG API is running.",
        );
      }
    }
    throw error;
  }
};

/**
 * Check if the RAG API is healthy
 * @returns Promise with health status
 */
export const checkRAGHealth = async (): Promise<{status: string}> => {
  try {
    const response = await axios.get<{status: string}>(RAG_ENDPOINTS.HEALTH, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("RAG API is not available");
    }
    throw error;
  }
};
