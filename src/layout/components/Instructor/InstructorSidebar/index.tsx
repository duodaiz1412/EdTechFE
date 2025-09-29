import {useLocation} from "react-router-dom";
import {
  BookOpen,
  MessageCircle,
  BarChart3,
  Wrench,
  HelpCircle,
} from "lucide-react";
import {InstructorSidebarItem} from "./InstructorSidebarItem";

export default function InstructorSidebar() {
  const location = useLocation();

  const sidebarItems = [
    {
      to: "/instructor",
      icon: <BookOpen className="w-5 h-5" />,
      label: "Courses",
    },
    {
      to: "/instructor/communication",
      icon: <MessageCircle className="w-5 h-5" />,
      label: "Communication",
    },
    {
      to: "/instructor/performance",
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Performance",
    },
    {
      to: "/instructor/tools",
      icon: <Wrench className="w-5 h-5" />,
      label: "Tools",
    },
    {
      to: "/instructor/resources",
      icon: <HelpCircle className="w-5 h-5" />,
      label: "Resources",
    },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm z-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Edtech</h1>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {sidebarItems.map((item) => (
          <InstructorSidebarItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname.startsWith(item.to)}
          />
        ))}
      </nav>

      {/* Bottom section - có thể thêm user info hoặc settings */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        {/* Có thể thêm user profile hoặc settings ở đây */}
      </div>
    </div>
  );
}
