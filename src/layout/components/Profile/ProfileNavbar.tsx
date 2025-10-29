import AvatarMenu from "@/components/AvatarMenu";
import {Bell} from "lucide-react";

export default function ProfileNavbar() {
  return (
    <nav className="w-5/6 fixed top-0 right-0 px-6 py-3 bg-white shadow flex space-x-2 items-center justify-end z-10">
      <button className="btn btn-circle btn-ghost">
        <Bell size={20} color="#212121" />
      </button>
      <AvatarMenu />
    </nav>
  );
}
