import {useCourseContext} from "@/context/CourseContext";
import TagsLabelsStepComponent from "@/components/creation-steps/TagsLabelsStep";

export default function TagsLabelsStep() {
  const {batchFormData, updateBatchFormData, validateField} =
    useCourseContext();

  const tagsError = validateField("tag");
  const labelsError = validateField("label");

  return (
    <TagsLabelsStepComponent
      type="batch"
      tags={batchFormData.tags}
      labels={batchFormData.labels}
      onTagsChange={(tags: {name: string}[]) =>
        updateBatchFormData({tags: tags})
      }
      onLabelsChange={(labels: {name: string}[]) =>
        updateBatchFormData({
          labels: labels,
        })
      }
      tagsError={tagsError}
      labelsError={labelsError}
    />
  );
}
