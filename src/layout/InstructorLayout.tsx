import InstructorNavbar from "./components/Instructor/InstructorNavbar";
import InstructorSidebar from "./components/Instructor/InstructorSidebar";

interface InstructorLayoutProps {
  children: JSX.Element;
}

export default function InstructorLayout({children}: InstructorLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <InstructorSidebar />
      <div className="flex flex-col flex-1 ml-[16.6667%]">
        <InstructorNavbar />
        <main className="mt-20 p-6">{children}</main>
      </div>
    </div>
  );
}
