import AvatarMenu from "@/components/AvatarMenu";

export default function ProfileNavbar() {
  return (
    <nav className="w-5/6 fixed top-0 right-0 px-6 py-3 bg-white shadow flex space-x-2 items-center justify-end z-10">
      <AvatarMenu />
    </nav>
  );
}
