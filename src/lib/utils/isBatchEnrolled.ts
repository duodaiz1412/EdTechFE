import {BatchEnrollment} from "@/types";

export const isBatchEnrolled = (
  enrollments: BatchEnrollment[],
  batchSlug?: string,
) => {
  return enrollments?.some((enroll) => enroll.slug === batchSlug) || false;
};
