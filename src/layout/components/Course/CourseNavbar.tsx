import {Bell} from "lucide-react";
import {Link} from "react-router-dom";

export default function CourseNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow px-6 py-3 flex items-center justify-between z-10">
      <div className="flex items-center space-x-3">
        <h1 className="text-blue-600 text-2xl font-bold">Edtech</h1>
        <div className="border-x border-x-black h-6"></div>
        <Link className="font-semibold" to="/course/1">
          Course name
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div
            className="radial-progress"
            style={
              {
                ["--value" as string]: 70,
                ["--size" as string]: "2.5rem",
              } as React.CSSProperties
            }
            aria-valuenow={70}
            role="progressbar"
          >
            <span className="text-xs">70%</span>
          </div>
          <p className="text-sm">Your progress: 7/10</p>
        </div>
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
      </div>
    </nav>
  );
}
