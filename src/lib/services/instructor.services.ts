import axios from "axios";
import {config} from "@/config";

const BASE_API = config.BASE_API;

export interface IJob {
  id: string;
  type: string;
  status: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

const INSTRUCTOR_ENDPOINTS = {
  INSTRUCTOR_COURSES: BASE_API + "/instructor/my-courses",
  INSTRUCTOR_COURSE_DETAIL: (courseId: string) =>
    BASE_API + `/instructor/courses/${courseId}`,
  CREATE_COURSE: BASE_API + "/instructor/courses",
  UPDATE_COURSE: (courseId: string) =>
    BASE_API + `/instructor/courses/${courseId}`,
  DELETE_COURSE: (courseId: string) =>
    BASE_API + `/instructor/courses/${courseId}`,
  PUBLISH_COURSE: (courseId: string) =>
    BASE_API + `/instructor/courses/${courseId}/publish`,

  // Chapter endpoints
  CREATE_CHAPTER: (courseId: string) =>
    BASE_API + `/instructor/courses/${courseId}/chapters`,
  UPDATE_CHAPTER: (chapterId: string) =>
    BASE_API + `/instructor/chapters/${chapterId}`,
  DELETE_CHAPTER: (chapterId: string) =>
    BASE_API + `/instructor/chapters/${chapterId}`,
  GET_CHAPTER_BY_ID: (chapterId: string) =>
    BASE_API + `/instructor/chapters/${chapterId}`,

  // Lesson endpoints
  CREATE_LESSON: (chapterId: string) =>
    BASE_API + `/instructor/chapters/${chapterId}/lessons`,
  UPDATE_LESSON: (lessonId: string) =>
    BASE_API + `/instructor/lessons/${lessonId}`,
  DELETE_LESSON: (lessonId: string) =>
    BASE_API + `/instructor/lessons/${lessonId}`,
  GET_LESSON_BY_SLUG: (slug: string) => BASE_API + `/lessons/${slug}`,

  // Enrollment endpoints
  ENROLL_COURSE: (courseId: string) => BASE_API + `/courses/${courseId}/enroll`,
  MY_ENROLLMENTS: BASE_API + "/enrollments/my-courses",

  // Progress tracking
  MARK_LESSON_COMPLETED: (lessonId: string) =>
    BASE_API + `/lessons/${lessonId}/progress`,

  // Quiz endpoints
  CREATE_QUIZ: BASE_API + "/instructor/quizzes",
  UPDATE_QUIZ: (quizId: string) => BASE_API + `/instructor/quizzes/${quizId}`,
  DELETE_QUIZ: (quizId: string) => BASE_API + `/instructor/quizzes/${quizId}`,
  GET_QUIZ_QUESTIONS: (quizId: string) =>
    BASE_API + `/instructor/quizzes/${quizId}/questions`,
  ADD_QUESTIONS_TO_QUIZ: (quizId: string) =>
    BASE_API + `/instructor/quizzes/${quizId}/questions`,
  UPDATE_QUESTION: (questionId: string) =>
    BASE_API + `/instructor/questions/${questionId}`,
  DELETE_QUESTION: (questionId: string) =>
    BASE_API + `/instructor/questions/${questionId}`,
  GET_COURSE_QUIZ_SUBMISSIONS: (courseId: string) =>
    BASE_API + `/instructor/courses/${courseId}/quiz-submissions`,
  GET_COURSE_PROGRESS: (courseId: string) =>
    BASE_API + `/courses/${courseId}/my-progress`,

  // Enrollment Management endpoints
  GET_COURSE_ENROLLMENTS: (courseId: string) =>
    BASE_API + `/instructor/courses/${courseId}/enrollments`,
  REMOVE_ENROLLMENT: (enrollmentId: string) =>
    BASE_API + `/instructor/enrollments/${enrollmentId}`,

  // Course Instructor Management endpoints
  ADD_INSTRUCTOR_TO_COURSE: (courseId: string) =>
    BASE_API + `/instructor/courses/${courseId}/instructors`,
  REMOVE_INSTRUCTOR_FROM_COURSE: (courseId: string, instructorId: string) =>
    BASE_API + `/instructor/courses/${courseId}/instructors/${instructorId}`,
  UPSERT_INSTRUCTOR_TO_COURSE: (courseId: string) =>
    BASE_API + `/instructor/courses/${courseId}/instructors`,

  GET_ALL_INSTRUCTORS: BASE_API + "/instructor",

  // Lesson Management endpoints
  GET_LESSON_BY_ID: (lessonId: string) =>
    BASE_API + `/instructor/lessons/${lessonId}`,

  // Batch Management endpoints
  CREATE_BATCH: BASE_API + "/instructor/batches",
  UPDATE_BATCH: (batchId: string) =>
    BASE_API + `/instructor/batches/${batchId}`,
  DELETE_BATCH: (batchId: string) =>
    BASE_API + `/instructor/batches/${batchId}`,
  GET_MY_BATCHES: BASE_API + "/instructor/my-batches",
  GET_BATCH_BY_ID: (batchId: string) =>
    BASE_API + `/instructor/batches/${batchId}`,
  PUBLISH_BATCH: (batchId: string) =>
    BASE_API + `/instructor/batches/${batchId}/publish`,
  ADD_INSTRUCTOR_TO_BATCH: (batchId: string) =>
    BASE_API + `/instructor/batches/${batchId}/instructors`,
  REMOVE_INSTRUCTOR_FROM_BATCH: (batchId: string, instructorId: string) =>
    BASE_API + `/instructor/batches/${batchId}/instructors/${instructorId}`,

  // PayOS Configuration endpoints
  CREATE_PAYOS_CONFIG: BASE_API + "/instructor/payos-configs",
  GET_MY_PAYOS_CONFIG: BASE_API + "/instructor/payos-configs/my-config",

  // Job Management APIs
  GET_MY_JOBS: BASE_API + "/instructor/my-jobs",
  UPDATE_PAYOS_CONFIG: (configId: string) =>
    BASE_API + `/instructor/payos-configs/${configId}`,

  // Statistic APIs
  STATISTICS_OVERVIEW: BASE_API + "/instructor/statistics/overview",
  STATISTICS_REVENUE_OVER_TIME:
    BASE_API + "/instructor/statistics/revenue-over-time",
  STATISTICS_COURSE_PERFORMANCE:
    BASE_API + "/instructor/statistics/course-performance",
  STATISTICS_BATCH_PERFORMANCE:
    BASE_API + "/instructor/statistics/batch-performance",
} as const;

// Types
export interface ICourseRequest {
  title: string;
  description: string;
  price: number;
  tag?: {name: string}[];
  label?: {name: string}[];
  thumbnailUrl?: string;
  videoUrl?: string;
  image?: string;
  videoLink?: string;
  shortIntroduction?: string;
  language?: string;
  currency?: string;
  coursePrice?: number;
  sellingPrice?: number;
  paidCourse?: boolean;
  targetAudience?: string;
  skillLevel?: string;
  learnerProfileDesc?: string;
}

export interface IChapterRequest {
  title: string;
  description?: string;
}

export interface ILessonRequest {
  title: string;
  content?: string;
  videoUrl?: string;
  quizId?: string;
  fileUrl?: string;
}

export interface CourseFilters {
  tags?: string[];
  labels?: string[];
  search?: string;
  page?: number;
  size?: number;
}

export interface PaginationResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
}

export interface ICourse {
  id: string;
  title: string;
  slug: string;
  shortIntroduction: string | null;
  description: string;
  image: string | null;
  videoLink: string | null;
  status: "DRAFT" | "PUBLISHED";
  coursePrice: number | null;
  sellingPrice: number | null;
  currency: string | null;
  amountUsd: number | null;
  enrollments: number | null;
  lessons: number | null;
  rating: number | null;
  language: string | null;
  targetAudience: string | null;
  skillLevel: string | null;
  learnerProfileDesc: string | null;
  tags: Array<{
    id: string;
    name: string;
  }>;
  labels: Array<{
    id: string;
    name: string;
  }>;
  chapters: IChapter[];
  paidCourse: boolean;
}

export interface IChapter {
  id: string;
  title: string;
  summary?: string;
  slug: string;
  position: number;
  lessons: ILesson[];
}

export interface ILesson {
  id: string;
  title: string;
  slug: string;
  content?: string;
  videoUrl?: string;
  fileUrl?: string;
  position: number;
  duration?: number;
  quizDto?: {
    id: string;
    title: string;
    showAnswers: boolean;
    showSubmissionHistory: boolean;
    totalMarks: number;
    creation: string;
    modified: string;
    modifiedBy: string;
  };
}

export interface EnrollmentResponse {
  id: string;
  course: ICourse;
  enrolledAt: string;
  progress: number;
}

export interface CourseProgressResponse {
  courseId: string;
  courseTitle: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  chapters: {
    id: string;
    title: string;
    lessons: {
      id: string;
      title: string;
      completed: boolean;
      completedAt?: string;
    }[];
  }[];
}

// Batch Management Types
export interface IBatchRequest {
  title: string;
  description?: string;
  image?: string;
  videoLink?: string;
  paidBatch?: boolean;
  actualPrice?: number; // Maps to BigDecimal
  sellingPrice?: number; // Maps to BigDecimal
  amountUsd?: number;
  currency?: string;
  language?: string;
  startTime?: Date; // Maps to LocalDateTime
  endTime?: Date; // Maps to LocalDateTime
  openTime?: Date;
  closeTime?: Date;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  maxCapacity?: number; // Maps to Integer
  languate?: string;
  tags: Array<{
    name: string;
  }>;
  labels: Array<{
    name: string;
  }>;
}

export interface IBatch {
  id: string;
  title: string;
  description?: string;
  image?: string;
  videoLink: string;
  maxStudents?: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  course: ICourse;
  instructors: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  enrollments: number;
  maxCapacity: number;
  tags: Array<{
    id: string;
    name: string;
  }>;
  labels: Array<{
    id: string;
    name: string;
  }>;
  actualPrice?: number;
  sellingPrice?: number;
  amountUsd?: number;
  currency?: string;
  startTime: Date;
  endTime: Date;
  openTime: Date;
  closeTime: Date;
  createdAt: string;
  updatedAt: string;
  language: string;
  paidBatch: boolean;
}

export interface IInstructorIdRequest {
  instructorId: string;
}

// PayOS Configuration Types
export interface ICreatePayOSConfigRequest {
  clientId: string;
  apiKey: string;
  checksumKey: string;
  accountNumber: string;
}

export interface IPayOSConfigResponse {
  id: string;
  clientId: string;
  accountNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// For updates, all fields are optional to allow partial updates
export interface IUpdatePayOSConfigRequest {
  clientId?: string;
  apiKey?: string;
  checksumKey?: string;
  accountNumber?: string;
  isActive?: boolean;
}

export interface IQuizQuestion {
  id: string;
  question: string;
  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "TEXT";
  options?: string;
  correctAnswer: string;
  marks: number;
  quizId: string;
}

export interface IQuizSubmission {
  id: string;
  quiz: {
    id: string;
    title: string;
  };
  student: {
    id: string;
    name: string;
    email: string;
  };
  score: number;
  totalMarks: number;
  submittedAt: string;
  answers: Array<{
    questionId: string;
    answer: string;
    isCorrect: boolean;
  }>;
}

export const instructorServices = {
  async getMyCourses(
    accessToken: string,
    page: number = 0,
    size: number = 10,
    status?: string,
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (status) params.append("status", status);

    const response = await axios.get(
      `${INSTRUCTOR_ENDPOINTS.INSTRUCTOR_COURSES}?${params}`,
      {
        headers: {Authorization: `Bearer ${accessToken}`},
      },
    );
    return response;
  },

  async getCourseForInstructor(courseId: string, accessToken: string) {
    const response = await axios.get(
      INSTRUCTOR_ENDPOINTS.INSTRUCTOR_COURSE_DETAIL(courseId),
      {
        headers: {Authorization: `Bearer ${accessToken}`},
      },
    );
    return response;
  },

  async createCourse(courseData: ICourseRequest, accessToken: string) {
    const response = await axios.post(
      INSTRUCTOR_ENDPOINTS.CREATE_COURSE,
      courseData,
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async updateCourse(
    courseId: string,
    courseData: ICourseRequest,
    accessToken: string,
  ) {
    const response = await axios.put(
      INSTRUCTOR_ENDPOINTS.UPDATE_COURSE(courseId),
      courseData,
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async deleteCourse(courseId: string, accessToken: string) {
    const response = await axios.delete(
      INSTRUCTOR_ENDPOINTS.DELETE_COURSE(courseId),
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async publishCourse(courseId: string, accessToken: string) {
    const response = await axios.put(
      INSTRUCTOR_ENDPOINTS.PUBLISH_COURSE(courseId),
      {},
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  // Chapter APIs
  async createChapter(
    courseId: string,
    chapterData: IChapterRequest,
    accessToken: string,
  ) {
    const response = await axios.post(
      INSTRUCTOR_ENDPOINTS.CREATE_CHAPTER(courseId),
      chapterData,
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async updateChapter(
    chapterId: string,
    chapterData: IChapterRequest,
    accessToken: string,
  ) {
    const response = await axios.put(
      INSTRUCTOR_ENDPOINTS.UPDATE_CHAPTER(chapterId),
      chapterData,
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async deleteChapter(chapterId: string, accessToken: string) {
    const response = await axios.delete(
      INSTRUCTOR_ENDPOINTS.DELETE_CHAPTER(chapterId),
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  // Lesson APIs
  async createLesson(chapterId: string, accessToken: string) {
    const response = await axios.post(
      INSTRUCTOR_ENDPOINTS.CREATE_LESSON(chapterId),
      {
        title: "New Lesson",
        content: "",
      },
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async updateLesson(
    lessonId: string,
    lessonData: ILessonRequest,
    accessToken: string,
  ) {
    const response = await axios.put(
      INSTRUCTOR_ENDPOINTS.UPDATE_LESSON(lessonId),
      lessonData,
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async deleteLesson(lessonId: string, accessToken: string) {
    const response = await axios.delete(
      INSTRUCTOR_ENDPOINTS.DELETE_LESSON(lessonId),
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async getLessonBySlug(slug: string, accessToken?: string) {
    const headers: Record<string, string> = {};
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    const response = await axios.get(
      INSTRUCTOR_ENDPOINTS.GET_LESSON_BY_SLUG(slug),
      {headers},
    );
    return response;
  },

  // Enrollment APIs
  async enrollInCourse(courseId: string, accessToken: string) {
    const response = await axios.post(
      INSTRUCTOR_ENDPOINTS.ENROLL_COURSE(courseId),
      {},
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async getMyEnrollments(accessToken: string) {
    const response = await axios.get(INSTRUCTOR_ENDPOINTS.MY_ENROLLMENTS, {
      headers: {Authorization: `Bearer ${accessToken}`},
    });
    return response;
  },

  // Progress Tracking APIs
  async markLessonCompleted(lessonId: string, accessToken: string) {
    const response = await axios.post(
      INSTRUCTOR_ENDPOINTS.MARK_LESSON_COMPLETED(lessonId),
      {},
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async getCourseProgress(courseId: string, accessToken: string) {
    const response = await axios.get(
      INSTRUCTOR_ENDPOINTS.GET_COURSE_PROGRESS(courseId),
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  // Quiz services
  async createQuiz(quizData: any, accessToken: string) {
    const response = await axios.post(
      INSTRUCTOR_ENDPOINTS.CREATE_QUIZ,
      quizData,
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async updateQuiz(quizId: string, quizData: any, accessToken: string) {
    const response = await axios.put(
      INSTRUCTOR_ENDPOINTS.UPDATE_QUIZ(quizId),
      quizData,
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async deleteQuiz(quizId: string, accessToken: string) {
    const response = await axios.delete(
      INSTRUCTOR_ENDPOINTS.DELETE_QUIZ(quizId),
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async addQuestionsToQuiz(
    quizId: string,
    questions: any[],
    accessToken: string,
  ) {
    // Normalize questions payload to match BE DTO expectations
    const normalized = (questions || []).map((q: any) => {
      const optionsIsArray = Array.isArray(q?.options);
      const optionsString = optionsIsArray
        ? JSON.stringify(q.options)
        : (q?.options ?? undefined);

      // correctAnswer: if number index + array options -> map to option text
      let correctAnswer: string | undefined = q?.correctAnswer;
      if (typeof q?.correctAnswer === "number" && optionsIsArray) {
        const idx = q.correctAnswer as number;
        correctAnswer = q.options?.[idx]?.toString();
      } else if (q?.correctAnswer != null) {
        correctAnswer = String(q.correctAnswer);
      }

      return {
        question: q?.question,
        type: q?.type ?? "SINGLE_CHOICE",
        options: optionsString,
        correctAnswer,
        marks: typeof q?.marks === "number" ? q.marks : 1,
      };
    });

    const response = await axios.post(
      INSTRUCTOR_ENDPOINTS.ADD_QUESTIONS_TO_QUIZ(quizId),
      {questions: normalized},
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async updateQuestion(
    questionId: string,
    questionData: any,
    accessToken: string,
  ) {
    const response = await axios.put(
      INSTRUCTOR_ENDPOINTS.UPDATE_QUESTION(questionId),
      questionData,
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async deleteQuestion(questionId: string, accessToken: string) {
    const response = await axios.delete(
      INSTRUCTOR_ENDPOINTS.DELETE_QUESTION(questionId),
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async getCourseQuizSubmissions(courseId: string, accessToken: string) {
    const response = await axios.get(
      INSTRUCTOR_ENDPOINTS.GET_COURSE_QUIZ_SUBMISSIONS(courseId),
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  // Enrollment Management APIs
  async getCourseEnrollments(courseId: string, accessToken: string) {
    const response = await axios.get(
      INSTRUCTOR_ENDPOINTS.GET_COURSE_ENROLLMENTS(courseId),
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async removeEnrollment(enrollmentId: string, accessToken: string) {
    const response = await axios.delete(
      INSTRUCTOR_ENDPOINTS.REMOVE_ENROLLMENT(enrollmentId),
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  // Course Instructor Management APIs

  async upsertInstructorToCourse(
    courseId: string,
    instructorIds: string[],
    accessToken: string,
  ) {
    const response = await axios.put(
      INSTRUCTOR_ENDPOINTS.UPSERT_INSTRUCTOR_TO_COURSE(courseId),
      {instructorIds},
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async getAllInstructors(accessToken: string) {
    const response = await axios.get(INSTRUCTOR_ENDPOINTS.GET_ALL_INSTRUCTORS, {
      headers: {Authorization: `Bearer ${accessToken}`},
    });

    return response;
  },

  // Lesson Management APIs
  async getLessonById(lessonId: string, accessToken: string) {
    const response = await axios.get(
      INSTRUCTOR_ENDPOINTS.GET_LESSON_BY_ID(lessonId),
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  // Quiz Management APIs
  async getQuizQuestions(quizId: string, accessToken: string) {
    const response = await axios.get(
      INSTRUCTOR_ENDPOINTS.GET_QUIZ_QUESTIONS(quizId),
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  // Batch Management APIs
  async createBatch(batchData: IBatchRequest, accessToken: string) {
    const response = await axios.post(
      INSTRUCTOR_ENDPOINTS.CREATE_BATCH,
      batchData,
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async updateBatch(
    batchId: string,
    batchData: IBatchRequest,
    accessToken: string,
  ) {
    const response = await axios.put(
      INSTRUCTOR_ENDPOINTS.UPDATE_BATCH(batchId),
      batchData,
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async deleteBatch(batchId: string, accessToken: string) {
    const response = await axios.delete(
      INSTRUCTOR_ENDPOINTS.DELETE_BATCH(batchId),
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async getMyBatches(
    accessToken: string,
    page: number = 0,
    size: number = 10,
    status?: string,
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (status) params.append("status", status);

    const response = await axios.get(
      `${INSTRUCTOR_ENDPOINTS.GET_MY_BATCHES}?${params}`,
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async getBatchById(batchId: string, accessToken: string) {
    const response = await axios.get(
      INSTRUCTOR_ENDPOINTS.GET_BATCH_BY_ID(batchId),
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async publishBatch(batchId: string, accessToken: string) {
    const response = await axios.put(
      INSTRUCTOR_ENDPOINTS.PUBLISH_BATCH(batchId),
      {},
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async addInstructorToBatch(
    batchId: string,
    instructorId: string,
    accessToken: string,
  ) {
    const response = await axios.post(
      INSTRUCTOR_ENDPOINTS.ADD_INSTRUCTOR_TO_BATCH(batchId),
      {instructorId},
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async removeInstructorFromBatch(
    batchId: string,
    instructorId: string,
    accessToken: string,
  ) {
    const response = await axios.delete(
      INSTRUCTOR_ENDPOINTS.REMOVE_INSTRUCTOR_FROM_BATCH(batchId, instructorId),
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  // PayOS Configuration APIs
  async createPayOSConfig(
    configData: ICreatePayOSConfigRequest,
    accessToken: string,
  ) {
    const response = await axios.post(
      INSTRUCTOR_ENDPOINTS.CREATE_PAYOS_CONFIG,
      configData,
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async getMyPayOSConfig(accessToken: string) {
    const response = await axios.get(INSTRUCTOR_ENDPOINTS.GET_MY_PAYOS_CONFIG, {
      headers: {Authorization: `Bearer ${accessToken}`},
    });
    return response;
  },

  async getMyJobs(accessToken: string, page: number = 0, size: number = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const response = await axios.get(
      `${INSTRUCTOR_ENDPOINTS.GET_MY_JOBS}?${params}`,
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async updatePayOSConfig(
    configId: string,
    data: IUpdatePayOSConfigRequest,
    accessToken: string,
  ) {
    const response = await axios.put(
      INSTRUCTOR_ENDPOINTS.UPDATE_PAYOS_CONFIG(configId),
      data,
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  // Statistic APIs
  async getStatisticsOverview(accessToken: string) {
    const response = await axios.get(INSTRUCTOR_ENDPOINTS.STATISTICS_OVERVIEW, {
      headers: {Authorization: `Bearer ${accessToken}`},
    });
    return response;
  },

  async getStatisticsRevenueOverTime(
    accessToken: string,
    params: {
      period?: "WEEK" | "MONTH" | "YEAR" | "ALL_TIME";
      type?: "COURSE" | "BATCH";
    },
  ) {
    const urlParams = new URLSearchParams();
    if (params.period) urlParams.append("period", params.period);
    if (params.type) urlParams.append("type", params.type);

    const response = await axios.get(
      `${INSTRUCTOR_ENDPOINTS.STATISTICS_REVENUE_OVER_TIME}?${urlParams}`,
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async getStatisticsCoursePerformance(
    accessToken: string,
    page: number = 0,
    size: number = 10,
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const response = await axios.get(
      `${INSTRUCTOR_ENDPOINTS.STATISTICS_COURSE_PERFORMANCE}?${params}`,
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },

  async getStatisticsBatchPerformance(
    accessToken: string,
    page: number = 0,
    size: number = 10,
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const response = await axios.get(
      `${INSTRUCTOR_ENDPOINTS.STATISTICS_BATCH_PERFORMANCE}?${params}`,
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response;
  },
};

export class InstructorService {
  static async getMyCourses(
    accessToken: string,
    page: number = 0,
    size: number = 10,
    status?: string,
  ) {
    return instructorServices.getMyCourses(accessToken, page, size, status);
  }

  static async getCourseForInstructor(courseId: string, accessToken: string) {
    return instructorServices.getCourseForInstructor(courseId, accessToken);
  }

  static async createCourse(courseData: ICourseRequest, accessToken: string) {
    return instructorServices.createCourse(courseData, accessToken);
  }

  static async updateCourse(
    courseId: string,
    courseData: ICourseRequest,
    accessToken: string,
  ) {
    return instructorServices.updateCourse(courseId, courseData, accessToken);
  }

  static async deleteCourse(courseId: string, accessToken: string) {
    return instructorServices.deleteCourse(courseId, accessToken);
  }

  static async publishCourse(courseId: string, accessToken: string) {
    return instructorServices.publishCourse(courseId, accessToken);
  }

  static async createChapter(
    courseId: string,
    chapterData: IChapterRequest,
    accessToken: string,
  ) {
    return instructorServices.createChapter(courseId, chapterData, accessToken);
  }

  static async updateChapter(
    chapterId: string,
    chapterData: IChapterRequest,
    accessToken: string,
  ) {
    return instructorServices.updateChapter(
      chapterId,
      chapterData,
      accessToken,
    );
  }

  static async deleteChapter(chapterId: string, accessToken: string) {
    return instructorServices.deleteChapter(chapterId, accessToken);
  }

  static async createLesson(chapterId: string, accessToken: string) {
    return instructorServices.createLesson(chapterId, accessToken);
  }

  static async updateLesson(
    lessonId: string,
    lessonData: ILessonRequest,
    accessToken: string,
  ) {
    return instructorServices.updateLesson(lessonId, lessonData, accessToken);
  }

  static async deleteLesson(lessonId: string, accessToken: string) {
    return instructorServices.deleteLesson(lessonId, accessToken);
  }

  static async getLessonBySlug(slug: string, accessToken?: string) {
    return instructorServices.getLessonBySlug(slug, accessToken);
  }

  static async enrollInCourse(courseId: string, accessToken: string) {
    return instructorServices.enrollInCourse(courseId, accessToken);
  }

  static async getMyEnrollments(accessToken: string) {
    return instructorServices.getMyEnrollments(accessToken);
  }

  static async markLessonCompleted(lessonId: string, accessToken: string) {
    return instructorServices.markLessonCompleted(lessonId, accessToken);
  }

  static async getCourseProgress(courseId: string, accessToken: string) {
    return instructorServices.getCourseProgress(courseId, accessToken);
  }

  static async createQuiz(quizData: any, accessToken: string) {
    return instructorServices.createQuiz(quizData, accessToken);
  }

  static async updateQuiz(quizId: string, quizData: any, accessToken: string) {
    return instructorServices.updateQuiz(quizId, quizData, accessToken);
  }

  static async deleteQuiz(quizId: string, accessToken: string) {
    return instructorServices.deleteQuiz(quizId, accessToken);
  }

  static async addQuestionsToQuiz(
    quizId: string,
    questions: any[],
    accessToken: string,
  ) {
    return instructorServices.addQuestionsToQuiz(
      quizId,
      questions,
      accessToken,
    );
  }

  static async updateQuestion(
    questionId: string,
    questionData: any,
    accessToken: string,
  ) {
    return instructorServices.updateQuestion(
      questionId,
      questionData,
      accessToken,
    );
  }

  static async deleteQuestion(questionId: string, accessToken: string) {
    return instructorServices.deleteQuestion(questionId, accessToken);
  }

  static async getCourseQuizSubmissions(courseId: string, accessToken: string) {
    return instructorServices.getCourseQuizSubmissions(courseId, accessToken);
  }

  // Enrollment Management APIs
  static async getCourseEnrollments(courseId: string, accessToken: string) {
    return instructorServices.getCourseEnrollments(courseId, accessToken);
  }

  static async removeEnrollment(enrollmentId: string, accessToken: string) {
    return instructorServices.removeEnrollment(enrollmentId, accessToken);
  }

  // Course Instructor Management APIs
  static async upsertInstructorToCourse(
    courseId: string,
    instructorIds: string[],
    accessToken: string,
  ) {
    return instructorServices.upsertInstructorToCourse(
      courseId,
      instructorIds,
      accessToken,
    );
  }

  static async getAllInstructors(accessToken: string) {
    return instructorServices.getAllInstructors(accessToken);
  }

  // Lesson Management APIs
  static async getLessonById(lessonId: string, accessToken: string) {
    return instructorServices.getLessonById(lessonId, accessToken);
  }

  // Quiz Management APIs
  static async getQuizQuestions(quizId: string, accessToken: string) {
    return instructorServices.getQuizQuestions(quizId, accessToken);
  }

  // Batch Management APIs
  static async createBatch(batchData: IBatchRequest, accessToken: string) {
    return instructorServices.createBatch(batchData, accessToken);
  }

  static async updateBatch(
    batchId: string,
    batchData: IBatchRequest,
    accessToken: string,
  ) {
    return instructorServices.updateBatch(batchId, batchData, accessToken);
  }

  static async deleteBatch(batchId: string, accessToken: string) {
    return instructorServices.deleteBatch(batchId, accessToken);
  }

  static async getMyBatches(
    accessToken: string,
    page: number = 0,
    size: number = 10,
    status?: string,
  ) {
    return instructorServices.getMyBatches(accessToken, page, size, status);
  }

  static async getBatchById(batchId: string, accessToken: string) {
    return instructorServices.getBatchById(batchId, accessToken);
  }

  static async publishBatch(batchId: string, accessToken: string) {
    return instructorServices.publishBatch(batchId, accessToken);
  }

  static async addInstructorToBatch(
    batchId: string,
    instructorId: string,
    accessToken: string,
  ) {
    return instructorServices.addInstructorToBatch(
      batchId,
      instructorId,
      accessToken,
    );
  }

  static async removeInstructorFromBatch(
    batchId: string,
    instructorId: string,
    accessToken: string,
  ) {
    return instructorServices.removeInstructorFromBatch(
      batchId,
      instructorId,
      accessToken,
    );
  }

  // PayOS Configuration APIs
  static async createPayOSConfig(
    configData: ICreatePayOSConfigRequest,
    accessToken: string,
  ) {
    return instructorServices.createPayOSConfig(configData, accessToken);
  }

  static async getMyPayOSConfig(accessToken: string) {
    return instructorServices.getMyPayOSConfig(accessToken);
  }

  static async getMyJobs(
    accessToken: string,
    page: number = 0,
    size: number = 10,
  ) {
    return instructorServices.getMyJobs(accessToken, page, size);
  }

  static async updatePayOSConfig(
    configId: string,
    data: IUpdatePayOSConfigRequest,
    accessToken: string,
  ) {
    return instructorServices.updatePayOSConfig(configId, data, accessToken);
  }

  // Statistic APIs
  static async getStatisticsOverview(accessToken: string) {
    return instructorServices.getStatisticsOverview(accessToken);
  }

  static async getStatisticsRevenueOverTime(
    accessToken: string,
    params: {
      period?: "WEEK" | "MONTH" | "YEAR" | "ALL_TIME";
      type?: "COURSE" | "BATCH";
    },
  ) {
    return instructorServices.getStatisticsRevenueOverTime(accessToken, params);
  }

  static async getStatisticsCoursePerformance(
    accessToken: string,
    page: number = 0,
    size: number = 10,
  ) {
    return instructorServices.getStatisticsCoursePerformance(
      accessToken,
      page,
      size,
    );
  }

  static async getStatisticsBatchPerformance(
    accessToken: string,
    page: number = 0,
    size: number = 10,
  ) {
    return instructorServices.getStatisticsBatchPerformance(
      accessToken,
      page,
      size,
    );
  }
}
