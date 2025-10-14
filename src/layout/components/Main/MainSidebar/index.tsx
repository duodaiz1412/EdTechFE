import {BookOpen, CircleQuestionMark, Info, Video} from "lucide-react";
import {MainSidebarItem} from "./MainSidebarItem";

export default function MainSidebar() {
  return (
    <div className="fixed top-16 left-0 z-10 w-32">
      <div className="p-4 space-y-2">
        <MainSidebarItem to="/" icon={<BookOpen />} label="Courses" />
        <MainSidebarItem to="/batches" icon={<Video />} label="Batches" />
        <MainSidebarItem
          to="/help"
          icon={<CircleQuestionMark />}
          label="Support"
        />
        <MainSidebarItem to="/about" icon={<Info />} label="About us" />
      </div>
    </div>
  );
}
