import {Instructor} from "@/types";

export const checkIsInstructor = (
  userId: string,
  instructors: Instructor[] | undefined,
): boolean => {
  if (!instructors || instructors.length === 0) {
    return false;
  }
  return instructors.some((instructor) => instructor.id === userId);
};
