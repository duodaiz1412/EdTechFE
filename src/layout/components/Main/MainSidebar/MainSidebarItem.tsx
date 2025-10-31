import {Link} from "react-router-dom";

interface MainSidebarItemProps {
  to: string;
  icon: JSX.Element;
  label: string;
}

export const MainSidebarItem = ({to, icon, label}: MainSidebarItemProps) => {
  return (
    <Link
      to={to}
      className="flex flex-col items-center hover:bg-blue-50 hover:text-blue-500 transition-all p-3 rounded-xl"
    >
      {icon}
      <span className="text-sm text-center">{label}</span>
    </Link>
  );
};
