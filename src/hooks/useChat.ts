import {useCallback, useRef, useEffect} from "react";
import {
  useChatActions,
  useChatSelectors,
  ChatMessage,
} from "@/stores/chatStore";
import {ragServices, AskRAGRequest} from "@/lib/services/rag.services";
import {toast} from "sonner";
import {useAppSelector} from "@/redux/hooks";
import {selectUser} from "@/redux/slice/userSlice";

interface UseChatOptions {
  noteId?: string;
  lessonId?: string;
  sessionId?: string;
  onMessageAdded?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
}

export const useChat = (options: UseChatOptions = {}) => {
  const {
    noteId,
    lessonId,
    sessionId: providedSessionId,
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

      // Prepare request
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

      setStreamingResponse(currentSessionId, "");

      try {
        const response = await ragServices.askRAG(request);

        // Add assistant message
        const assistantMessage = {
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

        addMessage(currentSessionId, assistantMessage);
        setStreamingResponse(currentSessionId, null);

        // Get the created message from store to pass to callback
        const currentSession = getCurrentSession();
        const createdMessage =
          currentSession?.messages[currentSession.messages.length - 1];
        if (createdMessage) {
          onMessageAdded?.(createdMessage);
        }
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("Failed to send message");

        // Mark user message as error
        const lastUserMessage = currentSession.messages
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
      // You might want to add a clearMessages action instead
      setStreamingResponse(currentSessionId, null);
    }
  }, [currentSessionId, setStreamingResponse]);

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
