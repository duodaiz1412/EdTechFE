import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {logout} from "@/redux/slice/userSlice";
import {Presentation, User, LogOut, UsersRound, CreditCard} from "lucide-react";
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
          className={`w-9 rounded-full ${!haveAvatarImage && "bg-blue-500 text-white"}`}
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
        {userData?.type === "SYSTEM_USER" && (
          <li>
            <Link to="/users">
              <UsersRound size={20} />
              <span>User Management</span>
            </Link>
          </li>
        )}
        <li>
          <Link to="/instructor">
            <Presentation size={20} />
            <span>Instructor</span>
          </Link>
        </li>
        <li>
          <Link to="/purchases">
            <CreditCard size={20} />
            <span>Purchase History</span>
          </Link>
        </li>
        <li className="hover:bg-red-50">
          <button className="text-red-500 font-semibold" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </li>
      </div>
    </div>
  );
}
