import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import useCourse from "@/hooks/useCourse";

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
  thumbnailUrl?: string;
  videoUrl?: string;
  // Landing page specific fields
  subtitle?: string;
  language?: string;
  // Pricing specific fields
  currency?: string;
  originalPrice?: number;
  sellingPrice?: number;
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

interface CourseContextType {
  // Form data
  formData: CourseFormData;
  setFormData: (data: CourseFormData) => void;
  updateFormData: (updates: Partial<CourseFormData>) => void;
  resetFormData: () => void;
  
  // Wizard state
  wizardState: CourseWizardState;
  setWizardState: (updates: Partial<CourseWizardState>) => void;
  
  // Navigation
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  canProceed: boolean;
  
  // Validation
  validateField: (field: keyof CourseFormData) => string | null;
  
  // Constants
  totalSteps: number;
  stepTitles: string[];
  
  // API operations (from hook)
  createCourse: (formData?: CourseFormData) => Promise<string | null>;
  loadCourse: (courseId: string) => Promise<void>;
  updateCourse: (courseId: string, data: any) => Promise<boolean>;
  publishCourse: (courseId: string) => Promise<boolean>;
  deleteCourse: (courseId: string) => Promise<boolean>;
  // Chapter operations
  createChapter: (courseId: string, chapterData: { title: string; summary?: string }) => Promise<boolean>;
  deleteChapter: (chapterId: string) => Promise<boolean>;
  
  // Lesson operations
  deleteLesson: (lessonId: string) => Promise<boolean>;
  
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
  thumbnailUrl: undefined,
  videoUrl: undefined,
  subtitle: "",
  language: "vietnamese",
  currency: "vnd",
  originalPrice: 0,
  sellingPrice: 0,
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

interface CourseProviderProps {
  children: ReactNode;
}

export function CourseProvider({ children }: CourseProviderProps) {
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const [wizardState, setWizardState] = useState<CourseWizardState>(initialWizardState);
  
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
    state,
    clearError: clearErrorAPI
  } = useCourse();
  
  const { isLoading, error, isSubmitting } = state;
  
  const totalSteps = 3;
  const stepTitles = [
    "Course Title",
    "Tags & Labels", 
    "Working Hours"
  ];

  // Memoized current step
  const currentStep = useMemo(() => wizardState.currentStep, [wizardState.currentStep]);

  // Update form data
  const updateFormData = useCallback((updates: Partial<CourseFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Reset form data
  const resetFormData = useCallback(() => {
    setFormData(initialFormData);
    setWizardState(initialWizardState);
  }, []);

  // Update wizard state
  const updateWizardState = useCallback((updates: Partial<CourseWizardState>) => {
    setWizardState(prev => ({ ...prev, ...updates }));
  }, []);

  // Navigation functions
  const setCurrentStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      updateWizardState({ currentStep: step });
    }
  }, [totalSteps, updateWizardState]);

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
  const validateField = useCallback((field: keyof CourseFormData): string | null => {
    const value = formData[field];
    
    switch (field) {
      case 'title':
        if (!value || (value as string).trim().length === 0) {
          return 'Tiêu đề khóa học là bắt buộc';
        }
        if ((value as string).trim().length < 3) {
          return 'Tiêu đề phải có ít nhất 3 ký tự';
        }
        if ((value as string).trim().length > 100) {
          return 'Tiêu đề không được vượt quá 100 ký tự';
        }
        break;
        
      case 'description':
        if (!value || (value as string).trim().length === 0) {
          return 'Mô tả khóa học là bắt buộc';
        }
        if ((value as string).trim().length < 10) {
          return 'Mô tả phải có ít nhất 10 ký tự';
        }
        break;
        
      case 'price':
        if (typeof value !== 'number' || value < 0) {
          return 'Giá khóa học phải là số dương';
        }
        break;
        
      case 'category':
        if (!value || (value as string).trim().length === 0) {
          return 'Danh mục là bắt buộc';
        }
        break;
        
      case 'timeCommitment':
        if (!value || (value as string).trim().length === 0) {
          return 'Thời gian học là bắt buộc';
        }
        break;
        
      case 'tag':
        if (Array.isArray(value) && value.length > 10) {
          return 'Không được có quá 10 tags';
        }
        break;
        
      case 'label':
        if (Array.isArray(value) && value.length > 5) {
          return 'Không được có quá 5 labels';
        }
        break;
    }
    
    return null;
  }, [formData]);

  // Check if can proceed to next step
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0: // Course Title
        return !validateField('title');
      case 1: // Tags & Labels
        return !validateField('tag') && !validateField('label');
      case 2: // Working Hours - optional
        return true; // Working hours is optional
      default:
        return false;
    }
  }, [currentStep, validateField]);

  const value: CourseContextType = {
    // Form data
    formData,
    setFormData,
    updateFormData,
    resetFormData,
    
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
    
    // Constants
    totalSteps,
    stepTitles,
    
    // API operations (from hook)
    createCourse: createCourseAPI,
    loadCourse: loadCourseAPI,
    updateCourse: updateCourseAPI,
    publishCourse: publishCourseAPI,
    deleteCourse: deleteCourseAPI,
    createChapter: createChapterAPI,
    deleteChapter: deleteChapterAPI,
    deleteLesson: deleteLessonAPI,
    
    // API state
    isLoading,
    error,
    isSubmitting,
    state,
    clearError: clearErrorAPI,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourseContext() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
}
