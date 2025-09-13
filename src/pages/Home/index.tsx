import {Link} from "react-router-dom";

type Course = {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  price: number;
  image: string;
  badge?: string;
};

const sampleCourses: Course[] = [
  {
    id: "c1",
    title: "React + TypeScript cơ bản đến nâng cao",
    instructor: "Nguyễn Minh",
    rating: 4.8,
    price: 299000,
    image: "/vite.svg",
    badge: "Bán chạy",
  },
  {
    id: "c2",
    title: "Spring Boot cho người mới bắt đầu",
    instructor: "Trần Huy",
    rating: 4.7,
    price: 249000,
    image: "/vite.svg",
  },
  {
    id: "c3",
    title: "SQL & Data Modeling thực chiến",
    instructor: "Lê Anh",
    rating: 4.6,
    price: 199000,
    image: "/vite.svg",
  },
  {
    id: "c4",
    title: "UI/UX Design: Tư duy và quy trình",
    instructor: "Phạm Thảo",
    rating: 4.5,
    price: 179000,
    image: "/vite.svg",
  },
  {
    id: "c5",
    title: "Node.js & REST API từ A-Z",
    instructor: "Hoàng Khoa",
    rating: 4.7,
    price: 279000,
    image: "/vite.svg",
  },
  {
    id: "c6",
    title: "Next.js 14: Xây dựng ứng dụng sản xuất",
    instructor: "Bùi Quân",
    rating: 4.9,
    price: 349000,
    image: "/vite.svg",
    badge: "Mới",
  },
];

const categories: {key: string; label: string}[] = [
  {key: "dev", label: "Lập trình"},
  {key: "design", label: "Thiết kế"},
  {key: "data", label: "Dữ liệu"},
  {key: "marketing", label: "Marketing"},
  {key: "business", label: "Kinh doanh"},
  {key: "language", label: "Ngôn ngữ"},
];

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200" data-theme="light">
      {/* Hero với search */}
      <section className="bg-base-100 border-b border-base-300">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Học kỹ năng mới. Nâng tầm sự nghiệp của bạn.
              </h1>
              <p className="mt-4 text-base-content/70">
                Khám phá hàng trăm khoá học chất lượng do các giảng viên uy tín
                biên soạn. Học theo tốc độ của bạn, mọi lúc mọi nơi.
              </p>

              <div className="mt-6 flex flex-row gap-2">
                <label className="input input-bordered flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.5 3.75a6.75 6.75 0 015.364 10.837l3.274 3.275a.75.75 0 11-1.06 1.06l-3.275-3.274A6.75 6.75 0 1110.5 3.75zm0 1.5a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="text"
                    className="grow"
                    placeholder="Tìm kiếm khoá học, chủ đề, giảng viên..."
                  />
                </label>
                <button className="btn btn-primary">Tìm</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button key={c.key} className="btn btn-sm rounded-full">
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border border-base-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-medium">
                      Khám phá khoá học nổi bật
                    </span>
                  </div>
                  <p className="text-base-content/70">
                    Hình minh hoạ/preview video
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories nổi bật */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold">Danh mục phổ biến</h2>
          <Link to="#" className="link link-primary">
            Xem tất cả
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((c) => (
            <Link
              key={c.key}
              to={`/#cat-${c.key}`}
              className="card bg-base-100 hover:shadow-md transition-shadow"
            >
              <div className="card-body p-4 items-center text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {c.label.charAt(0)}
                </div>
                <div className="text-sm mt-1">{c.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Lưới khoá học */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold">Khoá học nổi bật</h2>
          <Link to="#" className="link link-primary">
            Xem tất cả
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sampleCourses.map((course) => (
            <Link
              key={course.id}
              to={`/course/${course.id}`}
              className="card bg-base-100 hover:shadow-lg transition-shadow"
            >
              <figure className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-40 object-contain bg-base-200"
                />
                {course.badge ? (
                  <span className="badge badge-primary absolute left-3 top-3">
                    {course.badge}
                  </span>
                ) : null}
              </figure>
              <div className="card-body p-4">
                <h3 className="card-title text-base line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-base-content/70">
                  {course.instructor}
                </p>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <div className="rating rating-sm">
                    {Array.from({length: 5}).map((_, i) => (
                      <input
                        key={i}
                        type="radio"
                        name={`rating-${course.id}`}
                        className={`mask mask-star-2 ${i < Math.round(course.rating) ? "bg-amber-400" : "bg-base-300"}`}
                        readOnly
                      />
                    ))}
                  </div>
                  <span>{course.rating.toFixed(1)}</span>
                </div>
                <div className="mt-2 font-semibold">
                  {course.price.toLocaleString()}đ
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="container mx-auto px-4 py-10">
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body items-center text-center">
            <h3 className="text-2xl md:text-3xl font-bold">
              Bạn là giảng viên?
            </h3>
            <p className="text-base-content/70 mt-2">
              Chia sẻ kiến thức, xây dựng thương hiệu cá nhân và kiếm thu nhập
              cùng chúng tôi.
            </p>
            <div className="mt-4">
              <Link to="/instructor/apply" className="btn btn-primary">
                Bắt đầu ngay
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
