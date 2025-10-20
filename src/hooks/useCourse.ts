import {useState, useCallback, useMemo} from "react";
import {
  InstructorService as CourseService,
  ICourseRequest,
  ICourse,
  IChapterRequest,
  ILessonRequest,
  IBatch,
  IBatchRequest,
  IQuizQuestion,
  IQuizSubmission,
} from "@/lib/services/instructor.services";
import {Chapter, CourseItem} from "@/context/CourseContext";
import { convertUrlToRelatuvePath } from "@/lib/utils";

// Types
// Import CourseFormData từ context để tránh trùng lặp
export interface IntendedLearnersData {
  learningObjectives: string[];
  requirements: string[];
  targetAudience: string[];
}

export interface EnrollmentData {
  id: string;
  course: ICourse;
  enrolledAt: string;
  progress: number;
  student: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CourseState {
  course: ICourse | null;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
}

export interface UseCourseReturn {
  // State
  state: CourseState;

  // Intended learners data
  intendedLearners: IntendedLearnersData;
  updateIntendedLearners: (data: Partial<IntendedLearnersData>) => void;

  // Course operations
  createCourse: (formData?: any) => Promise<string | null>;
  loadCourse: (courseId: string) => Promise<ICourse | null>;
  getMyCourses: (
    page?: number,
    size?: number,
    status?: string,
  ) => Promise<ICourse[]>;
  updateCourse: (courseId: string, data: ICourseRequest) => Promise<boolean>;
  publishCourse: (courseId: string) => Promise<boolean>;
  deleteCourse: (courseId: string) => Promise<boolean>;

  // Chapter operations
  createChapter: (courseId: string, data: IChapterRequest) => Promise<Chapter | null>;
  updateChapter: (chapterId: string, data: IChapterRequest) => Promise<boolean>;
  deleteChapter: (chapterId: string) => Promise<boolean>;

  // Lesson operations
  createLesson: (chapterId: string) => Promise<CourseItem | null>;
  updateLesson: (lessonId: string, data: ILessonRequest) => Promise<boolean>;
  deleteLesson: (lessonId: string) => Promise<boolean>;

  // Quiz operations
  createQuiz: (quizData: any) => Promise<any>;
  updateQuiz: (quizId: string, quizData: any) => Promise<boolean>;
  deleteQuiz: (quizId: string) => Promise<boolean>;
  addQuestionsToQuiz: (quizId: string, questions: any[]) => Promise<boolean>;
  updateQuestion: (questionId: string, questionData: any) => Promise<boolean>;
  deleteQuestion: (questionId: string) => Promise<boolean>;
  getQuizQuestions: (quizId: string) => Promise<IQuizQuestion[]>;
  getCourseQuizSubmissions: (courseId: string) => Promise<IQuizSubmission[]>;

  // Lesson Management APIs
  getLessonById: (lessonId: string) => Promise<any>;

  // Enrollment Management APIs
  getCourseEnrollments: (courseId: string) => Promise<EnrollmentData[]>;
  removeEnrollment: (enrollmentId: string) => Promise<boolean>;

  // Course Instructor Management APIs
  addInstructorToCourse: (courseId: string, instructorId: string) => Promise<boolean>;
  removeInstructorFromCourse: (courseId: string, instructorId: string) => Promise<boolean>;

  // Batch Management APIs
  createBatch: (batchData: IBatchRequest) => Promise<IBatch | null>;
  updateBatch: (batchId: string, batchData: IBatchRequest) => Promise<boolean>;
  deleteBatch: (batchId: string) => Promise<boolean>;
  getMyBatches: (page?: number, size?: number, status?: string) => Promise<IBatch[]>;
  getBatchById: (batchId: string) => Promise<IBatch | null>;
  publishBatch: (batchId: string) => Promise<boolean>;
  addInstructorToBatch: (batchId: string, instructorId: string) => Promise<boolean>;
  removeInstructorFromBatch: (batchId: string, instructorId: string) => Promise<boolean>;

  // Utility functions
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
}

const useCourse = (): UseCourseReturn => {
  // State management
  const [state, setState] = useState<CourseState>({
    course: null,
    isLoading: false,
    error: null,
    isSubmitting: false,
  });

  // Removed formData - now managed by context

  // Intended learners data
  const [intendedLearners, setIntendedLearners] =
    useState<IntendedLearnersData>({
      learningObjectives: [],
      requirements: [],
      targetAudience: [],
    });

  // Memoized state getters
  const {course} = useMemo(() => state, [state]);

  // Utility functions
  const getAccessToken = useCallback((): string | null => {
    return localStorage.getItem("accessToken");
  }, []);

  const handleError = useCallback((err: any, operation: string) => {
    const errorMessage =
      err?.response?.data?.message || err?.message || `${operation} failed`;
    setState((prev) => ({...prev, error: errorMessage}));
    // console.error(`Error in ${operation}:`, err);
  }, []);

  // State setters
  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({...prev, isLoading: loading}));
  }, []);

  const setSubmitting = useCallback((submitting: boolean) => {
    setState((prev) => ({...prev, isSubmitting: submitting}));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({...prev, error: null}));
  }, []);

  // Course operations
  const createCourse = useCallback(
    async (formData?: any): Promise<string | null> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        if (!formData) {
          throw new Error("Form data is required");
        }

        const courseData: ICourseRequest = {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          tag: formData.tag,
          label: formData.label,
          thumbnailUrl: formData.thumbnailUrl,
          videoUrl: formData.videoUrl,
        };

        const response = await CourseService.createCourse(
          courseData,
          accessToken,
        );

        if (response.status === 201) {
          const courseId = response.data.id;
          setState((prev) => ({...prev, course: response.data}));
          return courseId;
        }

        return null;
      } catch (err) {
        handleError(err, "createCourse");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const loadCourse = useCallback(
    async (courseId: string): Promise<ICourse | null> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await CourseService.getCourseForInstructor(
          courseId,
          accessToken,
        )
        setState((prev) => ({...prev, course: response.data}));
        return response.data;
      } catch (err) {
        handleError(err, "loadCourse");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const getMyCourses = useCallback(
    async (
      page: number = 0,
      size: number = 10,
      status?: string,
    ): Promise<ICourse[]> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await CourseService.getMyCourses(
          accessToken,
          page,
          size,
          status,
        );

        // Return the courses array from the response
        return response.data.content || response.data || [];
      } catch (err) {
        handleError(err, "getMyCourses");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const updateCourse = useCallback(
    async (courseId: string, data: ICourseRequest): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        // First, get the current course data
        const currentCourseResponse = await CourseService.getCourseForInstructor(
          courseId,
          accessToken,
        );
        const currentCourse = currentCourseResponse.data;
        // Merge current course data with new data (only update fields that are provided)
        const mergedData: ICourseRequest = {
          title: data.title !== undefined ? data.title : currentCourse.title,
          description: data.description !== undefined ? data.description : currentCourse.description,
          price: data.price !== undefined ? data.price : (currentCourse.coursePrice || 0),
          tag: data.tag !== undefined ? data.tag : currentCourse.tags?.map((tag: {name: string}) => ({name: tag.name})),
          label: data.label !== undefined ? data.label : currentCourse.labels?.map((label: {name: string}) => ({name: label.name})),
          // Chỉ sử dụng field names mà backend expect để tránh lỗi field quá dài
          image: data.image !== undefined ? data.image : (data.thumbnailUrl !== undefined ? data.thumbnailUrl : convertUrlToRelatuvePath(currentCourse.image)),
          videoLink: data.videoLink !== undefined ? data.videoLink : (data.videoUrl !== undefined ? data.videoUrl : currentCourse.videoLink),
          shortIntroduction: data.shortIntroduction !== undefined ? data.shortIntroduction : currentCourse.shortIntroduction,
          language: data.language !== undefined ? data.language : currentCourse.language,
          currency: data.currency !== undefined ? data.currency : currentCourse.currency,
          coursePrice: data.coursePrice !== undefined ? data.coursePrice : currentCourse.coursePrice,
          sellingPrice: data.sellingPrice !== undefined ? data.sellingPrice : currentCourse.sellingPrice,
          targetAudience: data.targetAudience !== undefined ? data.targetAudience : currentCourse.targetAudience,
          skillLevel: data.skillLevel !== undefined ? data.skillLevel : currentCourse.skillLevel,
          learnerProfileDesc: data.learnerProfileDesc !== undefined ? data.learnerProfileDesc : currentCourse.learnerProfileDesc,
        };
        const response = await CourseService.updateCourse(
          courseId,
          mergedData,
          accessToken,
        );
        setState((prev) => ({...prev, course: response.data}));
        return true;
      } catch (err) {
        handleError(err, "updateCourse");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const publishCourse = useCallback(
    async (courseId: string): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.publishCourse(courseId, accessToken);

        // Update local course state
        if (course) {
          setState((prev) => ({
            ...prev,
            course: {...course, status: "PUBLISHED"},
          }));
        }

        return true;
      } catch (err) {
        handleError(err, "publishCourse");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [course, getAccessToken, handleError, setLoading, clearError],
  );

  const deleteCourse = useCallback(
    async (courseId: string): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.deleteCourse(courseId, accessToken);
        setState((prev) => ({...prev, course: null}));
        return true;
      } catch (err) {
        handleError(err, "deleteCourse");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  // Chapter operations
  const createChapter = useCallback(
    async (courseId: string, data: IChapterRequest): Promise<Chapter | null> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await CourseService.createChapter(courseId, data, accessToken);
        return response.data;
      } catch (err) {
        handleError(err, "createChapter");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const updateChapter = useCallback(
    async (chapterId: string, data: IChapterRequest): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.updateChapter(chapterId, data, accessToken);
        return true;
      } catch (err) {
        handleError(err, "updateChapter");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const deleteChapter = useCallback(
    async (chapterId: string): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.deleteChapter(chapterId, accessToken);
        return true;
      } catch (err) {
        handleError(err, "deleteChapter");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  // Lesson operations
  const createLesson = useCallback(
    async (chapterId: string): Promise<CourseItem | null> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await CourseService.createLesson(
          chapterId,
          accessToken,
        );
        return response.data;
      } catch (err) {
        handleError(err, "createLesson");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const updateLesson = useCallback(
    async (lessonId: string, data: ILessonRequest): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.updateLesson(lessonId, data, accessToken);
        return true;
      } catch (err) {
        handleError(err, "updateLesson");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const deleteLesson = useCallback(
    async (lessonId: string): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.deleteLesson(lessonId, accessToken);
        return true;
      } catch (err) {
        handleError(err, "deleteLesson");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  // Quiz operations
  const createQuiz = useCallback(
    async (quizData: any): Promise<any> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await CourseService.createQuiz(quizData, accessToken);
        return response.data;
      } catch (err) {
        handleError(err, "createQuiz");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const updateQuiz = useCallback(
    async (quizId: string, quizData: any): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.updateQuiz(quizId, quizData, accessToken);
        return true;
      } catch (err) {
        handleError(err, "updateQuiz");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const deleteQuiz = useCallback(
    async (quizId: string): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.deleteQuiz(quizId, accessToken);
        return true;
      } catch (err) {
        handleError(err, "deleteQuiz");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const addQuestionsToQuiz = useCallback(
    async (quizId: string, questions: any[]): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.addQuestionsToQuiz(quizId, questions, accessToken);
        return true;
      } catch (err) {
        handleError(err, "addQuestionsToQuiz");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const updateQuestion = useCallback(
    async (questionId: string, questionData: any): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.updateQuestion(questionId, questionData, accessToken);
        return true;
      } catch (err) {
        handleError(err, "updateQuestion");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  // Intended learners operations
  const updateIntendedLearners = useCallback(
    (data: Partial<IntendedLearnersData>) => {
      setIntendedLearners((prev) => ({...prev, ...data}));
    },
    [],
  );

  // Lesson Management APIs
  const getLessonById = useCallback(
    async (lessonId: string): Promise<any> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await CourseService.getLessonById(lessonId, accessToken);
        return response.data;
      } catch (err) {
        handleError(err, "getLessonById");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  // Quiz Management APIs
  const getQuizQuestions = useCallback(
    async (quizId: string): Promise<IQuizQuestion[]> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await CourseService.getQuizQuestions(quizId, accessToken);
        return response.data || [];
      } catch (err) {
        handleError(err, "getQuizQuestions");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const deleteQuestion = useCallback(
    async (questionId: string): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await CourseService.deleteQuestion(questionId, accessToken);
        return response.status === 204;
      } catch (err) {
        handleError(err, "deleteQuestion");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const getCourseQuizSubmissions = useCallback(
    async (courseId: string): Promise<IQuizSubmission[]> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await CourseService.getCourseQuizSubmissions(courseId, accessToken);
        return response.data || [];
      } catch (err) {
        handleError(err, "getCourseQuizSubmissions");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  // Enrollment Management APIs
  const getCourseEnrollments = useCallback(
    async (courseId: string): Promise<EnrollmentData[]> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await CourseService.getCourseEnrollments(courseId, accessToken);
        return response.data || [];
      } catch (err) {
        handleError(err, "getCourseEnrollments");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const removeEnrollment = useCallback(
    async (enrollmentId: string): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.removeEnrollment(enrollmentId, accessToken);
        return true;
      } catch (err) {
        handleError(err, "removeEnrollment");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  // Course Instructor Management APIs
  const addInstructorToCourse = useCallback(
    async (courseId: string, instructorId: string): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.addInstructorToCourse(courseId, instructorId, accessToken);
        return true;
      } catch (err) {
        handleError(err, "addInstructorToCourse");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const removeInstructorFromCourse = useCallback(
    async (courseId: string, instructorId: string): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.removeInstructorFromCourse(courseId, instructorId, accessToken);
        return true;
      } catch (err) {
        handleError(err, "removeInstructorFromCourse");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  // Batch Management APIs
  const createBatch = useCallback(
    async (batchData: IBatchRequest): Promise<IBatch | null> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await CourseService.createBatch(batchData, accessToken);
        return response.data;
      } catch (err) {
        handleError(err, "createBatch");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const updateBatch = useCallback(
    async (batchId: string, batchData: IBatchRequest): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.updateBatch(batchId, batchData, accessToken);
        return true;
      } catch (err) {
        handleError(err, "updateBatch");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const deleteBatch = useCallback(
    async (batchId: string): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.deleteBatch(batchId, accessToken);
        return true;
      } catch (err) {
        handleError(err, "deleteBatch");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const getMyBatches = useCallback(
    async (page: number = 0, size: number = 10, status?: string): Promise<IBatch[]> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await CourseService.getMyBatches(accessToken, page, size, status);
        return response.data.content || response.data || [];
      } catch (err) {
        handleError(err, "getMyBatches");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const getBatchById = useCallback(
    async (batchId: string): Promise<IBatch | null> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await CourseService.getBatchById(batchId, accessToken);
        return response.data;
      } catch (err) {
        handleError(err, "getBatchById");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const publishBatch = useCallback(
    async (batchId: string): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.publishBatch(batchId, accessToken);
        return true;
      } catch (err) {
        handleError(err, "publishBatch");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const addInstructorToBatch = useCallback(
    async (batchId: string, instructorId: string): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.addInstructorToBatch(batchId, instructorId, accessToken);
        return true;
      } catch (err) {
        handleError(err, "addInstructorToBatch");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  const removeInstructorFromBatch = useCallback(
    async (batchId: string, instructorId: string): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.removeInstructorFromBatch(batchId, instructorId, accessToken);
        return true;
      } catch (err) {
        handleError(err, "removeInstructorFromBatch");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, handleError, setLoading, clearError],
  );

  return {
    // State
    state,

    // Intended learners
    intendedLearners,
    updateIntendedLearners,

    // Course operations
    createCourse,
    loadCourse,
    getMyCourses,
    updateCourse,
    publishCourse,
    deleteCourse,

    // Chapter operations
    createChapter,
    updateChapter,
    deleteChapter,

    // Lesson operations
    createLesson,
    updateLesson,
    deleteLesson,

    // Quiz operations
    createQuiz,
    updateQuiz,
    deleteQuiz,
    addQuestionsToQuiz,
    updateQuestion,
    deleteQuestion,
    getQuizQuestions,
    getCourseQuizSubmissions,

    // Lesson Management APIs
    getLessonById,

    // Enrollment Management APIs
    getCourseEnrollments,
    removeEnrollment,

    // Course Instructor Management APIs
    addInstructorToCourse,
    removeInstructorFromCourse,

    // Batch Management APIs
    createBatch,
    updateBatch,
    deleteBatch,
    getMyBatches,
    getBatchById,
    publishBatch,
    addInstructorToBatch,
    removeInstructorFromBatch,

    // Utility functions
    clearError,
    setLoading,
    setSubmitting,
  };
};

export default useCourse;
