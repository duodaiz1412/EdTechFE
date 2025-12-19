import {useCourseContext} from "@/context/CourseContext";
import TagsLabelsStepComponent from "@/components/creation-steps/TagsLabelsStep";

export default function TagsLabelsStep() {
  const {formData, updateFormData, validateField} = useCourseContext();

  const tagsError = validateField("tag");
  const labelsError = validateField("label");

  return (
    <TagsLabelsStepComponent
      type="course"
      tags={formData.tag}
      labels={formData.label}
      onTagsChange={(tags: {name: string}[]) => updateFormData({tag: tags})}
      onLabelsChange={(labels: {name: string}[]) =>
        updateFormData({
          label: labels,
        })
      }
      tagsError={tagsError}
      labelsError={labelsError}
    />
  );
}
