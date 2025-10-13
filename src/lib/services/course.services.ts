import axios from "axios";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1";

// Course API Endpoints
const COURSE_ENDPOINTS = {
  // Public endpoints
  PUBLIC_COURSES: BASE_API + "/public/courses",
  PUBLIC_COURSE_DETAIL: (slug: string) => BASE_API + `/public/courses/${slug}`,
  PUBLIC_COURSE_CHAPTERS: (courseId: string) =>
    BASE_API + `/public/courses/${courseId}/chapters`,
  PUBLIC_COURSE_REVIEWS: (courseSlug: string) =>
    BASE_API + `/public/courses/${courseSlug}/reviews`,

  // Instructor endpoints
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
  GET_COURSE_PROGRESS: (courseId: string) =>
    BASE_API + `/courses/${courseId}/my-progress`,
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
  shortIntroduction?: string;
  language?: string;
  currency?: string;
  coursePrice?: number;
  sellingPrice?: number;
}

export interface IChapterRequest {
  title: string;
  description?: string;
}

export interface ILessonRequest {
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
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
}

export interface IChapter {
  id: string;
  title: string;
  description?: string;
  position: number;
  lessons: ILesson[];
}

export interface ILesson {
  id: string;
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  type: "video" | "article" | "video_slide";
  position: number;
  slug: string;
  duration?: number;
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

// Course Services
export const courseServices = {
  // Public APIs
  async getPublishedCourses(filters: CourseFilters = {}, accessToken?: string) {
    const params = new URLSearchParams();

    if (filters.tags?.length) {
      filters.tags.forEach((tag) => params.append("tags", tag));
    }
    if (filters.labels?.length) {
      filters.labels.forEach((label) => params.append("labels", label));
    }
    if (filters.search) {
      params.append("search", filters.search);
    }
    if (filters.page !== undefined) {
      params.append("page", filters.page.toString());
    }
    if (filters.size !== undefined) {
      params.append("size", filters.size.toString());
    }

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await axios.get(
      `${COURSE_ENDPOINTS.PUBLIC_COURSES}?${params}`,
      {headers},
    );
    return response;
  },

  async getCourseBySlug(slug: string, accessToken?: string) {
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await axios.get(
      COURSE_ENDPOINTS.PUBLIC_COURSE_DETAIL(slug),
      {headers},
    );
    return response;
  },

  async getCourseChapters(courseId: string, accessToken?: string) {
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await axios.get(
      COURSE_ENDPOINTS.PUBLIC_COURSE_CHAPTERS(courseId),
      {headers},
    );
    return response;
  },

  async getCourseReviews(
    courseSlug: string,
    page: number = 0,
    size: number = 10,
    accessToken?: string,
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await axios.get(
      `${COURSE_ENDPOINTS.PUBLIC_COURSE_REVIEWS(courseSlug)}?${params}`,
      {headers},
    );
    return response;
  },

  // Instructor APIs
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

    if (status) {
      params.append("status", status);
    }

    const response = await axios.get(
      `${COURSE_ENDPOINTS.INSTRUCTOR_COURSES}?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async getCourseForInstructor(courseId: string, accessToken: string) {
    const response = await axios.get(
      COURSE_ENDPOINTS.INSTRUCTOR_COURSE_DETAIL(courseId),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async createCourse(courseData: ICourseRequest, accessToken: string) {
    const response = await axios.post(
      COURSE_ENDPOINTS.CREATE_COURSE,
      courseData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async updateCourse(
    courseId: string,
    courseData: ICourseRequest,
    accessToken: string,
  ) {
    const response = await axios.put(
      COURSE_ENDPOINTS.UPDATE_COURSE(courseId),
      courseData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async deleteCourse(courseId: string, accessToken: string) {
    const response = await axios.delete(
      COURSE_ENDPOINTS.DELETE_COURSE(courseId),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async publishCourse(courseId: string, accessToken: string) {
    const response = await axios.put(
      COURSE_ENDPOINTS.PUBLISH_COURSE(courseId),
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
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
      COURSE_ENDPOINTS.CREATE_CHAPTER(courseId),
      chapterData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async updateChapter(
    chapterId: string,
    chapterData: IChapterRequest,
    accessToken: string,
  ) {
    const response = await axios.put(
      COURSE_ENDPOINTS.UPDATE_CHAPTER(chapterId),
      chapterData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async deleteChapter(chapterId: string, accessToken: string) {
    const response = await axios.delete(
      COURSE_ENDPOINTS.DELETE_CHAPTER(chapterId),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  // Lesson APIs
  async createLesson(chapterId: string, accessToken: string) {
    const response = await axios.post(
      COURSE_ENDPOINTS.CREATE_LESSON(chapterId),
      {
        title: "New Lesson",
        content: "",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async updateLesson(
    lessonId: string,
    lessonData: ILessonRequest,
    accessToken: string,
  ) {
    const response = await axios.put(
      COURSE_ENDPOINTS.UPDATE_LESSON(lessonId),
      lessonData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async deleteLesson(lessonId: string, accessToken: string) {
    const response = await axios.delete(
      COURSE_ENDPOINTS.DELETE_LESSON(lessonId),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async getLessonBySlug(slug: string, accessToken?: string) {
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await axios.get(
      COURSE_ENDPOINTS.GET_LESSON_BY_SLUG(slug),
      {headers},
    );
    return response;
  },

  // Enrollment APIs
  async enrollInCourse(courseId: string, accessToken: string) {
    const response = await axios.post(
      COURSE_ENDPOINTS.ENROLL_COURSE(courseId),
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async getMyEnrollments(accessToken: string) {
    const response = await axios.get(COURSE_ENDPOINTS.MY_ENROLLMENTS, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  },

  // Progress Tracking APIs
  async markLessonCompleted(lessonId: string, accessToken: string) {
    const response = await axios.post(
      COURSE_ENDPOINTS.MARK_LESSON_COMPLETED(lessonId),
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },

  async getCourseProgress(courseId: string, accessToken: string) {
    const response = await axios.get(
      COURSE_ENDPOINTS.GET_COURSE_PROGRESS(courseId),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response;
  },
};

// Static class for easier usage
export class CourseService {
  // Public methods
  static async getPublishedCourses(
    filters: CourseFilters = {},
    accessToken?: string,
  ) {
    return courseServices.getPublishedCourses(filters, accessToken);
  }

  static async getCourseBySlug(slug: string, accessToken?: string) {
    return courseServices.getCourseBySlug(slug, accessToken);
  }

  static async getCourseChapters(courseId: string, accessToken?: string) {
    return courseServices.getCourseChapters(courseId, accessToken);
  }

  static async getCourseReviews(
    courseSlug: string,
    page: number = 0,
    size: number = 10,
    accessToken?: string,
  ) {
    return courseServices.getCourseReviews(courseSlug, page, size, accessToken);
  }

  // Instructor methods
  static async getMyCourses(
    accessToken: string,
    page: number = 0,
    size: number = 10,
    status?: string,
  ) {
    return courseServices.getMyCourses(accessToken, page, size, status);
  }

  static async getCourseForInstructor(courseId: string, accessToken: string) {
    return courseServices.getCourseForInstructor(courseId, accessToken);
  }

  static async createCourse(courseData: ICourseRequest, accessToken: string) {
    return courseServices.createCourse(courseData, accessToken);
  }

  static async updateCourse(
    courseId: string,
    courseData: ICourseRequest,
    accessToken: string,
  ) {
    return courseServices.updateCourse(courseId, courseData, accessToken);
  }

  static async deleteCourse(courseId: string, accessToken: string) {
    return courseServices.deleteCourse(courseId, accessToken);
  }

  static async publishCourse(courseId: string, accessToken: string) {
    return courseServices.publishCourse(courseId, accessToken);
  }

  // Chapter methods
  static async createChapter(
    courseId: string,
    chapterData: IChapterRequest,
    accessToken: string,
  ) {
    return courseServices.createChapter(courseId, chapterData, accessToken);
  }

  static async updateChapter(
    chapterId: string,
    chapterData: IChapterRequest,
    accessToken: string,
  ) {
    return courseServices.updateChapter(chapterId, chapterData, accessToken);
  }

  static async deleteChapter(chapterId: string, accessToken: string) {
    return courseServices.deleteChapter(chapterId, accessToken);
  }

  // Lesson methods
  static async createLesson(chapterId: string, accessToken: string) {
    return courseServices.createLesson(chapterId, accessToken);
  }

  static async updateLesson(
    lessonId: string,
    lessonData: ILessonRequest,
    accessToken: string,
  ) {
    return courseServices.updateLesson(lessonId, lessonData, accessToken);
  }

  static async deleteLesson(lessonId: string, accessToken: string) {
    return courseServices.deleteLesson(lessonId, accessToken);
  }

  static async getLessonBySlug(slug: string, accessToken?: string) {
    return courseServices.getLessonBySlug(slug, accessToken);
  }

  // Enrollment methods
  static async enrollInCourse(courseId: string, accessToken: string) {
    return courseServices.enrollInCourse(courseId, accessToken);
  }

  static async getMyEnrollments(accessToken: string) {
    return courseServices.getMyEnrollments(accessToken);
  }

  // Progress methods
  static async markLessonCompleted(lessonId: string, accessToken: string) {
    return courseServices.markLessonCompleted(lessonId, accessToken);
  }

  static async getCourseProgress(courseId: string, accessToken: string) {
    return courseServices.getCourseProgress(courseId, accessToken);
  }
}
