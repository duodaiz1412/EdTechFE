import ReadOnlyRating from "@/components/ReadOnlyRating";
import {categories} from "@/mockData/categories";
import {courses} from "@/mockData/courses";
import {useState} from "react";
import {Link} from "react-router-dom";

export default function Courses() {
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [displayedCourses, setDisplayedCourses] = useState(courses);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value, checked} = e.target;

    if (checked) {
      setFilteredCategories((prev: string[]) => [...prev, value]);
    } else {
      setFilteredCategories((prev: string[]) =>
        prev.filter((category: string) => category !== value),
      );
    }
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
        {displayedCourses.map((course) => (
          <Link
            to={`/course/${course.id}`}
            key={course.id}
            className="card shadow hover:-translate-y-1 transition-all"
          >
            <figure>
              <img src={course.thumbnail} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{course.title}</h2>
              <div className="flex space-x-2">
                {course.instructors.map((instructor) => (
                  <span key={instructor} className="text-slate-500 text-xs">
                    {instructor}
                  </span>
                ))}
              </div>
              <div className="space-x-2 flex items-center">
                <span className="font-semibold text-sm text-orange-900">
                  {course.rating}
                </span>
                <ReadOnlyRating rating={course.rating} size="xs" />
              </div>
              <div className="font-bold space-x-1">
                <span>{course.currency}</span>
                <span>{course.price}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
