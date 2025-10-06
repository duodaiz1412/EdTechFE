import AvatarMenu from "@/components/AvatarMenu";
import {Bell} from "lucide-react";
import {Link} from "react-router-dom";

interface CourseNavbarProps {
  courseName?: string;
  totalLessons?: number;
  completedLessons?: number;
  progressPercent?: number;
}

export default function CourseNavbar({
  courseName,
  totalLessons = 0,
  completedLessons = 0,
  progressPercent = 0,
}: CourseNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow px-6 py-3 flex items-center justify-between z-10">
      <div className="flex items-center space-x-3">
        <h1 className="text-blue-600 text-2xl font-bold">Edtech</h1>
        <div className="border-x border-x-black h-6"></div>
        <Link className="font-semibold" to="/">
          {courseName || ""}
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div
            className="radial-progress"
            style={
              {
                ["--value" as string]: progressPercent,
                ["--size" as string]: "2.5rem",
              } as React.CSSProperties
            }
            aria-valuenow={progressPercent}
            role="progressbar"
          >
            <span className="text-xs">{progressPercent}%</span>
          </div>
          <p className="text-sm">
            Your progress: {completedLessons}/{totalLessons}
          </p>
        </div>
        <button className="btn btn-circle btn-ghost">
          <Bell size={20} color="#212121" />
        </button>
        <div>
          <AvatarMenu />
        </div>
      </div>
    </nav>
  );
}
