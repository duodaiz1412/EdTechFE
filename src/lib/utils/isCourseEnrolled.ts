import {Enrollment} from "@/types";

export const isCourseEnrolled = (
  enrollments?: Enrollment[],
  courseSlug?: string,
) => {
  return (
    enrollments?.some((enroll) => enroll.courseSlug === courseSlug) || false
  );
};
