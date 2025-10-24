import {useState} from "react";
import {useQuery} from "@tanstack/react-query";

import {Course} from "@/types";
import {useAppSelector} from "@/redux/hooks";
import {isCourseEnrolled} from "@/lib/utils/isCourseEnrolled";
import {publicServices} from "@/lib/services/public.services";
import CourseItem from "./CourseItem";
import {useParams} from "react-router-dom";

export default function CoursesByTag() {
  const {tag} = useParams();
  const [courses, setCourses] = useState<Course[]>();
  const userData = useAppSelector((state) => state.user.data);

  useQuery({
    queryKey: ["courses-by-tag"],
    queryFn: async () => {
      const response = await publicServices.getCourses("", tag as string);
      setCourses(response.content);
      return response;
    },
  });

  return (
    <div className="w-full space-y-10 py-6">
      <h2 className="text-2xl font-semibold">
        Explore courses with tag "{tag}"
      </h2>
      <div className="w-full grid grid-cols-4 gap-4">
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
    </div>
  );
}
