// Enums
export enum CourseStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  PUBLISHED = "PUBLISHED",
  DRAFT = "DRAFT",
}

export enum EnrollmentMemberType {
  STUDENT = "STUDENT",
  INSTRUCTOR = "INSTRUCTOR",
  ADMIN = "ADMIN",
}

export enum EnrollmentRole {
  STUDENT = "STUDENT",
  INSTRUCTOR = "INSTRUCTOR",
  ADMIN = "ADMIN",
}

export enum CertificateStatus {
  PENDING = "PENDING",
  ISSUED = "ISSUED",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export const API_VERSIONS = {
  V1: {
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
    headers: {
      "Content-Type": "application/json",
    },
  },
} as const;

export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export interface Role {
  id?: string;
  userId?: string;
  name?: string;
}

export interface User {
  id?: string;
  email?: string;
  username?: string;
  fullName?: string;
  userImage?: string;
  enabled?: boolean;
  userType?: "SYSTEM_USER" | "WEBSITE_USER";
  lastActive?: string;
  roles?: Role[];
}

export interface CourseTag {
  id?: string;
  name?: string;
}

export interface CourseLabel {
  id?: string;
  name?: string;
}

export interface Course {
  id?: string;
  title?: string;
  slug?: string;
  shortIntroduction?: string;
  description?: string;
  image?: string;
  videoLink?: string;
  published?: boolean;
  publishedOn?: string;
  coursePrice?: number;
  sellingPrice?: number;
  currency?: string;
  amountUsd?: number;
  enableCertification?: boolean;
  enrollments?: number;
  lessons?: number;
  rating: number | null;
  language?: string;
  tags?: CourseTag[];
  labels?: CourseLabel[];
}

export interface Enrollment {
  id?: string;
  memberId?: string;
  memberNam?: string;
  courseId?: string;
  courseTitle?: string;
  memberType?: string;
  role?: string;
  progress?: number;
  currentLessonId?: string;
  currentLessonTitle?: string;
  enrolledAt?: string;
}

export interface Lesson {
  id?: string;
  title?: string;
  slug?: string;
  content?: string;
  videoUrl?: string;
  fileUrl?: string;
  duration?: number;
  position?: number;
}

export interface Chapter {
  id?: string;
  title?: string;
  summary?: string;
  position?: number;
  lessons?: Lesson[];
}
