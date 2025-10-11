import ReadOnlyRating from "@/components/ReadOnlyRating";
import {publicServices} from "@/lib/services/public.services";
import {formatPrice} from "@/lib/utils/formatPrice";
import {isCourseEnrolled} from "@/lib/utils/isCourseEnrolled";
import {useAppSelector} from "@/redux/hooks";
import {Course} from "@/types";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {Link} from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>();
  const [search, setSearch] = useState("");
  const userData = useAppSelector((state) => state.user.data);

  useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await publicServices.getCourses();
      setCourses(response.content);
      return response;
    },
  });

  const handleSearch = async () => {
    const searchedCourses = await publicServices.getCourses(search);
    setCourses(searchedCourses.content);
  };

  const handleClear = async () => {
    const allCourses = await publicServices.getCourses();
    setCourses(allCourses.content);
    setSearch("");
  };

  return (
    <div className="w-full p-6 space-y-10">
      {/* Search */}
      <div className="flex justify-between items-center">
        {/* Labels/Categories */}
        <div></div>
        {/* Search bar */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search for courses"
            className="input w-96 rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-neutral rounded-md" onClick={handleSearch}>
            Search
          </button>
          <button className="btn rounded-md" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>
      {/* Courses */}
      <div className="grid grid-cols-4 gap-4">
        {courses?.map((course: Course) => {
          const isEnrolled = isCourseEnrolled(
            userData?.enrollments || [],
            course?.slug || "",
          );
          return (
            <Link
              to={`/course/${course.slug}`}
              key={course.id}
              className="card shadow hover:-translate-y-1 transition-all"
            >
              <figure className="h-56">
                {course.image && <img src={course.image} className="w-full" />}
                {!course.image && (
                  <div className="w-full h-full bg-slate-200"></div>
                )}
              </figure>
              <div className="card-body">
                <h2 className="card-title">{course.title}</h2>
                <div>
                  <span>Create by: </span>
                  {course.instructors?.map((instructor) => (
                    <span key={instructor.id}>{instructor.fullName}</span>
                  ))}
                </div>
                <div className="space-x-2 flex items-center">
                  <span className="font-semibold text-sm text-orange-900">
                    {course.rating || 0}
                  </span>
                  <ReadOnlyRating rating={course.rating} size="sm" />
                </div>
                {isEnrolled ? (
                  <div className="badge badge-primary">Enrolled</div>
                ) : (
                  <div className="font-bold space-x-1">
                    {formatPrice(course.sellingPrice)}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
