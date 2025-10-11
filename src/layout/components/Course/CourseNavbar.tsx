import AvatarMenu from "@/components/AvatarMenu";
import Logo from "@/components/Logo";
import {Bell, Trophy} from "lucide-react";
import {Link} from "react-router-dom";

interface CourseNavbarProps {
  courseName?: string;
  totalLessons?: number;
  completedLessons?: number;
  progressPercent?: number;
  courseSlug?: string;
}

export default function CourseNavbar({
  courseName,
  totalLessons = 0,
  completedLessons = 0,
  progressPercent = 0,
  courseSlug = "",
}: CourseNavbarProps) {
  const isCompletedCourse = completedLessons === totalLessons;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow px-6 py-3 flex items-center justify-between z-10">
      <div className="flex items-center space-x-3">
        <Logo />
        <div className="border-x border-x-black h-6"></div>
        <Link className="font-semibold" to={`/course/${courseSlug}`}>
          {courseName || ""}
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div
            className="radial-progress border border-slate-50 text-yellow-400"
            style={
              {
                ["--value" as string]: progressPercent,
                ["--size" as string]: "2.5rem",
              } as React.CSSProperties
            }
            role="progressbar"
          >
            <Trophy
              size={20}
              strokeWidth={3}
              className={`${isCompletedCourse && "text-yellow-400"}`}
            />
          </div>
          <p className="text-sm">
            {isCompletedCourse
              ? "Completed"
              : `Progress: ${completedLessons}/${totalLessons}`}
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
