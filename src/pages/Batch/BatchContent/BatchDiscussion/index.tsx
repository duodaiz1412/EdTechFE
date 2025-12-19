import {batchServices} from "@/lib/services/batch.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {BatchPost} from "@/types";
import {useQuery} from "@tanstack/react-query";
import {Pen} from "lucide-react";
import {useState} from "react";
import NewDiscussionPost from "./NewDiscussionPost";
import BatchPostItem from "./BatchPostItem/BatchPostItem";

interface BatchDiscussionProps {
  batchId?: string;
}

export default function BatchDiscussion({batchId}: BatchDiscussionProps) {
  const [posts, setPosts] = useState<BatchPost[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isNewPost, setIsNewPost] = useState(false);

  useQuery({
    queryKey: ["batch_discussion_posts", page, isNewPost],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await batchServices.getDiscussionPosts(
        accessToken,
        batchId || "",
        page,
      );
      setPosts(response?.content);
      setTotalPages(response?.pagination?.totalPages || 1);
      return response;
    },
  });

  return (
    <>
      {/* All posts */}
      <div className="space-y-4">
        <button
          className="btn rounded-lg space-x-2"
          onClick={() => setIsNewPost(true)}
        >
          <Pen size={20} />
          <span>New Post</span>
        </button>
        {posts.length === 0 && (
          <div className="p-6 border border-slate-200 bg-slate-50 rounded-lg text-center text-slate-400">
            No discussion yet.
          </div>
        )}
        {posts.length > 0 && (
          <>
            {/* All posts */}
            <div>
              {posts.map((post) => (
                <BatchPostItem key={post.id} post={post} batchId={batchId} />
              ))}
            </div>
            {/* Pagination */}
            <div className="join join-horizontal w-full justify-center">
              <button
                className="btn join-item "
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>
              <button className="btn join-item">{page + 1}</button>
              <button
                className="btn join-item "
                disabled={page === totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      {/* New post */}
      {isNewPost && (
        <NewDiscussionPost batchId={batchId || ""} setIsOpen={setIsNewPost} />
      )}
    </>
  );
}
