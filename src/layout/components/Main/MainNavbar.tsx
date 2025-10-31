import AvatarMenu from "@/components/AvatarMenu";
import Logo from "@/components/Logo";
import {useAppSelector} from "@/redux/hooks";
import {Bell} from "lucide-react";
import {Link} from "react-router";

export default function MainNavbar() {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

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
          <Link to="/register" className="btn rounded-lg">
            Register
          </Link>
          <Link to="/login" className="btn bg-neutral rounded-lg text-white">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
