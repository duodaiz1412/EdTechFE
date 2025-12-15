import {ChatMessage as ChatMessageType} from "@/stores/chatStore";
import {Copy, Check, ExternalLink} from "lucide-react";
import {useState} from "react";
import {toast} from "sonner";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({message}: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const isError = message.error;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div
          className={`max-w-[80%] rounded-lg px-4 py-2 ${
            isError
              ? "bg-red-100 border border-red-300"
              : "bg-blue-600 text-white"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
          {isError && (
            <p className="text-xs mt-1 text-red-600">
              Failed to send. Please try again.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%]">
        <div className="bg-gray-100 rounded-lg px-4 py-3">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <div className="prose prose-sm max-w-none">
                <p className="text-sm whitespace-pre-wrap break-words mb-2 text-gray-900">
                  {message.content}
                </p>
              </div>

              {/* Sources */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Sources:
                  </p>
                  <div className="space-y-1">
                    {message.sources.map((source, index) => {
                      // If source has slug, create course link: /course/{slug}
                      // Otherwise, use url if available (backward compatible)
                      const href = (source as any).slug
                        ? `/course/${(source as any).slug}`
                        : source.url || "#";
                      const title = source.title || "Unknown";
                      const isExternal = !(source as any).slug && source.url;

                      return (
                        <a
                          key={`${source.id || index}-${index}`}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                          {isExternal && <ExternalLink className="w-3 h-3" />}
                          <span className="truncate">{title}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="flex-shrink-0 p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};
