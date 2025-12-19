import {useCourseContext} from "@/context/CourseContext";
import TimeStepComponent from "@/components/creation-steps/TimeStep";
export default function TimeStep() {
  const {formData, updateFormData} = useCourseContext();

  return (
    <TimeStepComponent
      timeCommitment={formData.timeCommitment}
      updateFormData={updateFormData}
    />
  );
}
