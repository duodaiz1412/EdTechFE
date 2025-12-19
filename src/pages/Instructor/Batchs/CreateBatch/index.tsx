import {useNavigate} from "react-router";
import {useCallback} from "react";
import Button from "@/components/Button";
import {useCourseContext} from "@/context/CourseContext";
import {IBatchRequest} from "@/lib/services/instructor.services";
import BasicInfoStep from "./steps/BasicInfoStep";
import TimeStep from "./steps/TimeStep";
import TagsLabelsStep from "./steps/TagsLabelsStep";
import {toast} from "react-toastify";

export default function CreateBatch() {
  const navigate = useNavigate();
  const {
    // UI State
    currentStep,
    nextStep,
    prevStep,
    totalSteps,
    stepTitles,
    canProceed,
    batchWizardState,
    setBatchWizardState,
    batchFormData,
    // API Operations (from hook via context)
    createBatch,

    // API State (from hook via context)
    isLoading,
    error,
    clearError,
  } = useCourseContext();

  const handleSubmit = useCallback(async () => {
    try {
      setBatchWizardState({isSubmitting: true});
      clearError();

      // Convert date strings to Date objects for IBatchRequest
      const batchRequestData: IBatchRequest = {
        ...batchFormData,
        startTime: batchFormData.startTime
          ? new Date(batchFormData.startTime)
          : undefined,
        endTime: batchFormData.endTime
          ? new Date(batchFormData.endTime)
          : undefined,
        openTime: batchFormData.openTime
          ? new Date(batchFormData.openTime)
          : undefined,
        closeTime: batchFormData.closeTime
          ? new Date(batchFormData.closeTime)
          : undefined,
      };

      const batch = await createBatch(batchRequestData);

      if (batch?.id) {
        toast.success("Batch created successfully!");
        navigate(`/instructor/batch/${batch?.id}/edit`);
      } else {
        toast.error("Failed to create batch");
      }
    } catch {
      toast.error("Error creating course");
    } finally {
      setBatchWizardState({isSubmitting: false});
    }
  }, [createBatch, navigate, setBatchWizardState, clearError, batchFormData]);

  const renderStep = useCallback(() => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep />;
      case 1:
        return <TagsLabelsStep />;
      case 2:
        return <TimeStep />;
      default:
        return null;
    }
  }, [currentStep]);

  const isSubmittingState = batchWizardState.isSubmitting || isLoading;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mx-6 mt-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 text-sm mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Edtech</h1>
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {totalSteps}: {stepTitles[currentStep]}
          </span>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate("/instructor/batch")}
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          Exit
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="px-6 py-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{width: `${((currentStep + 1) / totalSteps) * 100}%`}}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">{renderStep()}</div>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center p-6 border-t">
        <Button
          variant="secondary"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </Button>

        {currentStep === totalSteps - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed || isSubmittingState}
            className="bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmittingState ? "Creating..." : "Create batch"}
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!canProceed}
            className="bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
