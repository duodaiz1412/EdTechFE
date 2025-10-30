import {cn} from "@/lib/utils";
import {Link} from "react-router-dom";

interface ProfileSidebarItemProps {
  to: string;
  icon: JSX.Element;
  label: string;
  isActive?: boolean;
}

export const ProfileSidebarItem = ({
  to,
  icon,
  label,
  isActive,
}: ProfileSidebarItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
        "hover:bg-gray-100 hover:text-gray-900",
        "text-gray-600 font-medium group",
        isActive && "bg-blue-50 text-blue-700 border-r-2 border-blue-700",
      )}
    >
      <div
        className={cn(
          "w-5 h-5 flex items-center justify-center transition-colors",
          isActive
            ? "text-blue-700"
            : "text-gray-500 group-hover:text-gray-700",
        )}
      >
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};
