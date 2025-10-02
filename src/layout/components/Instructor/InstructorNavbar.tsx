import AvatarMenu from "@/components/AvatarMenu";
import {Bell} from "lucide-react";
import {Link} from "react-router-dom";

export default function InstructorNavbar() {
  return (
    <nav className="fixed top-0 right-0 left-[16.6667%] px-6 py-3 bg-white shadow flex space-x-2 items-center justify-end z-10">
      <Link to="/">Student</Link>
      <button className="btn btn-circle btn-ghost">
        <Bell size={20} color="#212121" />
      </button>
      <AvatarMenu />
    </nav>
  );
}
