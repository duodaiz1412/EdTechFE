import {useLocation} from "react-router-dom";
import {BookOpen, BarChart3, CreditCard, Video} from "lucide-react";
import {InstructorSidebarItem} from "./InstructorSidebarItem";
import Logo from "@/components/Logo";

export default function InstructorSidebar() {
  const location = useLocation();

  const sidebarItems = [
    {
      to: "/instructor",
      icon: <BookOpen className="w-5 h-5" />,
      label: "Courses",
    },
    {
      to: "/instructor/batch",
      icon: <Video className="w-5 h-5" />,
      label: "Batches",
    },
    {
      to: "/instructor/statistic",
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Statistics",
    },
    {
      to: "/instructor/payment",
      icon: <CreditCard className="w-5 h-5" />,
      label: "Payment",
    },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-1/6 bg-white border-r border-gray-200 shadow-sm z-50">
      {/* Header */}
      <div className="px-6 py-4">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {sidebarItems.map((item) => (
          <InstructorSidebarItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={
              item.to === "/instructor"
                ? location.pathname === "/instructor"
                : location.pathname.startsWith(item.to)
            }
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
