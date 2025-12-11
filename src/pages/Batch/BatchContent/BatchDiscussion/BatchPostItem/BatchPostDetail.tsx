import {BatchPost} from "@/types";
import BatchPostContent from "./BatchPostContent";
import {Send, XIcon} from "lucide-react";
import {useState} from "react";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {batchServices} from "@/lib/services/batch.services";
import {useQuery} from "@tanstack/react-query";
import Avatar from "@/components/Avatar";

interface BatchPostDetailProps {
  post: BatchPost;
  setIsOpen: (value: boolean) => void;
  batchId?: string;
}

export default function BatchPostDetail({
  post,
  setIsOpen,
  batchId,
}: BatchPostDetailProps) {
  const [replies, setReplies] = useState<BatchPost[]>([]);
  const [newReply, setNewReply] = useState("");

  useQuery({
    queryKey: ["batch_post_replies", post.id],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await batchServices.getDiscussionPostReplies(
        accessToken,
        post.id || "",
      );
      setReplies(response?.content);
      return response;
    },
  });

  const handleReply = async () => {
    if (newReply.trim() === "") return;

    const accessToken = await getAccessToken();
    await batchServices.createDiscussionPost(
      accessToken,
      batchId || "",
      "",
      newReply,
      post.id,
    );
    setNewReply("");

    // Refresh replies
    const response = await batchServices.getDiscussionPostReplies(
      accessToken,
      post.id || "",
    );
    setReplies(response?.content);
  };

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="w-1/2 bg-white rounded-lg border-slate-200 pt-6 relative">
        {/* Close button */}
        <button
          className="text-lg absolute top-4 right-8"
          onClick={() => setIsOpen(false)}
        >
          <XIcon />
        </button>
        {/* Post content */}
        <BatchPostContent post={post} />
        <div className="pb-4 space-y-4">
          {/* New reply */}
          <div className="w-full px-6 py-4 border border-slate-200 border-x-0 space-x-4 flex items-center">
            <input
              type="text"
              className="input w-full rounded-lg"
              placeholder="Reply to this post"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
            />
            <button
              className="space-x-2 btn btn-neutral rounded-lg"
              onClick={handleReply}
            >
              <Send size={20} />
              <span>Send</span>
            </button>
          </div>
          {/* All replies */}
          <div className="px-6 space-y-4 h-full max-h-64 overflow-y-scroll">
            {replies.length === 0 && (
              <div className="text-center text-slate-400 py-6">
                No replies yet.
              </div>
            )}
            {replies.length > 0 &&
              replies.map((reply: BatchPost) => (
                <div
                  key={reply.id}
                  className="flex items-start p-4 bg-slate-200 rounded-lg space-x-4"
                >
                  <Avatar
                    imageUrl={reply.author?.userImage}
                    name={reply.author?.fullName}
                  />
                  <div>
                    <h4 className="font-semibold">{reply.author?.fullName}</h4>
                    <div className="mt-1">{reply.content}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
