import {useAppSelector} from "@/redux/hooks";
import {CircleUserRound, Settings, UsersRound} from "lucide-react";
import {ProfileSidebarItem} from "./ProfileSidebarItem";

export default function ProfileSidebar() {
  const userData = useAppSelector((state) => state.user.data);

  return (
    <div className="fixed top-0 left-0 bottom-0 w-1/6 bg-slate-900">
      <h1 className="text-2xl font-bold px-6 py-4 text-white">Edtech</h1>
      <div className="space-y-4">
        <ProfileSidebarItem
          to="/profile"
          icon={<CircleUserRound />}
          label="Profile"
        />
        {userData?.type === "SYSTEM_USER" && (
          <ProfileSidebarItem
            to="/cms"
            icon={<UsersRound />}
            label="User Management"
          />
        )}
        <ProfileSidebarItem
          to="/settings"
          icon={<Settings />}
          label="Settings"
        />
      </div>
    </div>
  );
}
