import {useCourseContext} from "@/context/CourseContext";
import TimeStepComponent from "@/components/creation-steps/TimeStep";
export default function TimeStep() {
  const {batchFormData, updateBatchFormData} = useCourseContext();

  return (
    <TimeStepComponent
      timeCommitment={batchFormData.timeCommitment}
      updateFormData={updateBatchFormData}
    />
  );
}
