import AvatarMenu from "@/components/AvatarMenu";
import Logo from "@/components/Logo";
import {Trophy} from "lucide-react";
import {Link} from "react-router-dom";

interface CourseNavbarProps {
  courseName?: string;
  progressPercent?: number;
  courseSlug?: string;
}

export default function CourseNavbar({
  courseName,
  progressPercent = 0,
  courseSlug = "",
}: CourseNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow px-6 py-3 flex items-center justify-between z-10">
      {/* Left side */}
      <div className="flex items-center space-x-3">
        <Logo />
        <div className="border-x border-x-black h-6"></div>
        <Link className="font-semibold" to={`/course/${courseSlug}`}>
          {courseName}
        </Link>
      </div>
      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Learner progress */}
        <div className="flex items-center space-x-2">
          <div
            className={`radial-progress bg-slate-100 ${progressPercent === 100 && "text-orange-400"}`}
            style={
              {
                ["--value" as string]: progressPercent || 0,
                ["--size" as string]: "2.5rem",
              } as React.CSSProperties
            }
            role="progressbar"
          >
            <Trophy size={16} strokeWidth={3} />
          </div>
          <p className="text-sm">
            Progress: {progressPercent?.toFixed(0) || 0}%
          </p>
        </div>
        {/* Profile menu */}
        <AvatarMenu />
      </div>
    </nav>
  );
}
