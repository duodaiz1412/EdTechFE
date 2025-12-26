import {useCallback, useRef, useEffect} from "react";
import {
  useChatActions,
  useChatSelectors,
  ChatMessage,
} from "@/stores/chatStore";
import {
  ragServices,
  AskRAGRequest,
  AskRAGV1Request,
} from "@/lib/services/rag.services";
import {toast} from "sonner";
import {useAppSelector} from "@/redux/hooks";
import {selectUser} from "@/redux/slice/userSlice";

interface UseChatOptions {
  noteId?: string;
  lessonId?: string;
  sessionId?: string;
  useV1Endpoint?: boolean; // Use simplified /api/v1/ask endpoint
  onMessageAdded?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
}

export const useChat = (options: UseChatOptions = {}) => {
  const {
    noteId,
    lessonId,
    sessionId: providedSessionId,
    useV1Endpoint = false,
    onMessageAdded,
    onError,
  } = options;
  const user = useAppSelector(selectUser);

  const {
    currentSessionId,
    streamingResponse,
    getCurrentSession,
    getSession,
    getSessionByNoteId,
    getSessionByLessonId,
  } = useChatSelectors();

  const {
    createSession,
    setCurrentSession,
    addMessage,
    updateMessage,
    clearMessages,
    setStreamingResponse,
  } = useChatActions();

  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize session
  useEffect(() => {
    if (providedSessionId) {
      const session = getSession(providedSessionId);
      if (session) {
        setCurrentSession(providedSessionId);
      }
    } else if (noteId) {
      const existingSession = getSessionByNoteId(noteId);
      if (existingSession) {
        setCurrentSession(existingSession.sessionId);
      } else {
        const newSessionId = createSession({noteId});
        setCurrentSession(newSessionId);
      }
    } else if (lessonId) {
      const existingSession = getSessionByLessonId(lessonId);
      if (existingSession) {
        setCurrentSession(existingSession.sessionId);
      } else {
        const newSessionId = createSession({lessonId});
        setCurrentSession(newSessionId);
      }
    }
  }, [
    noteId,
    lessonId,
    providedSessionId,
    getSession,
    getSessionByNoteId,
    getSessionByLessonId,
    createSession,
    setCurrentSession,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const currentSession = getCurrentSession();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentSessionId || !currentSession) {
        toast.error("No active chat session");
        return;
      }

      if (!content.trim()) {
        return;
      }

      // Cancel previous request if any
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      // Add user message
      addMessage(currentSessionId, {
        role: "user",
        content: content.trim(),
      });

      // Get the created message from store to pass to callback
      const sessionAfterUserMessage = getCurrentSession();
      const createdUserMessage =
        sessionAfterUserMessage?.messages[
          sessionAfterUserMessage.messages.length - 1
        ];
      if (createdUserMessage) {
        onMessageAdded?.(createdUserMessage);
      }

      // Prepare chat history for API
      const chatHistory = currentSession.messages
        .filter((msg) => msg.role !== "user" || msg.content !== content.trim())
        .reduce<Array<{question: string; answer: string}>>(
          (acc, msg, index, arr) => {
            if (msg.role === "user" && arr[index + 1]?.role === "assistant") {
              acc.push({
                question: msg.content,
                answer: arr[index + 1].content,
              });
            }
            return acc;
          },
          [],
        );

      setStreamingResponse(currentSessionId, "");

      try {
        let assistantMessage;

        if (useV1Endpoint) {
          // Use V1 simplified endpoint
          if (!user?.id) {
            throw new Error("User ID is required for V1 endpoint.");
          }

          const v1Request: AskRAGV1Request = {
            question: content.trim(),
            userId: user.id,
            chatHistory: chatHistory,
          };

          // Add lessonId if available
          if (currentSession.lessonId) {
            v1Request.lessonId = currentSession.lessonId;
          }

          const response = await ragServices.askRAGV1(v1Request);

          // Process V1 response format
          assistantMessage = {
            role: "assistant" as const,
            content: response.answer,
            sources: response.sources?.map((source, index) => {
              // V1 sources can be CourseSource or LessonSource
              if ("slug" in source) {
                // CourseSource: { title, slug }
                return {
                  id: `course-${index}`,
                  title: source.title,
                  slug: source.slug,
                  type: "course",
                };
              } else {
                // LessonSource: { lesson_id, lesson_title, course_slug, ... }
                return {
                  id: source.lesson_id || `lesson-${index}`,
                  title: source.lesson_title || "Lesson",
                  slug: source.course_slug,
                  lessonId: source.lesson_id,
                  courseId: source.course_id,
                  courseTitle: source.course_title,
                  type: "lesson",
                };
              }
            }),
          };
        } else {
          // Use full endpoint
          const request: AskRAGRequest = {
            question: content.trim(),
            chat_history: chatHistory,
          };

          // Add lesson_id from session if available
          if (currentSession.lessonId) {
            request.lesson_id = currentSession.lessonId;
            request.lessonId = currentSession.lessonId; // Backend uses camelCase
          }

          // Add user_id if available
          if (user?.id) {
            request.user_id = user.id;
          }

          const response = await ragServices.askRAG(request);

          // Add assistant message
          assistantMessage = {
            role: "assistant" as const,
            content: response.answer,
            sources: response.sources?.map((source, index) => {
              // Support new format: { title, slug } directly on source
              // Also support old format: { metadata: { title, url, ... } }
              const title =
                (source as any).title ||
                source.metadata?.title ||
                source.metadata?.source ||
                "Unknown";
              const slug = (source as any).slug;
              const url = source.metadata?.url;

              return {
                id: source.document_id || `source-${index}`,
                title,
                slug,
                url,
                type: source.metadata?.type || (slug ? "course" : "web_link"),
              };
            }),
          };
        }

        addMessage(currentSessionId, assistantMessage);
        setStreamingResponse(currentSessionId, null);

        // Get the created message from store to pass to callback
        const updatedSession = getCurrentSession();
        const createdMessage =
          updatedSession?.messages[updatedSession.messages.length - 1];
        if (createdMessage) {
          onMessageAdded?.(createdMessage);
        }
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("Failed to send message");

        // Mark user message as error
        const lastUserMessage = currentSession?.messages
          .filter((msg) => msg.role === "user")
          .pop();

        if (lastUserMessage) {
          updateMessage(currentSessionId, lastUserMessage.id, {error: true});
        }

        setStreamingResponse(currentSessionId, null);
        onError?.(err);
        toast.error(err.message || "Failed to send message");
      }
    },
    [
      currentSessionId,
      currentSession,
      user,
      useV1Endpoint,
      addMessage,
      updateMessage,
      setStreamingResponse,
      getCurrentSession,
      onMessageAdded,
      onError,
    ],
  );

  const clearChat = useCallback(() => {
    if (currentSessionId) {
      // Clear messages but keep session
      clearMessages(currentSessionId);
      setStreamingResponse(currentSessionId, null);
    }
  }, [currentSessionId, clearMessages, setStreamingResponse]);

  return {
    // State
    currentSession,
    messages: currentSession?.messages || [],
    streamingResponse,
    isLoading: streamingResponse !== null,

    // Actions
    sendMessage,
    clearChat,
  };
};
