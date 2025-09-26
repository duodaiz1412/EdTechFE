import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {logout} from "@/redux/slice/userSlice";
import {Presentation, User, Settings, LogOut} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";

export default function AvatarMenu() {
  const userData = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const haveAvatarImage = userData?.image !== undefined;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="dropdown">
      <div
        className={`avatar ${!haveAvatarImage && "avatar-placeholder"}`}
        role="button"
        tabIndex={0}
      >
        <div
          className={`w-9 rounded-full ${!haveAvatarImage && "bg-black text-white"}`}
        >
          {haveAvatarImage && <img src={userData?.image} />}
          {!haveAvatarImage && (
            <span className="select-none">{userData?.name[0]}</span>
          )}
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
          <button className="text-red-500 font-semibold" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </li>
      </div>
    </div>
  );
}
