import CourseNavbar from "./components/Course/CourseNavbar";
import CourseSidebar from "./components/Course/CourseSidebar";

export default function CourseLayout({children}: {children: JSX.Element}) {
  return (
    <div>
      <CourseNavbar />
      <CourseSidebar />
      <main className="mt-16 w-3/4 h-[2000px]">{children}</main>
    </div>
  );
}
