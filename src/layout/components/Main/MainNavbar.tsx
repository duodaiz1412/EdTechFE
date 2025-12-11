import {Link, useLocation} from "react-router";
import {useAppSelector} from "@/redux/hooks";

import Logo from "@/components/Logo";
import AvatarMenu from "@/components/AvatarMenu";
import {BookOpenText, Video} from "lucide-react";

export default function MainNavbar() {
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const userData = useAppSelector((state) => state.user.data);

  const handleAuthen = () => {
    const redirectPath = location.pathname;
    localStorage.setItem("redirectAfterAuthen", redirectPath);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 px-6 py-3 shadow flex items-center justify-between bg-white z-10">
      <Logo />
      {isAuthenticated && (
        <div className="space-x-4 flex items-center">
          {userData?.roles.includes("COURSE_CREATOR") && (
            <Link
              to="/my-batches"
              className="flex items-center space-x-2 hover:bg-blue-50 hover:text-blue-400 p-2 rounded-lg transition-colors"
            >
              <span>My batches</span>
              <Video size={18} />
            </Link>
          )}
          <Link
            to="/learning"
            className="flex items-center space-x-2 hover:bg-blue-50 hover:text-blue-400 p-2 rounded-lg transition-colors"
          >
            <span>My learning</span>
            <BookOpenText size={18} />
          </Link>
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
