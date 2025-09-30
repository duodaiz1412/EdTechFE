import ProfileNavbar from "./components/Profile/ProfileNavbar";
import ProfileSidebar from "./components/Profile/ProfileSidebar";

export default function ProfileLayout({children}: {children: JSX.Element}) {
  return (
    <div>
      <ProfileSidebar />
      <ProfileNavbar />
      <main className="mt-16 w-5/6 p-6 ml-auto">{children}</main>
    </div>
  );
}
