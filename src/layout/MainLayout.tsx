import MainFooter from "./components/Main/MainFooter";
import MainNavbar from "./components/Main/MainNavbar";
import MainSidebar from "./components/Main/MainSidebar";

interface MainLayoutProps {
  children: JSX.Element;
}

export default function MainLayout({children}: MainLayoutProps) {
  return (
    <div>
      <MainNavbar />
      <MainSidebar />
      <main className="mt-16 ml-32 px-4 py-6 min-h-[720px]">{children}</main>
      <MainFooter />
    </div>
  );
}
