import {createContext, useContext, useState, ReactNode} from "react";

export interface CourseFormData {
  title: string;
  category: string;
  timeCommitment: string;
}

interface CourseContextType {
  formData: CourseFormData;
  updateFormData: (updates: Partial<CourseFormData>) => void;
  resetFormData: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  isStepValid: (step: number) => boolean;
  totalSteps: number;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

const initialFormData: CourseFormData = {
  title: "",
  category: "",
  timeCommitment: "",
};

interface CourseProviderProps {
  children: ReactNode;
}

export function CourseProvider({children}: CourseProviderProps) {
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 3;

  const updateFormData = (updates: Partial<CourseFormData>) => {
    setFormData((prev) => ({...prev, ...updates}));
  };

  const resetFormData = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return formData.title.trim() !== "";
      case 1:
        return formData.category !== "";
      case 2:
        return formData.timeCommitment !== "";
      default:
        return false;
    }
  };

  const value: CourseContextType = {
    formData,
    updateFormData,
    resetFormData,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    isStepValid,
    totalSteps,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
}
