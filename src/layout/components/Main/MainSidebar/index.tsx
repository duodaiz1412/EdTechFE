import {BookOpen, Clipboard, Info, Shield, Video} from "lucide-react";
import {MainSidebarItem} from "./MainSidebarItem";

export default function MainSidebar() {
  return (
    <div className="fixed top-16 left-0 z-10 w-32">
      <div className="p-4 space-y-2">
        <MainSidebarItem to="/" icon={<BookOpen />} label="Courses" />
        <MainSidebarItem to="/batches" icon={<Video />} label="Batches" />
        <MainSidebarItem to="/about" icon={<Info />} label="About us" />
        <MainSidebarItem
          to="/terms"
          icon={<Clipboard />}
          label="Terms of use"
        />
        <MainSidebarItem
          to="/privacy"
          icon={<Shield />}
          label="Privacy & policy"
        />
      </div>
    </div>
  );
}
