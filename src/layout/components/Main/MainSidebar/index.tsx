import {BookOpen, CircleQuestionMark, Home, Info, Video} from "lucide-react";
import {MainSidebarItem} from "./MainSidebarItem";

export default function MainSidebar() {
  const routes = [
    {to: "/", icon: <Home />, label: "Home"},
    {to: "/courses", icon: <BookOpen />, label: "Courses"},
    {to: "/batches", icon: <Video />, label: "Batches"},
    {to: "/help", icon: <CircleQuestionMark />, label: "Support"},
    {to: "/about", icon: <Info />, label: "About us"},
  ];

  return (
    <div className="fixed top-16 left-0 z-10 w-32">
      <div className="p-4 space-y-2">
        {routes.map((route) => (
          <MainSidebarItem
            key={route.to}
            to={route.to}
            icon={route.icon}
            label={route.label}
          />
        ))}
      </div>
    </div>
  );
}
