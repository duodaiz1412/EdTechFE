import ReadOnlyRating from "@/components/ReadOnlyRating";
import {publicServices} from "@/lib/services/public.services";
import {categories} from "@/mockData/categories";
import {CourseInfoProps} from "@/types";
import {useQuery} from "@tanstack/react-query";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";

export default function Courses() {
  const {data} = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await publicServices.getCourses();
      return response;
    },
  });

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;

    toast.info("Category filter: " + value);
  };

  return (
    <div className="w-full max-w-[1380px] space-y-10 mx-auto">
      {/* Feature courses */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Feature Courses</h2>
        <div className="carousel rounded-2xl w-full">
          <div className="carousel-item w-full h-[360px] bg-red-400"></div>
          <div className="carousel-item w-full h-[360px] bg-blue-400"></div>
          <div className="carousel-item w-full h-[360px] bg-green-400"></div>
        </div>
      </section>
      {/* Category select */}
      <form className="space-x-2">
        {categories.map((category) => (
          <input
            key={category.id}
            onChange={handleFilter}
            className="btn btn-sm btn-outline rounded-lg"
            type="checkbox"
            name="categories"
            aria-label={category.name}
            value={category.name}
          />
        ))}
      </form>
      {/* Courses */}
      <div className="grid grid-cols-3 gap-4">
        {data?.content.map((course: CourseInfoProps) => (
          <Link
            to={`/course/${course.slug}`}
            key={course.id}
            className="card shadow hover:-translate-y-1 transition-all"
          >
            <figure>
              {course.image && <img src={course.image} />}
              {!course.image && (
                <div className="w-full h-48 bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-400">No Image</span>
                </div>
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
                <span>{course.sellingPrice}</span>
                <span>{course.currency}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
