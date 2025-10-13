import Input from "@/components/Input";
import {useCourseContext} from "@/context/CourseContext";

export default function BasicInfoStep() {
  const {formData, updateFormData, validateField} = useCourseContext();
  const titleError = validateField("title");

  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          How about a working title?
        </h2>
        <p className="text-lg text-gray-600">
          It's ok if you can't think of a good title now. You can change it
          later.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Input
          value={formData.title}
          onChange={(e) => updateFormData({title: e.target.value})}
          placeholder="E.g: Learn Photoshop CS6 from scratch"
          className="w-full text-center text-lg py-3 focus:outline-none focus:ring-1 focus:border-gray-300"
        />
        {titleError && (
          <p className="text-red-500 text-sm mt-1 text-left">{titleError}</p>
        )}
      </div>
    </div>
  );
}
