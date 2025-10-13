import ProfileNavbar from "./components/Profile/ProfileNavbar";
import ProfileSidebar from "./components/Profile/ProfileSidebar";

interface ProfileLayoutProps {
  children: JSX.Element;
}

export default function ProfileLayout({children}: ProfileLayoutProps) {
  return (
    <div>
      <ProfileSidebar />
      <ProfileNavbar />
      <main className="mt-16 w-5/6 p-6 ml-auto">{children}</main>
    </div>
  );
}
