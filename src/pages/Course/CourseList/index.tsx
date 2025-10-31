import {useState} from "react";
import {useQuery} from "@tanstack/react-query";

import {Course} from "@/types";
import {useAppSelector} from "@/redux/hooks";
import {publicServices} from "@/lib/services/public.services";
import {isCourseEnrolled} from "@/lib/utils/isCourseEnrolled";

import CourseItem from "./CourseItem";
import {CourseSkeleton} from "./CourseSkeleton";

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>();
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const userData = useAppSelector((state) => state.user.data);

  const {isLoading} = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await publicServices.getCourses();
      setCourses(response.content);
      return response;
    },
  });

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const searchedCourses = await publicServices.getCourses(search);
      setCourses(searchedCourses.content);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = async () => {
    if (search === "") return;
    setIsSearching(true);
    try {
      const allCourses = await publicServices.getCourses();
      setCourses(allCourses.content);
      setSearch("");
    } finally {
      setIsSearching(false);
    }
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
            className="input w-96 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn bg-slate-900 text-white rounded-lg"
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Searching...
              </>
            ) : (
              "Search"
            )}
          </button>
          <button
            className="btn rounded-lg"
            onClick={handleClear}
            disabled={isSearching}
          >
            Clear
          </button>
        </div>
      </div>
      {/* List of courses */}
      {isLoading ? (
        <CourseSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {courses?.map((course: Course) => {
            const isEnrolled = isCourseEnrolled(
              userData?.courseEnrollments || [],
              course?.slug || "",
            );

            return (
              <CourseItem
                key={course.id}
                course={course}
                isEnrolled={isEnrolled}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
