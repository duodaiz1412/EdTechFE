import ProfileNavbar from "./components/Profile/ProfileNavbar";
import ProfileSidebar from "./components/Profile/ProfileSidebar";

export default function ProfileLayout({children}: {children: JSX.Element}) {
  return (
    <div>
      <ProfileSidebar />
      <ProfileNavbar />
      <main className="top-16 w-5/6 p-6 right-0 fixed">{children}</main>
    </div>
  );
}
