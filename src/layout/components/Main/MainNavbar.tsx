import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {logout} from "@/redux/slice/userSlice";
import {Bell, Presentation, Search, User, Settings, LogOut} from "lucide-react";
import {Link} from "react-router";

export default function MainNavbar() {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const userData = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(logout());
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 px-6 py-3 shadow flex items-center justify-between bg-white z-10">
      <h1 className="text-2xl font-bold text-blue-600">Edtech</h1>
      <label className="input rounded-3xl w-1/3 px-4 space-x-4">
        <input type="search" required placeholder="Search for courses" />
        <Search color="#90a1b9" size={20} />
      </label>
      {isAuthenticated && (
        <div className="space-x-2 flex items-center">
          <Link to="/learning">My learning</Link>
          <button className="btn btn-circle btn-ghost">
            <Bell size={20} color="#212121" />
          </button>
          <div className="dropdown">
            <div
              className="avatar avatar-placeholder"
              role="button"
              tabIndex={0}
            >
              <div className="w-9 rounded-full bg-black text-white">
                <span className="select-none">{userData?.name[0]}</span>
              </div>
            </div>
            <div
              tabIndex={0}
              className="dropdown-content menu w-56 bg-base-100 rounded-box border border-slate-200 right-0 mt-2"
            >
              <li>
                <Link to="/profile">
                  <User size={20} />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/instructor">
                  <Presentation size={20} />
                  <span>Instructor</span>
                </Link>
              </li>
              <li>
                <Link to="/settings">
                  <Settings size={20} />
                  <span>Settings</span>
                </Link>
              </li>
              <li>
                <button
                  className="text-red-500 font-semibold"
                  onClick={handleLogout}
                >
                  <LogOut size={20} />
                  <span>Log out</span>
                </button>
              </li>
            </div>
          </div>
        </div>
      )}
      {!isAuthenticated && (
        <div className="space-x-2">
          <Link to="/register" className="btn btn-ghost">
            Register
          </Link>
          <Link to="/login" className="btn bg-primary text-white">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
