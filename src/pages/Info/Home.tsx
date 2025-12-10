// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {Link} from "react-router-dom";
import {useQueries} from "@tanstack/react-query";

import {Batch, Course} from "@/types";
import {publicServices} from "@/lib/services/public.services";

import CourseItem from "../Course/CourseList/CourseItem";
import BatchItem from "../Batch/BatchList/BatchItem";

export default function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const contents = [
    {
      title: "Start Learning",
      description:
        "Explore a wide range of courses and start your learning journey today.",
      to: "/courses",
      gradient: "from-red-500 to-pink-600",
    },
    {
      title: "Join as an Instructor",
      description:
        "Share your knowledge and expertise by becoming an instructor on our platform.",
      to: "/teaching",
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      title: "About Us",
      description:
        "Learn more about our mission to provide quality education for everyone.",
      to: "/about",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      title: "Support",
      description:
        "Need help? Reach out to our support team for assistance with any issues.",
      to: "/help",
      gradient: "from-green-500 to-emerald-600",
    },
  ];

  const results = useQueries({
    queries: [
      {
        queryKey: ["courses"],
        queryFn: async () => {
          const response = await publicServices.getCourses("", "", "", 3);
          return response;
        },
      },
      {
        queryKey: ["batches"],
        queryFn: async () => {
          const response = await publicServices.getBatches("", "", "", 3);
          return response;
        },
      },
    ],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-6xl w-full mx-auto px-4">
        {/* Slider */}
        <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
          <Slider {...settings}>
            {contents.map((content) => (
              <div key={content.title}>
                <div
                  className={`p-12 h-72 flex flex-col justify-center bg-gradient-to-r ${content.gradient}`}
                >
                  <h2 className="text-4xl font-bold text-white mb-4">
                    {content.title}
                  </h2>
                  <p className="text-lg text-white/90 mb-6">
                    {content.description}
                  </p>
                  <Link
                    to={content.to}
                    className="rounded-full px-8 py-3 bg-white text-gray-900 font-semibold inline-block w-fit hover:scale-105 hover:shadow-xl transition-all duration-300"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Courses */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Newest Courses</h2>
            <Link
              to="/courses"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              View More →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results[0].data?.content.map((course: Course) => (
              <CourseItem key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* Batches */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Newest Batches</h2>
            <Link
              to="/batches"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              View More →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results[1].data?.content.map((batch: Batch) => (
              <BatchItem key={batch.id} batch={batch} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
