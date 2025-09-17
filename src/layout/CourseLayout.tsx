import CourseNavbar from "./components/Course/CourseNavbar";
import CourseSidebar from "./components/Course/CourseSidebar";

interface CourseLayoutProps {
  children: JSX.Element;
}

export default function CourseLayout({children}: CourseLayoutProps) {
  return (
    <div>
      <CourseNavbar />
      <CourseSidebar />
      <main className="mt-16 ml-32 px-4 py-6">{children}</main>
    </div>
  );
}
