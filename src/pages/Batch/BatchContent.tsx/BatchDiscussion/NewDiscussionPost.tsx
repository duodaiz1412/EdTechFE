import QuillMarkdownEditor from "@/components/QuillMarkdownEditor/QuillMarkdownEditor";
import {batchServices} from "@/lib/services/batch.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {useState} from "react";
import {toast} from "react-toastify";

interface NewDiscussionPostProps {
  setIsOpen: (value: boolean) => void;
  batchId: string;
}

export default function NewDiscussionPost({
  batchId,
  setIsOpen,
}: NewDiscussionPostProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleNewPost = async () => {
    if (!title || !content) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const accessToken = await getAccessToken();
    const response = await batchServices.createDiscussionPost(
      accessToken,
      batchId,
      title,
      content,
    );
    if (response.status === 200) {
      toast.success("Post created successfully.");
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="w-full max-w-[1200px] rounded-lg p-6 bg-white">
        <div className="w-5/6 mx-auto space-y-4 my-4">
          <h2 className="text-2xl font-semibold mb-6">New post</h2>
          <div className="space-y-1 flex flex-col">
            <label htmlFor="post-title">Title*</label>
            <input
              id="post-title"
              type="text"
              value={title}
              className="input w-full rounded-lg"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="post-title">Content*</label>
            <QuillMarkdownEditor
              value={content}
              onChange={(value) => setContent(value)}
              placeholder="Enter post content"
              className="w-full"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              className="btn btn-neutral rounded-lg"
              onClick={handleNewPost}
            >
              Create post
            </button>
            <button className="btn rounded-lg" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
