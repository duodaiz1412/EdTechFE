import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import useCourse, {EnrollmentData} from "@/hooks/useCourse";
import {
  ICourse,
  IBatch,
  IBatchRequest,
  IQuizQuestion,
  IQuizSubmission,
} from "@/lib/services/instructor.services";

export interface Chapter {
  id: string;
  title: string;
  summary?: string;
  slug?: string;
  position: number;
  lessons?: CourseItem[];
}

export interface CourseItem {
  id?: string;
  title: string | null;
  slug?: string | null;
  content?: string | null;
  videoUrl?: string | null;
  fileUrl?: string | null;
  quizDto?: any | null;
  position?: number;
}

export interface CourseFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  timeCommitment: string;
  tag: {name: string}[];
  label: {name: string}[];
  image?: string;
  videoLink?: string;
  // Landing page specific fields
  subtitle?: string;
  language?: string;
  // Pricing specific fields
  currency?: string;
  originalPrice?: number;
  sellingPrice?: number;
  paidCourse?: boolean;
  // Intended learners specific fields
  shortIntroduction?: string[];
  requirements?: string[];
  targetAudience?: string[];
  // Curriculum specific fields
  chapters?: Chapter[];
  // Course settings specific fields
  enrollment?: string;
}

export interface CourseWizardState {
  currentStep: number;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

// Batch Management Types
export interface BatchFormData {
  title: string;
  timeCommitment: string;
  tags: {name: string}[];
  labels: {name: string}[];
  actualPrice: number;
  sellingPrice: number;
  amountUsd: number;
  currency: string;
  image: string;
  videoLink: string;
  maxCapacity: number;
  description: string;
  openTime?: string;
  closeTime?: string;
  maxStudents: number;
  language: string;
  startTime?: string;
  endTime?: string;
  paidBatch?: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface BatchWizardState {
  currentStep: number;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

interface CourseContextType {
  // Form data
  formData: CourseFormData;
  setFormData: (data: CourseFormData) => void;
  updateFormData: (updates: Partial<CourseFormData>) => void;
  resetFormData: () => void;
  syncCourseToFormData: (course: ICourse) => void;

  // Wizard state
  wizardState: CourseWizardState;
  setWizardState: (updates: Partial<CourseWizardState>) => void;

  // Navigation
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  canProceed: (type: "course" | "batch") => boolean;

  // Validation
  validateField: (field: keyof CourseFormData) => string | null;
  validateBatchField: (field: keyof BatchFormData) => string | null;

  // Constants
  totalSteps: number;
  stepTitles: string[];

  // API operations (from hook)
  createCourse: (formData?: CourseFormData) => Promise<string | null>;
  loadCourse: (courseId: string) => Promise<ICourse | null>;
  refetchCourse: () => Promise<void>;
  updateCourse: (courseId: string, data: any) => Promise<boolean>;
  publishCourse: (courseId: string) => Promise<boolean>;
  deleteCourse: (courseId: string) => Promise<boolean>;
  // Chapter operations
  createChapter: (
    courseId: string,
    chapterData: {title: string; summary?: string},
  ) => Promise<Chapter | null>;
  deleteChapter: (chapterId: string) => Promise<boolean>;

  // Lesson operations
  deleteLesson: (lessonId: string) => Promise<boolean>;
  getLessonById: (lessonId: string) => Promise<any>;

  // Quiz operations
  createQuiz: (quizData: any) => Promise<any>;
  updateQuiz: (quizId: string, quizData: any) => Promise<boolean>;
  deleteQuiz: (quizId: string) => Promise<boolean>;
  addQuestionsToQuiz: (quizId: string, questions: any[]) => Promise<boolean>;
  updateQuestion: (questionId: string, questionData: any) => Promise<boolean>;
  deleteQuestion: (questionId: string) => Promise<boolean>;

  // Quiz Management APIs
  getQuizQuestions: (quizId: string) => Promise<IQuizQuestion[]>;
  getCourseQuizSubmissions: (courseId: string) => Promise<IQuizSubmission[]>;

  // Enrollment Management APIs
  getCourseEnrollments: (courseId: string) => Promise<EnrollmentData[]>;
  removeEnrollment: (enrollmentId: string) => Promise<boolean>;

  // Batch Management APIs
  createBatch: (batchData: IBatchRequest) => Promise<IBatch | null>;
  updateBatch: (batchId: string, batchData: IBatchRequest) => Promise<boolean>;
  deleteBatch: (batchId: string) => Promise<boolean>;
  getMyBatches: (
    page?: number,
    size?: number,
    status?: string,
  ) => Promise<IBatch[]>;
  getBatchById: (batchId: string) => Promise<IBatch | null>;
  publishBatch: (batchId: string) => Promise<boolean>;
  addInstructorToBatch: (
    batchId: string,
    instructorId: string,
  ) => Promise<boolean>;
  removeInstructorFromBatch: (
    batchId: string,
    instructorId: string,
  ) => Promise<boolean>;

  // Batch Form Data
  batchFormData: BatchFormData;
  setBatchFormData: (data: BatchFormData) => void;
  updateBatchFormData: (updates: Partial<BatchFormData>) => void;
  resetBatchFormData: () => void;

  // Batch Wizard State
  batchWizardState: BatchWizardState;
  setBatchWizardState: (updates: Partial<BatchWizardState>) => void;

  // API state
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  state: {
    course: any | null;
    isLoading: boolean;
    error: string | null;
    isSubmitting: boolean;
  };
  clearError: () => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

const initialFormData: CourseFormData = {
  title: "",
  description: "",
  price: 0,
  category: "",
  timeCommitment: "",
  tag: [],
  label: [],
  image: undefined,
  videoLink: undefined,
  subtitle: "",
  language: "Vietnamese",
  currency: "VND",
  originalPrice: 0,
  sellingPrice: 0,
  paidCourse: false,
  shortIntroduction: [],
  requirements: [],
  targetAudience: [],
  chapters: [],
  enrollment: "public",
};

const initialWizardState: CourseWizardState = {
  currentStep: 0,
  isSubmitting: false,
  errors: {},
};

const initialBatchFormData: BatchFormData = {
  title: "",
  description: "",
  maxStudents: 0,
  maxCapacity: 0,
  timeCommitment: "",
  tags: [],
  labels: [],
  actualPrice: 0,
  language: "",
  sellingPrice: 0,
  startTime: "",
  endTime: "",
  paidBatch: false,
  status: "DRAFT",
  image: "",
  videoLink: "",
  currency: "",
  amountUsd: 0,
};

const initialBatchWizardState: BatchWizardState = {
  currentStep: 0,
  isSubmitting: false,
  errors: {},
};

interface CourseProviderProps {
  children: ReactNode;
}

export function CourseProvider({children}: CourseProviderProps) {
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const [wizardState, setWizardState] =
    useState<CourseWizardState>(initialWizardState);

  // Batch Management State
  const [batchFormData, setBatchFormData] =
    useState<BatchFormData>(initialBatchFormData);
  const [batchWizardState, setBatchWizardState] = useState<BatchWizardState>(
    initialBatchWizardState,
  );

  // Sử dụng hook để lấy API operations
  const {
    createCourse: createCourseAPI,
    loadCourse: loadCourseAPI,
    updateCourse: updateCourseAPI,
    publishCourse: publishCourseAPI,
    deleteCourse: deleteCourseAPI,
    createChapter: createChapterAPI,
    deleteChapter: deleteChapterAPI,
    deleteLesson: deleteLessonAPI,

    // Quiz operations
    createQuiz,
    updateQuiz,
    deleteQuiz,
    addQuestionsToQuiz,
    updateQuestion,
    deleteQuestion,

    // New APIs from hook
    getLessonById,
    getQuizQuestions,
    getCourseQuizSubmissions,
    getCourseEnrollments,
    removeEnrollment,
    createBatch,
    updateBatch,
    deleteBatch,
    getMyBatches,
    getBatchById,
    publishBatch,
    addInstructorToBatch,
    removeInstructorFromBatch,

    state,
    clearError: clearErrorAPI,
  } = useCourse();

  const {isLoading, error, isSubmitting} = state;

  const totalSteps = 3;
  const stepTitles = ["Title", "Tags & Labels", "Working Hours"];

  // Memoized current step
  const currentStep = useMemo(
    () => wizardState.currentStep,
    [wizardState.currentStep],
  );

  // Update form data
  const updateFormData = useCallback((updates: Partial<CourseFormData>) => {
    setFormData((prev) => ({...prev, ...updates}));
  }, []);

  // Reset form data
  const resetFormData = useCallback(() => {
    setFormData(initialFormData);
    setWizardState(initialWizardState);
  }, []);

  // Sync course data to form data
  const syncCourseToFormData = useCallback((course: ICourse) => {
    if (!course) return;

    const chapters: Chapter[] =
      course.chapters?.map((chapter: any) => ({
        id: chapter.id,
        title: chapter.title,
        summary: chapter.summary,
        slug: chapter.slug,
        position: chapter.position,
        lessons:
          chapter.lessons?.map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title,
            slug: lesson.slug,
            content: lesson.content,
            videoUrl: lesson.videoUrl,
            fileUrl: lesson.fileUrl,
            quizDto: lesson.quizDto,
            position: lesson.position,
          })) || [],
      })) || [];

    setFormData((prev) => ({
      ...prev,
      title: course.title || "",
      description: course.description || "",
      price: course.coursePrice || 0,
      category: course.skillLevel || "",
      timeCommitment: course.learnerProfileDesc || "",
      tag: course.tags?.map((tag) => ({name: tag.name})) || [],
      label: course.labels?.map((label) => ({name: label.name})) || [],
      image: course.image || undefined,
      videoLink: course.videoLink || undefined,
      subtitle: course.shortIntroduction || undefined,
      language: course.language || "Vietnamese",
      currency: course.currency || "VND",
      originalPrice: course.coursePrice || undefined,
      sellingPrice: course.sellingPrice || undefined,
      paidCourse: course.paidCourse || false,
      shortIntroduction: course.shortIntroduction
        ? [course.shortIntroduction]
        : [],
      requirements: course.skillLevel
        ? course.skillLevel.split("\n").filter((item) => item.trim() !== "")
        : [],
      targetAudience: course.targetAudience
        ? course.targetAudience.split("\n").filter((item) => item.trim() !== "")
        : [],
      chapters: chapters,
      enrollment: course.enrollments?.toString() || undefined,
    }));
  }, []);

  // Wrapper: load course then sync into formData so UI luôn lấy dữ liệu mới nhất
  const loadCourse = useCallback(
    async (courseId: string): Promise<ICourse | null> => {
      const course = await loadCourseAPI(courseId);
      if (course) {
        syncCourseToFormData(course);
      }
      return course;
    },
    [loadCourseAPI, syncCourseToFormData],
  );

  // Wrapper: refetch the current course from state
  const refetchCourse = useCallback(async () => {
    if (state.course?.id) {
      await loadCourse(state.course.id);
    }
  }, [state.course, loadCourse]);

  // Batch Form Data Management
  const updateBatchFormData = useCallback((updates: Partial<BatchFormData>) => {
    setBatchFormData((prev) => ({...prev, ...updates}));
  }, []);

  const resetBatchFormData = useCallback(() => {
    setBatchFormData(initialBatchFormData);
    setBatchWizardState(initialBatchWizardState);
  }, []);

  const updateBatchWizardState = useCallback(
    (updates: Partial<BatchWizardState>) => {
      setBatchWizardState((prev) => ({...prev, ...updates}));
    },
    [],
  );

  // Update wizard state
  const updateWizardState = useCallback(
    (updates: Partial<CourseWizardState>) => {
      setWizardState((prev) => ({...prev, ...updates}));
    },
    [],
  );

  // Navigation functions
  const setCurrentStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        updateWizardState({currentStep: step});
      }
    },
    [totalSteps, updateWizardState],
  );

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps, setCurrentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, setCurrentStep]);

  // Field validation
  const validateField = useCallback(
    (field: keyof CourseFormData): string | null => {
      const value = formData[field];

      switch (field) {
        case "title":
          if (!value || (value as string).trim().length === 0) {
            return "Course title is required";
          }
          if ((value as string).trim().length < 3) {
            return "Title must be at least 3 characters";
          }
          if ((value as string).trim().length > 100) {
            return "Title cannot exceed 100 characters";
          }
          break;

        case "description":
          if (!value || (value as string).trim().length === 0) {
            return "Course description is required";
          }
          if ((value as string).trim().length < 10) {
            return "Description must be at least 10 characters";
          }
          break;

        case "price":
          if (typeof value !== "number" || value < 0) {
            return "Course price must be a positive number";
          }
          break;

        case "category":
          if (!value || (value as string).trim().length === 0) {
            return "Category is required";
          }
          break;

        case "timeCommitment":
          if (!value || (value as string).trim().length === 0) {
            return "Time commitment is required";
          }
          break;

        case "tag":
          if (Array.isArray(value) && value.length > 10) {
            return "Cannot have more than 10 tags";
          }
          break;

        case "label":
          if (Array.isArray(value) && value.length > 5) {
            return "Cannot have more than 5 labels";
          }
          break;
      }

      return null;
    },
    [formData],
  );

  const validateBatchField = (field: keyof BatchFormData): string | null => {
    const value = batchFormData[field];

    switch (field) {
      case "title":
        if (!value || (value as string).trim().length === 0) {
          return "Batch title is required";
        }
        if ((value as string).trim().length < 3) {
          return "Title must be at least 3 characters";
        }
        if ((value as string).trim().length > 100) {
          return "Title cannot exceed 100 characters";
        }
        break;

      case "description":
        if (!value || (value as string).trim().length === 0) {
          return "Batch description is required";
        }
        if ((value as string).trim().length < 10) {
          return "Description must be at least 10 characters";
        }
        break;

      case "actualPrice":
        if (typeof value !== "number" || value < 0) {
          return "Batch price must be a positive number";
        }
        break;

      case "timeCommitment":
        if (!value || (value as string).trim().length === 0) {
          return "Time commitment is required";
        }
        break;

      case "tags":
        if (Array.isArray(value) && value.length > 10) {
          return "Cannot have more than 10 tags";
        }
        break;

      case "labels":
        if (Array.isArray(value) && value.length > 5) {
          return "Cannot have more than 5 labels";
        }
        break;
    }

    return null;
  };

  // Check if can proceed to the next step for either wizard
  const canProceed = useCallback(
    (type: "course" | "batch"): boolean => {
      if (type === "course") {
        switch (wizardState.currentStep) {
          case 0: // Course Title
            return !validateField("title");
          case 1: // Tags & Labels
            return !validateField("tag") && !validateField("label");
          case 2: // Working Hours - optional
            return true; // This step is optional
          default:
            return false;
        }
      } else {
        // Assuming similar step logic for batch creation
        switch (batchWizardState.currentStep) {
          case 0: // Batch Title
            return !validateBatchField("title");
          case 1: // Tags & Labels
            return !validateBatchField("tags") && !validateBatchField("labels");
          case 2: // Working Hours - optional
            return true; // This step is optional
          default:
            return false;
        }
      }
    },
    [
      wizardState.currentStep,
      validateField,
      batchWizardState.currentStep,
      validateBatchField,
    ],
  );

  const value: CourseContextType = {
    // Form data
    formData,
    setFormData,
    updateFormData,
    resetFormData,
    syncCourseToFormData,

    // Wizard state
    wizardState,
    setWizardState: updateWizardState,

    // Navigation
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    canProceed,

    // Validation
    validateField,
    validateBatchField,

    // Constants
    totalSteps,
    stepTitles,

    // API operations (from hook)
    createCourse: createCourseAPI,
    loadCourse,
    refetchCourse,
    updateCourse: updateCourseAPI,
    publishCourse: publishCourseAPI,
    deleteCourse: deleteCourseAPI,
    createChapter: createChapterAPI,
    deleteChapter: deleteChapterAPI,
    deleteLesson: deleteLessonAPI,

    // Quiz operations
    createQuiz,
    updateQuiz,
    deleteQuiz,
    addQuestionsToQuiz,
    updateQuestion,
    deleteQuestion,

    // Lesson Management APIs
    getLessonById,

    // Quiz Management APIs
    getQuizQuestions,
    getCourseQuizSubmissions,

    // Enrollment Management APIs
    getCourseEnrollments,
    removeEnrollment,

    // Batch Management APIs
    createBatch,
    updateBatch,
    deleteBatch,
    getMyBatches,
    getBatchById,
    publishBatch,
    addInstructorToBatch,
    removeInstructorFromBatch,

    // Batch Form Data
    batchFormData,
    setBatchFormData,
    updateBatchFormData,
    resetBatchFormData,

    // Batch Wizard State
    batchWizardState,
    setBatchWizardState: updateBatchWizardState,

    // API state
    isLoading,
    error,
    isSubmitting,
    state,
    clearError: clearErrorAPI,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
}

export function useCourseContext() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
}
