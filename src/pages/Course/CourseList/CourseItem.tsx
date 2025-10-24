import {Link} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";

import {Course} from "@/types";
import {formatPrice} from "@/lib/utils/formatPrice";
import ReadOnlyRating from "@/components/ReadOnlyRating";
import {publicServices} from "@/lib/services/public.services";

interface CourseItemProps {
  course: Course;
  isEnrolled?: boolean;
}

export default function CourseItem({course, isEnrolled}: CourseItemProps) {
  const {data} = useQuery({
    queryKey: ["average-rating", course.slug],
    queryFn: async () => {
      const response = await publicServices.getAverageRating(course.slug!);
      return response;
    },
  });

  return (
    <Link
      key={course.id}
      to={`/course/${course.slug}`}
      className="card border border-slate-300 shadow-sm hover:-translate-y-1 transition-all overflow-hidden"
    >
      {/* Course image */}
      <figure className="h-56 border-b border-b-slate-200">
        {course.image && <img className="w-full" src={course.image} />}
        {!course.image && <div className="w-full h-full bg-slate-200"></div>}
      </figure>
      {/* Course info */}
      <div className="card-body">
        <h2 className="card-title">{course.title}</h2>
        <div>
          <span>Create by: </span>
          {course.instructors?.map((instructor) => (
            <span key={instructor.id}>{instructor.fullName}</span>
          ))}
        </div>
        <div className="flex space-x-2 items-start">
          <span className="font-semibold text-sm text-orange-900">
            {data || 0}
          </span>
          <ReadOnlyRating rating={data || null} size="xs" />
        </div>
        {isEnrolled && (
          <div className="badge bg-blue-600 text-white">Enrolled</div>
        )}
        {!isEnrolled && (
          <div className="font-bold space-x-1">
            {formatPrice(course.sellingPrice, course.currency)}
          </div>
        )}
      </div>
    </Link>
  );
}
