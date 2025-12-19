import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {Link} from "react-router-dom";
import {Tooltip} from "react-tooltip";

import {Course} from "@/types";
import {publicServices} from "@/lib/services/public.services";
import {formatPrice} from "@/lib/utils/formatPrice";

import {CourseTooltip} from "./CourseTooltip";
import ReadOnlyRating from "@/components/ReadOnlyRating";
import {getFileUrlFromMinIO} from "@/lib/services/upload.services";

interface CourseItemProps {
  course: Course;
  isEnrolled?: boolean;
}

export default function CourseItem({course, isEnrolled}: CourseItemProps) {
  const [imgLink, setImgLink] = useState<string>();

  const {data} = useQuery({
    queryKey: ["average-rating", course.slug],
    queryFn: async () => {
      const response = await publicServices.getAverageRating(course.slug!);
      return response;
    },
  });

  useEffect(() => {
    async function fetchImage() {
      if (course.image) {
        const imgLink = await getFileUrlFromMinIO(course.image);
        setImgLink(imgLink.uploadUrl);
      }
    }
    fetchImage();
  }, [course.image]);

  return (
    <>
      <Link
        key={course.id}
        to={`/course/${course.slug}`}
        className="bg-base-50 border border-slate-300 rounded-lg overflow-hidden"
        data-tooltip-id={`course-tooltip-${course.id}`}
      >
        {/* Course image */}
        <figure className="h-56 border-b border-b-slate-200">
          {imgLink && (
            <img className="w-full h-full object-cover" src={imgLink} />
          )}
          {!imgLink && (
            <div className="w-full h-full bg-slate-100 flex justify-center items-center text-slate-500">
              No image
            </div>
          )}
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
            <span className="text-lg font-bold">
              {course.paidCourse &&
                formatPrice(course.sellingPrice, course.currency || "VND")}
              {!course.paidCourse && "Free"}
            </span>
          )}
        </div>
      </Link>
      <Tooltip
        id={`course-tooltip-${course.id}`}
        place="right-start"
        variant="light"
        className="!p-0 border-0 shadow-xl"
        opacity={1}
        clickable
        delayShow={50}
      >
        <CourseTooltip course={course} />
      </Tooltip>
    </>
  );
}
