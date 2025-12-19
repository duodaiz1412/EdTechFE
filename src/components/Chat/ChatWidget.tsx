import {useState} from "react";
import {useChat} from "@/hooks/useChat";
import {ChatList} from "./ChatList";
import {ChatInput} from "./ChatInput";
import {X, Trash2} from "lucide-react";
import {useChatActions, useChatSelectors} from "@/stores/chatStore";
import {toast} from "sonner";

interface ChatWidgetProps {
  noteId?: string;
  lessonId?: string;
  sessionId?: string;
  className?: string;
  onClose?: () => void;
}

export const ChatWidget = ({
  noteId,
  lessonId,
  sessionId,
  className = "",
  onClose,
}: ChatWidgetProps) => {
  const [showInput, setShowInput] = useState(false);

  const {messages, sendMessage, isLoading} = useChat({
    noteId,
    lessonId,
    sessionId,
  });

  const handleShowInput = () => {
    setShowInput(true);
  };

  const {clearSession} = useChatActions();
  const {currentSessionId} = useChatSelectors();

  const handleClear = () => {
    if (currentSessionId) {
      clearSession(currentSessionId);
      toast.success("Chat cleared");
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">E</span>
          </div>
          <span className="text-sm font-medium text-gray-900">Edtech</span>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4 text-gray-600" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title="Close chat"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ChatList
        messages={messages}
        isLoading={isLoading}
        onShowInput={handleShowInput}
      />

      {/* Input - Show when there are messages or when user clicked "Send us a message" */}
      {(messages.length > 0 || showInput) && (
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      )}
    </div>
  );
};
