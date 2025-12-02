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
  role?: string;
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

export interface Tag {
  id?: string;
  name?: string;
}

export interface Label {
  id?: string;
  name?: string;
}

export interface CourseInstructor {
  id?: string;
  fullName?: string;
  email?: string;
  userImage?: string;
}

export interface Course {
  id?: string;
  title?: string;
  slug?: string;
  shortIntroduction?: string;
  description?: string;
  image?: string;
  videoLink?: string;
  status?: "DRAFT" | "PUBLISHED";
  paidCourse?: boolean;
  coursePrice?: number;
  sellingPrice?: number;
  currency?: string;
  amountUsd?: number;
  enableCertification?: boolean;
  enrollments?: number;
  lessons?: Lesson[];
  rating: number | null;
  language?: string;
  skillLevel?: string;
  targetAudience?: string;
  learnerProfileDesc?: string;
  tags?: Tag[];
  labels?: Label[];
  instructors?: CourseInstructor[];
}

export interface CourseEnrollment {
  id?: string;
  memberId?: string;
  memberName?: string;
  courseId?: string;
  courseTitle?: string;
  courseSlug?: string;
  memberType?: string;
  role?: string;
  progress?: number;
  currentLessonId?: string;
  currentLessonTitle?: string;
  currentLessonSlug?: string;
  creation?: string;
  modified?: string;
}

export interface Purchase {
  courseTitle?: string;
  price?: number;
  enrollmentDate?: string;
}

export interface QuizQuestion {
  id?: string;
  quizId?: string;
  question?: string;
  type?: string;
  options?: string;
  correctAnswer?: string;
  marks?: number;
  creation?: string;
}

export interface Quiz {
  id?: string;
  title?: string;
  showAnswer?: boolean;
  showSubmissionHistory?: boolean;
  totalMarks?: number;
  creation?: string;
  modified?: string;
  modifiedBy?: string;
  userAttempts?: number;
  questions?: QuizQuestion[];
}

export interface QuizSubmmission {
  id?: string;
  quizId?: string;
  quizTitle?: string;
  memberId?: string;
  memberName?: string;
  score?: number;
  percentage?: number;
  result?: string;
  creation?: string;
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
  quizDto?: Quiz;
}

export interface Chapter {
  id?: string;
  title?: string;
  summary?: string;
  position?: number;
  lessons?: Lesson[];
}

export interface LessonCurrent {
  chapter?: number;
  lesson?: Lesson;
}

export interface Progress {
  courseId?: string;
  courseTitle?: string;
  courseSlug?: string;
  overallProgress?: number;
  completedLessons?: number;
  totalLessons?: number;
  currentLessonId?: string;
  currentLessonTitle?: string;
  currentLessonSlug?: string;
  chapters?: {
    chapterId?: string;
    chapterTitle?: string;
    lessons?: {
      lessonId?: string;
      lessonTitle?: string;
      status?: string;
      completedAt?: string;
      duration?: number;
      videoUrl?: string;
    }[];
  }[];
}

export interface Comment {
  id: string;
  lessonId?: string;
  lessonTitle?: string;
  authorId?: string;
  authorName?: string;
  authorImage?: string;
  content?: string;
  parentId?: string;
  replies?: string[];
  upvotes?: number;
  downvotes?: number;
  canEdit?: boolean;
  canDelete?: boolean;
  userVote?: string;
  creation?: string;
  modified?: string;
}

export interface Review {
  id?: string;
  courseId?: string;
  courseName?: string;
  studentId?: string;
  studentName?: string;
  rating?: number;
  comment?: string;
  isApproved?: boolean;
  creation?: string;
  modified?: string;
}

export interface Order {
  id?: string;
  orderCode?: string;
  studentId?: string;
  studentName?: string;
  instructorId?: string;
  instructorName?: string;
  courseId?: string;
  courseTitle?: string;
  batchId?: string;
  batchTitle?: string;
  paymentId?: string;
  paymentUrl: string;
  qrCode?: string;
  accountNumber?: string;
  amount?: number;
  currency?: string;
  status?: string;
  description?: string;
  returnUrl: string;
  cancelUrl: string;
  paidAt?: string;
  failedAt?: string;
  webhookReceived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Batch {
  id?: string;
  title?: string;
  description?: string;
  slug?: string;
  image?: string;
  videoLink?: string;
  paidBatch?: boolean;
  actualPrice?: number;
  sellingPrice?: number;
  language?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  maxCapacity?: number;
  tags?: Tag[];
  labels?: Label[];
}

export interface BatchPost {
  id?: string;
  title?: string;
  content?: string;
  author?: User;
  createdAt?: string;
  documents?: BatchPostDocument[];
}

export interface BatchPostDocument {
  id?: string;
  batchDiscussionId?: string;
  fileUrl?: string;
  uploadedAt?: string;
}

export interface Item {
  id: string;
  title: string;
  type: "course" | "batch";
  status: "Draft" | "Published";
  publishedAt?: string;
}

export interface InstructorStats {
  totalCoursePublished: number;
  totalBatchPublished: number;
  courseRevenue: number;
  batchRevenue: number;
}

export interface RevenueOverTime {
  type: string;
  period: string;
  groupBy: string;
  currency: string;
  dataPoints: RevenueDataPoint[];
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface PerformanceReportItem {
  id: string;
  title: string;
  totalRevenue: number;
  enrollmentCount: number;
}
