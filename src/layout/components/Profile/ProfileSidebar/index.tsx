import {useAppSelector} from "@/redux/hooks";
import {CircleUserRound, Settings, UsersRound} from "lucide-react";
import {ProfileSidebarItem} from "./ProfileSidebarItem";
import Logo from "@/components/Logo";
import {useLocation} from "react-router-dom";

export default function ProfileSidebar() {
  const location = useLocation();
  const userData = useAppSelector((state) => state.user.data);

  const sidebarItems = [
    {
      to: "/profile",
      icon: <CircleUserRound />,
      label: "Profile",
    },
    {
      to: "/users",
      icon: <UsersRound />,
      label: "User Management",
    },
    {
      to: "/settings",
      icon: <Settings />,
      label: "Settings",
    },
  ];

  return (
    <div className="fixed top-0 left-0 bottom-0 w-1/6 border-r border-r-slate-200 bg-white shadow-sm">
      <div className="px-6 py-4">
        <Logo />
      </div>
      <div className="p-4 space-y-4">
        {sidebarItems.map((item) => {
          if (
            item.label === "User Management" &&
            userData?.type !== "SYSTEM_USER"
          ) {
            return null;
          }

          return (
            <ProfileSidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.to}
            />
          );
        })}
      </div>
    </div>
  );
}
