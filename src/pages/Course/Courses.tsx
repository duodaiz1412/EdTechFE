import ReadOnlyRating from "@/components/ReadOnlyRating";
import {publicServices} from "@/lib/services/public.services";
import {formatPrice} from "@/lib/utils/formatPrice";
import {Course} from "@/types";
import {useQuery} from "@tanstack/react-query";
import {Link} from "react-router-dom";

export default function Courses() {
  const {data} = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await publicServices.getCourses();
      return response;
    },
  });

  return (
    <div className="w-full max-w-[1380px] space-y-10 mx-auto">
      {/* Courses */}
      <div className="grid grid-cols-3 gap-4">
        {data?.content.map((course: Course) => (
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

              <div className="space-x-2 flex items-center">
                <span className="font-semibold text-sm text-orange-900">
                  {course.rating || 0}
                </span>
                <ReadOnlyRating rating={course.rating} size="sm" />
              </div>
              <div className="font-bold space-x-1">
                {formatPrice(course.sellingPrice, course.currency)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
