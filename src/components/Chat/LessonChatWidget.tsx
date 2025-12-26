import {useState} from "react";
import {useChat} from "@/hooks/useChat";
import {ChatList} from "./ChatList";
import {ChatInput} from "./ChatInput";
import {BookOpen, MessageSquare, Trash2} from "lucide-react";
import {Chapter, LessonCurrent} from "@/types";
import CourseContentList from "@/pages/Course/CourseContent/CourseContentList";
import {useParams} from "react-router-dom";

interface LessonChatWidgetProps {
  lessonId: string;
  chapters?: Chapter[];
  currentLesson?: LessonCurrent;
}

export const LessonChatWidget = ({
  lessonId,
  chapters,
  currentLesson,
}: LessonChatWidgetProps) => {
  const [activeTab, setActiveTab] = useState<"chapter" | "chat">("chapter");
  const {courseSlug} = useParams();

  const {messages, sendMessage, clearChat, isLoading} = useChat({
    lessonId,
    useV1Endpoint: true, // Use simplified endpoint for lesson chat
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("chapter")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "chapter"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Chapter</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "chat"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>AI Chat</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "chapter" && (
          <div className="h-full overflow-y-auto">
            <CourseContentList
              courseSlug={courseSlug}
              chapters={chapters}
              currentLesson={currentLesson}
            />
          </div>
        )}

        {activeTab === "chat" && (
          <div className="flex flex-col h-full">
            {/* Header with clear button */}
            {messages.length > 0 && (
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
                <span className="text-sm text-gray-600">
                  {messages.length} message{messages.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={clearChat}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                  title="Clear chat history"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              </div>
            )}
            <ChatList
              messages={messages}
              isLoading={isLoading}
              hideEmptyState
            />
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
          </div>
        )}
      </div>
    </div>
  );
};
