import {useState, useCallback, useMemo} from "react";
import {
  CourseService,
  ICourseRequest,
  ICourse,
  IChapterRequest,
  ILessonRequest,
} from "@/lib/services/course.services";

// Types
// Import CourseFormData từ context để tránh trùng lặp
export interface IntendedLearnersData {
  learningObjectives: string[];
  requirements: string[];
  targetAudience: string[];
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
  loadCourse: (courseId: string) => Promise<void>;
  getMyCourses: (
    page?: number,
    size?: number,
    status?: string,
  ) => Promise<ICourse[]>;
  updateCourse: (courseId: string, data: ICourseRequest) => Promise<boolean>;
  publishCourse: (courseId: string) => Promise<boolean>;
  deleteCourse: (courseId: string) => Promise<boolean>;

  // Chapter operations
  createChapter: (courseId: string, data: IChapterRequest) => Promise<boolean>;
  updateChapter: (chapterId: string, data: IChapterRequest) => Promise<boolean>;
  deleteChapter: (chapterId: string) => Promise<boolean>;

  // Lesson operations
  createLesson: (chapterId: string) => Promise<string | null>;
  updateLesson: (lessonId: string, data: ILessonRequest) => Promise<boolean>;
  deleteLesson: (lessonId: string) => Promise<boolean>;

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
    async (courseId: string): Promise<void> => {
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
        );
        setState((prev) => ({...prev, course: response.data}));
      } catch (err) {
        handleError(err, "loadCourse");
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

        const response = await CourseService.updateCourse(
          courseId,
          data,
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
    async (courseId: string, data: IChapterRequest): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        await CourseService.createChapter(courseId, data, accessToken);
        return true;
      } catch (err) {
        handleError(err, "createChapter");
        return false;
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
    async (chapterId: string): Promise<string | null> => {
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
        return response.data?.id || null;
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

  // Intended learners operations
  const updateIntendedLearners = useCallback(
    (data: Partial<IntendedLearnersData>) => {
      setIntendedLearners((prev) => ({...prev, ...data}));
    },
    [],
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

    // Utility functions
    clearError,
    setLoading,
    setSubmitting,
  };
};

export default useCourse;
