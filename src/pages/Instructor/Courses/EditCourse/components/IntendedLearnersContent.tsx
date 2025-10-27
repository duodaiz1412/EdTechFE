import {Plus, Trash2} from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import {Heading3} from "@/components/Typography";
import {useCourseContext} from "@/context/CourseContext";
import {toast} from "react-toastify";

export default function IntendedLearnersContent() {
  const {
    // Form data from context
    formData,
    updateFormData,
    // API State (from hook via context)
    state: courseState,
    updateCourse,
    isLoading,
    error,
  } = useCourseContext();

  // Note: Course data is already synced to formData via CourseContext.loadCourse()
  // No need to sync again here to avoid conflicts

  const addItem = (
    field: keyof Pick<
      typeof formData,
      "shortIntroduction" | "requirements" | "targetAudience"
    >,
  ) => {
    const currentArray = formData[field] || [];
    updateFormData({
      [field]: [...currentArray, ""],
    } as any);
  };

  const removeItem = (
    field: keyof Pick<
      typeof formData,
      "shortIntroduction" | "requirements" | "targetAudience"
    >,
    index: number,
  ) => {
    const currentArray = formData[field] || [];
    updateFormData({
      [field]: currentArray.filter((_, i) => i !== index),
    } as any);
  };

  const updateItem = (
    field: keyof Pick<
      typeof formData,
      "shortIntroduction" | "requirements" | "targetAudience"
    >,
    index: number,
    value: string,
  ) => {
    const currentArray = formData[field] || [];
    updateFormData({
      [field]: currentArray.map((item, i) => (i === index ? value : item)),
    } as any);
  };

  // Save data to course
  const saveData = async () => {
    if (!courseState.course?.id) {
      toast.error("No course selected");
      return;
    }

    try {
      const arrayToString = (arr: string[] | undefined): string => {
        if (!arr || arr.length === 0) return "";
        const filtered = arr.filter((item) => item.trim() !== "");
        return filtered.length > 0 ? filtered.join("\n") : "";
      };

      const updateData = {
        shortIntroduction: arrayToString(formData.shortIntroduction),
        skillLevel: arrayToString(formData.requirements),
        targetAudience: arrayToString(formData.targetAudience),
      };

      const success = await updateCourse(courseState.course.id, updateData);

      if (success) {
        toast.success("Intended learners data saved successfully!");
      } else {
        toast.error("Failed to save intended learners data");
      }
    } catch {
      toast.error("Error saving intended learners data");
    }
  };

  return (
    <div className="">
      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <Heading3>Intended Learners</Heading3>
      </div>

      <div className="space-y-8">
        {/* Skill Level */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            What skill level is required for this course?
          </h4>
          <div className="space-y-3">
            {(formData.requirements || []).map(
              (item: string, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={item}
                    onChange={(e) =>
                      updateItem("requirements", index, e.target.value)
                    }
                    placeholder="E.g: Beginner, Intermediate, Advanced"
                    className="flex-1"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Trash2 size={14} />}
                    onClick={() => removeItem("requirements", index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ),
            )}
            <Button
              variant="secondary"
              leftIcon={<Plus size={16} />}
              onClick={() => addItem("requirements")}
              className="text-blue-600 hover:text-blue-700"
            >
              Add more to your response
            </Button>
          </div>
        </div>

        {/* Target audience */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Who is this course for?
          </h4>
          <div className="space-y-3">
            {(formData.targetAudience || []).map(
              (item: string, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={item}
                    onChange={(e) =>
                      updateItem("targetAudience", index, e.target.value)
                    }
                    placeholder="E.g: Beginners in programming"
                    className="flex-1"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Trash2 size={14} />}
                    onClick={() => removeItem("targetAudience", index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ),
            )}
            <Button
              variant="secondary"
              leftIcon={<Plus size={16} />}
              onClick={() => addItem("targetAudience")}
              className="text-blue-600 hover:text-blue-700"
            >
              Add more to your response
            </Button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={saveData}
          disabled={isLoading}
          className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
