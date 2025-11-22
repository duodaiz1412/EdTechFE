import {Bell} from "lucide-react";
import {Link, useLocation} from "react-router";
import {useAppSelector} from "@/redux/hooks";

import Logo from "@/components/Logo";
import AvatarMenu from "@/components/AvatarMenu";

export default function MainNavbar() {
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const handleAuthen = () => {
    const redirectPath = location.pathname;
    localStorage.setItem("redirectAfterAuthen", redirectPath);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 px-6 py-3 shadow flex items-center justify-between bg-white z-10">
      <Logo />
      {isAuthenticated && (
        <div className="space-x-2 flex items-center">
          <Link to="/learning">My learning</Link>
          <button className="btn btn-circle btn-ghost">
            <Bell size={20} color="#212121" />
          </button>
          <AvatarMenu />
        </div>
      )}
      {!isAuthenticated && (
        <div className="space-x-2">
          <Link
            to="/register"
            className="btn rounded-lg"
            onClick={handleAuthen}
          >
            Register
          </Link>
          <Link
            to="/login"
            className="btn bg-neutral rounded-lg text-white"
            onClick={handleAuthen}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
