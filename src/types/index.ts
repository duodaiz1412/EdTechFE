// Common API Response Types
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
}

export interface IDataWithMeta<T> {
  data: T;
  meta: {
    totalPage: number;
    totalItems: number;
    currentPage: number;
    pageSize?: number;
  };
}

// EdTech Domain Types
export interface Course {
  id: string;
  title: string;
  shortIntroduction?: string;
  description?: string;
  image?: string;
  videoLink?: string;
  tags?: string;
  category?: string;
  status: CourseStatus;
  published: boolean;
  publishedOn?: string;
  upcoming: boolean;
  featured: boolean;
  disableSelfLearning: boolean;
  paidCourse: boolean;
  coursePrice?: number;
  currency?: string;
  amountUsd?: number;
  enableCertification: boolean;
  paidCertificate: boolean;
  enrollments: number;
  lessons: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  title: string;
  courseId: string;
  isScormPackage: boolean;
  scormPackage?: string;
  scormPackagePath?: string;
  manifestFile?: string;
  launchFile?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  chapterId: string;
  courseId: string;
  content?: string;
  videoUrl?: string;
  fileUrl?: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  memberId: string;
  courseId: string;
  memberType: EnrollmentMemberType;
  role: EnrollmentRole;
  progress?: number;
  currentLessonId?: string;
  paymentId?: string;
  purchasedCertificate: boolean;
  certificateId?: string;
  cohortId?: string;
  subgroupId?: string;
  batchOldId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  memberId: string;
  billingName: string;
  source?: string;
  paymentForDocumentType?: string;
  paymentForDocument?: string;
  paymentReceived: boolean;
  paymentForCertificate: boolean;
  currency: string;
  amount: number;
  amountWithGst?: number;
  orderId?: string;
  paymentId?: string;
  addressId?: string;
  gstin?: string;
  pan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  certificateNumber: string;
  issuedDate: string;
  validUntil?: string;
  status: CertificateStatus;
  createdAt: string;
  updatedAt: string;
}

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

// Auth Types
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  userImage?: string;
  enabled: boolean;
  userType: string;
  lastActive?: string;
  roles: UserRole[];
}

export interface UserRole {
  id: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
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
