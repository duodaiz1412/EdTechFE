import {BookOpen, Calendar, Clipboard, Info, Shield} from "lucide-react";
import {SidebarItem} from "./SidebarItem";

export default function CourseSidebar() {
  return (
    <div className="fixed top-16 left-0 z-10 w-32">
      <div className="p-4 space-y-2">
        <SidebarItem
          isActive={true}
          to="/courses"
          icon={<BookOpen />}
          label="Courses"
        />
        <SidebarItem to="/batches" icon={<Calendar />} label="Batches" />
        <SidebarItem to="/about" icon={<Info />} label="About us" />
        <SidebarItem to="/terms" icon={<Clipboard />} label="Terms of use" />
        <SidebarItem to="/privacy" icon={<Shield />} label="Privacy & policy" />
      </div>
    </div>
  );
}
