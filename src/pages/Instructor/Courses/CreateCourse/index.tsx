import {useNavigate} from "react-router";
import Button from "@/components/Button";
import {useCourse} from "@/context/CourseContext";
import BasicInfoStep from "./steps/BasicInfoStep";
import TimeStep from "./steps/TimeStep";
import CategoryStep from "./steps/CategoryStep";

export default function CreateCourse() {
  const navigate = useNavigate();
  const {currentStep, nextStep, prevStep, isStepValid, totalSteps} =
    useCourse();

  const handleSubmit = () => {
    // TODO: Implement course creation API call
    // For now, redirect to edit page with a mock course ID
    const courseId = "new-course-" + Date.now();
    navigate(`/instructor/courses/${courseId}/edit`);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep />;
      case 1:
        return <CategoryStep />;
      case 2:
        return <TimeStep />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Edtech</h1>
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate("/instructor")}
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          Exit
        </Button>
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
            disabled={!isStepValid(currentStep)}
            className="bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create course
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!isStepValid(currentStep)}
            className="bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
