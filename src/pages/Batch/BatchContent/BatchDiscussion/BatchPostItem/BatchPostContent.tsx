import Avatar from "@/components/Avatar";
import HtmlDisplay from "@/components/HtmlDisplay";
import {BatchPost} from "@/types";

interface BatchPostContentProps {
  post: BatchPost;
}

export default function BatchPostContent({post}: BatchPostContentProps) {
  return (
    <div className="space-y-6 px-6 pb-4">
      <div className="space-x-4 flex items-center">
        <Avatar
          imageUrl={post.author?.userImage}
          name={post.author?.fullName}
        />
        <h3 className="text-lg font-semibold">{post.author?.fullName}</h3>
      </div>
      <div className="space-y-2">
        <h4 className="text-2xl font-semibold">{post.title}</h4>
        <div className="p-4 rounded-md bg-slate-100">
          <HtmlDisplay html={post.content || ""} />
        </div>
      </div>
    </div>
  );
}
