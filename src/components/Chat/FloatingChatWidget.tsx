import {useState, useEffect} from "react";
import {Bot} from "lucide-react";
import {ChatWidget} from "./ChatWidget";
import {cn} from "@/lib/utils";
import {useAppSelector} from "@/redux/hooks";
import {selectIsAuthenticated} from "@/redux/slice/userSlice";
import {useChatActions, useChatSelectors} from "@/stores/chatStore";

export const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const {createSession, setCurrentSession} = useChatActions();
  const {sessions, currentSessionId} = useChatSelectors();

  // Tìm hoặc tạo session cho floating chat (không có noteId/lessonId)
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      // Tìm session floating chat cũ nhất (không có noteId và lessonId)
      const floatingSession = sessions.find((s) => !s.noteId && !s.lessonId);

      if (floatingSession) {
        // Tìm thấy session cũ, sử dụng lại
        setCurrentSession(floatingSession.sessionId);
      } else {
        // Không tìm thấy, tạo session mới
        const newSessionId = createSession({});
        setCurrentSession(newSessionId);
      }
    }
  }, [isOpen, isAuthenticated, sessions, createSession, setCurrentSession]);

  if (!isAuthenticated) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Chat Widget */}
      {isOpen && (
        <div
          className={cn(
            "mb-4 w-[calc(100vw-2rem)] sm:w-[380px]",
            "h-[calc(100vh-8rem)] sm:h-[600px] max-h-[600px]",
            "rounded-lg shadow-2xl",
            "bg-white",
            "border border-gray-200",
            "flex flex-col overflow-hidden",
            "animate-in slide-in-from-bottom-4 fade-in duration-200",
          )}
        >
          {currentSessionId && (
            <ChatWidget
              sessionId={currentSessionId}
              className="flex-1"
              onClose={handleToggle}
            />
          )}
        </div>
      )}

      {/* Toggle Button - Only show when closed */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg",
            "bg-blue-500 hover:bg-blue-600",
            "text-white",
            "flex items-center justify-center",
            "transition-all duration-200",
            "hover:scale-110 active:scale-95",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          )}
          aria-label="Open chat"
          title="Open chat"
        >
          <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
    </div>
  );
};
