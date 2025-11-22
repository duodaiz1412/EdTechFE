import {Link, useLocation} from "react-router-dom";

interface MainSidebarItemProps {
  to: string;
  icon: JSX.Element;
  label: string;
}

export const MainSidebarItem = ({to, icon, label}: MainSidebarItemProps) => {
  const location = useLocation();

  return (
    <Link
      to={to}
      className={`flex flex-col items-center hover:bg-blue-50 hover:text-blue-500 transition-all p-3 rounded-xl ${
        location.pathname === to ? "bg-blue-50 text-blue-500" : ""
      }`}
    >
      {icon}
      <span className="text-sm text-center">{label}</span>
    </Link>
  );
};
