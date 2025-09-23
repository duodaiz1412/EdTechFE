import {Bell, Search} from "lucide-react";
import {Link} from "react-router";

export default function MainNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 px-6 py-3 shadow flex items-center justify-between bg-white z-10">
      <h1 className="text-2xl font-bold text-blue-600">Edtech</h1>
      <label className="input rounded-3xl w-1/3 px-4 space-x-4">
        <input type="search" required placeholder="Search for courses" />
        <Search color="#90a1b9" size={20} />
      </label>
      {/* <div className="space-x-2 flex items-center">
        <Link to="/learning">My learning</Link>
        <button className="btn btn-circle btn-ghost">
          <Bell size={20} color="#212121" />
        </button>
        <div>
          <div className="avatar avatar-placeholder">
            <div className="w-9 rounded-full bg-black text-white">
              <span>BH</span>
            </div>
          </div>
        </div>
      </div> */}
      <div className="space-x-2">
        <Link to="/register" className="btn btn-ghost">
          Register
        </Link>
        <Link to="/login" className="btn bg-primary text-white">
          Login
        </Link>
      </div>
    </nav>
  );
}
