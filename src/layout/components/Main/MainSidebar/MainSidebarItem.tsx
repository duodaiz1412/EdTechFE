import {Link} from "react-router-dom";

interface MainSidebarItemProps {
  to: string;
  icon: JSX.Element;
  label: string;
  isActive?: boolean;
}

export const MainSidebarItem = ({
  to,
  icon,
  label,
  isActive,
}: MainSidebarItemProps) => {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center hover:bg-slate-200 transition-all p-3 rounded-xl ${isActive && "bg-slate-200"}`}
    >
      {icon}
      <span className="text-sm text-center">{label}</span>
    </Link>
  );
};
