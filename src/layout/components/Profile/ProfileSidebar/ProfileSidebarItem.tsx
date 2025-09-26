import {Link} from "react-router-dom";

interface ProfileSidebarItemProps {
  to: string;
  icon: JSX.Element;
  label: string;
}

export const ProfileSidebarItem = ({
  to,
  icon,
  label,
}: ProfileSidebarItemProps) => {
  return (
    <Link
      to={to}
      className="flex items-center px-6 py-4 space-x-4 text-white transition-all hover:bg-slate-200 hover:text-black"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};
