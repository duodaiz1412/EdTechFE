import AvatarMenu from "@/components/AvatarMenu";
import Logo from "@/components/Logo";
import {useAppSelector} from "@/redux/hooks";
import {Link} from "react-router-dom";

interface BatchNavbarProps {
  batchSlug?: string;
  batchName?: string;
}

export default function BatchNavbar({batchSlug, batchName}: BatchNavbarProps) {
  const userData = useAppSelector((state) => state.user.data);

  return (
    <nav className="fixed top-0 left-0 right-0 px-6 py-3 shadow flex items-center justify-between bg-white z-10">
      <div className="flex items-center space-x-4">
        <Logo />
        <div className="border-l-2 border-l-slate-900 h-5"></div>
        {userData?.roles.includes("COURSE_CREATOR") ? (
          <Link to={"/my-batches"} className="font-semibold text-lg">
            My Batches
          </Link>
        ) : (
          <Link to={`/batch/${batchSlug}`} className="font-semibold text-lg">
            {batchName}
          </Link>
        )}
      </div>
      <AvatarMenu />
    </nav>
  );
}
