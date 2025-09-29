import CommonSelect from "@/components/CommonSelect";
import {useCourse} from "@/context/CourseContext";

const categoryOptions = [
  {value: "programming", label: "Programming"},
  {value: "design", label: "Design"},
  {value: "business", label: "Business"},
  {value: "marketing", label: "Marketing"},
  {value: "photography", label: "Photography"},
  {value: "music", label: "Music"},
  {value: "languages", label: "Languages"},
  {value: "health", label: "Health & Fitness"},
  {value: "lifestyle", label: "Lifestyle"},
  {value: "other", label: "Other"},
];

export default function CategoryStep() {
  const {formData, updateFormData} = useCourse();
  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          What category best fits the knowledge you'll share?
        </h2>
        <p className="text-lg text-gray-600">
          If you're not sure about the right category, you can change it later.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <CommonSelect
          value={formData.category}
          onChange={(value) => updateFormData({category: value})}
          options={categoryOptions}
          placeholder="Select Category"
          size="lg"
          className="text-center"
        />
      </div>
    </div>
  );
}
