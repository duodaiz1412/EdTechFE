import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  error?: boolean;
  sources?: ChatSource[];
}

export interface ChatSource {
  id?: string;
  title: string;
  url?: string;
  slug?: string; // Course slug for creating course detail links
  type?: "note" | "web_link" | string;
}

interface ChatSession {
  sessionId: string;
  noteId?: string;
  lessonId?: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

interface ChatStore {
  // State
  sessions: ChatSession[];
  currentSessionId: string | null;
  streamingResponse: string | null;

  // Actions
  createSession: (params: {noteId?: string; lessonId?: string}) => string;
  setCurrentSession: (sessionId: string) => void;
  addMessage: (
    sessionId: string,
    message: Omit<ChatMessage, "id" | "timestamp">,
  ) => void;
  updateMessage: (
    sessionId: string,
    messageId: string,
    updates: Partial<ChatMessage>,
  ) => void;
  removeMessage: (sessionId: string, messageId: string) => void;
  setStreamingResponse: (sessionId: string, content: string | null) => void;
  clearSession: (sessionId: string) => void;
  clearAllSessions: () => void;

  // Getters
  getCurrentSession: () => ChatSession | undefined;
  getSession: (sessionId: string) => ChatSession | undefined;
  getSessionByNoteId: (noteId: string) => ChatSession | undefined;
  getSessionByLessonId: (lessonId: string) => ChatSession | undefined;

  // Cleanup
  cleanupOldSessions: (maxAge?: number) => void;
}

const DEFAULT_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_SESSIONS = 50; // Giới hạn số sessions

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Initial state
      sessions: [],
      currentSessionId: null,
      streamingResponse: null,

      // Create new session
      createSession: (params) => {
        const sessionId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newSession: ChatSession = {
          sessionId,
          noteId: params.noteId,
          lessonId: params.lessonId,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => {
          const updatedSessions = [newSession, ...state.sessions].slice(
            0,
            MAX_SESSIONS,
          );
          return {
            sessions: updatedSessions,
            currentSessionId: sessionId,
          };
        });

        return sessionId;
      },

      // Set current session
      setCurrentSession: (sessionId) => {
        set({currentSessionId: sessionId});
      },

      // Add message to session
      addMessage: (sessionId, message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
        };

        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.sessionId === sessionId
              ? {
                  ...session,
                  messages: [...session.messages, newMessage],
                  updatedAt: Date.now(),
                }
              : session,
          ),
        }));
      },

      // Update message
      updateMessage: (sessionId, messageId, updates) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.sessionId === sessionId
              ? {
                  ...session,
                  messages: session.messages.map((msg) =>
                    msg.id === messageId ? {...msg, ...updates} : msg,
                  ),
                  updatedAt: Date.now(),
                }
              : session,
          ),
        }));
      },

      // Remove message
      removeMessage: (sessionId, messageId) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.sessionId === sessionId
              ? {
                  ...session,
                  messages: session.messages.filter(
                    (msg) => msg.id !== messageId,
                  ),
                  updatedAt: Date.now(),
                }
              : session,
          ),
        }));
      },

      // Set streaming response
      setStreamingResponse: (_sessionId, content) => {
        set({streamingResponse: content});
      },

      // Clear session
      clearSession: (sessionId) => {
        set((state) => ({
          sessions: state.sessions.filter(
            (session) => session.sessionId !== sessionId,
          ),
          currentSessionId:
            state.currentSessionId === sessionId
              ? null
              : state.currentSessionId,
        }));
      },

      // Clear all sessions
      clearAllSessions: () => {
        set({sessions: [], currentSessionId: null, streamingResponse: null});
      },

      // Get current session
      getCurrentSession: () => {
        const {currentSessionId, sessions} = get();
        if (!currentSessionId) return undefined;
        return sessions.find((s) => s.sessionId === currentSessionId);
      },

      // Get session by ID
      getSession: (sessionId) => {
        return get().sessions.find((s) => s.sessionId === sessionId);
      },

      // Get session by note ID
      getSessionByNoteId: (noteId) => {
        return get().sessions.find((s) => s.noteId === noteId);
      },

      // Get session by lesson ID
      getSessionByLessonId: (lessonId) => {
        return get().sessions.find((s) => s.lessonId === lessonId);
      },

      // Cleanup old sessions
      cleanupOldSessions: (maxAge = DEFAULT_MAX_AGE) => {
        const cutoff = Date.now() - maxAge;
        set((state) => ({
          sessions: state.sessions.filter(
            (session) =>
              session.updatedAt > cutoff || session.messages.length > 0,
          ),
        }));
      },
    }),
    {
      name: "etech-chat-store",
      storage: createJSONStorage(() => localStorage),
      // Chỉ persist sessions, không persist streaming state
      partialize: (state) => ({
        sessions: state.sessions,
        currentSessionId: state.currentSessionId,
        // Không persist streamingResponse
      }),
      version: 1,
    },
  ),
);

// Selectors hook
export const useChatSelectors = () => {
  const sessions = useChatStore((state) => state.sessions);
  const currentSessionId = useChatStore((state) => state.currentSessionId);
  const streamingResponse = useChatStore((state) => state.streamingResponse);

  const getCurrentSession = useChatStore((state) => state.getCurrentSession);
  const getSession = useChatStore((state) => state.getSession);
  const getSessionByNoteId = useChatStore((state) => state.getSessionByNoteId);
  const getSessionByLessonId = useChatStore(
    (state) => state.getSessionByLessonId,
  );

  return {
    sessions,
    currentSessionId,
    streamingResponse,
    getCurrentSession,
    getSession,
    getSessionByNoteId,
    getSessionByLessonId,
  };
};

// Actions hook
export const useChatActions = () => {
  const createSession = useChatStore((state) => state.createSession);
  const setCurrentSession = useChatStore((state) => state.setCurrentSession);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateMessage = useChatStore((state) => state.updateMessage);
  const removeMessage = useChatStore((state) => state.removeMessage);
  const setStreamingResponse = useChatStore(
    (state) => state.setStreamingResponse,
  );
  const clearSession = useChatStore((state) => state.clearSession);
  const clearAllSessions = useChatStore((state) => state.clearAllSessions);
  const cleanupOldSessions = useChatStore((state) => state.cleanupOldSessions);

  return {
    createSession,
    setCurrentSession,
    addMessage,
    updateMessage,
    removeMessage,
    setStreamingResponse,
    clearSession,
    clearAllSessions,
    cleanupOldSessions,
  };
};

export default useChatStore;
