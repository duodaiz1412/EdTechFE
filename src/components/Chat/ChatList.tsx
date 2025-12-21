import {useEffect, useRef} from "react";
import {ChatMessage} from "./ChatMessage";
import {ChatMessage as ChatMessageType} from "@/stores/chatStore";
import {MessageSquare} from "lucide-react";

interface ChatListProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
  onShowInput?: () => void;
  hideEmptyState?: boolean;
}

export const ChatList = ({
  messages,
  isLoading,
  onShowInput,
  hideEmptyState,
}: ChatListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  const handleShowInput = () => {
    if (onShowInput) {
      onShowInput();
    }
  };

  if (messages.length === 0 && !isLoading && !hideEmptyState) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center w-full px-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Hi 👋, how can we help?
          </h3>
          {onShowInput && (
            <>
              <button
                onClick={handleShowInput}
                type="button"
                className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm active:bg-blue-800"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Send us a message</span>
              </button>
              <p className="text-xs text-gray-500 mt-3">
                We typically respond right away
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // If hideEmptyState is true and no messages, show lesson-specific empty state
  if (messages.length === 0 && !isLoading && hideEmptyState) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center w-full px-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ask about the lesson
          </h3>
          <p className="text-sm text-gray-600">
            Get help understanding concepts, ask questions, or clarify any
            doubts
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-start mb-4">
          <div className="bg-gray-100 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{animationDelay: "0.1s"}}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{animationDelay: "0.2s"}}
                />
              </div>
              <span className="text-sm text-gray-600">Thinking...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
