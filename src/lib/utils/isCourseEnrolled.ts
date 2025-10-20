import {CourseEnrollment} from "@/types";

export const isCourseEnrolled = (
  enrollments?: CourseEnrollment[],
  courseSlug?: string,
) => {
  return (
    enrollments?.some((enroll) => enroll.courseSlug === courseSlug) || false
  );
};
