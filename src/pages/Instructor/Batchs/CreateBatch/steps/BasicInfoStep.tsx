import {useCourseContext} from "@/context/CourseContext";
import BasicInfoStepComponent from "@/components/creation-steps/BasicInfoStep";

export default function BasicInfoStep() {
  const {batchFormData, updateBatchFormData, validateBatchField} =
    useCourseContext();
  const titleError = validateBatchField("title");

  return (
    <BasicInfoStepComponent
      type="batch"
      title={batchFormData.title}
      onTitleChange={(title) => updateBatchFormData({title})}
      titleError={titleError}
    />
  );
}
