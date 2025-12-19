import {useCourseContext} from "@/context/CourseContext";
import BasicInfoStepComponent from "@/components/creation-steps/BasicInfoStep";

export default function BasicInfoStep() {
  const {formData, updateFormData, validateField} = useCourseContext();
  const titleError = validateField("title");

  return (
    <BasicInfoStepComponent
      type="course"
      title={formData.title}
      onTitleChange={(title) => updateFormData({title})}
      titleError={titleError}
    />
  );
}
