import {useEffect} from "react";
import {Plus, Trash2} from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import {Heading3} from "@/components/Typography";
import {useCourseContext} from "@/context/CourseContext";
import { toast } from "react-toastify";

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
  const {course} = courseState;

  useEffect(() => {
    if (course && (formData.shortIntroduction?.length || 0) === 0) {
      // Only update if formData is empty (first load)
      updateFormData({
        shortIntroduction: course.shortIntroduction ? course.shortIntroduction.split('\n').filter(item => item.trim()) : [],
        requirements: course.skillLevel ? course.skillLevel.split('\n').filter(item => item.trim()) : [],
        targetAudience: course.targetAudience ? course.targetAudience.split('\n').filter(item => item.trim()) : [],
      });
    }
  }, [course, formData.shortIntroduction?.length, updateFormData]);

  const addItem = (field: keyof Pick<typeof formData, 'shortIntroduction' | 'requirements' | 'targetAudience'>) => {
    const currentArray = formData[field] || [];
    updateFormData({
      [field]: [...currentArray, ""]
    } as any);
  };

  const removeItem = (field: keyof Pick<typeof formData, 'shortIntroduction' | 'requirements' | 'targetAudience'>, index: number) => {
    const currentArray = formData[field] || [];
    updateFormData({
      [field]: currentArray.filter((_, i) => i !== index)
    } as any);
  };

  const updateItem = (field: keyof Pick<typeof formData, 'shortIntroduction' | 'requirements' | 'targetAudience'>, index: number, value: string) => {
    const currentArray = formData[field] || [];
    updateFormData({
      [field]: currentArray.map((item, i) => (i === index ? value : item))
    } as any);
  };

  // Save data to course
  const saveData = async () => {
    if (!course?.id) {
      toast.error("No course selected");
      return;
    }

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        shortIntroduction: (formData.shortIntroduction || []).join('\n'),
        skillLevel: (formData.requirements || []).join('\n'),
        targetAudience: (formData.targetAudience || []).join('\n'),
        tag: formData.tag || [],
        label: formData.label || [],
      };

      const success = await updateCourse(course.id, updateData);
      
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

      <Heading3 className="mb-6">Intended Learners</Heading3>

      <div className="space-y-8">
        {/* What will students learn */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            What will students learn in your course?
          </h4>
          <div className="space-y-3">
            {(formData.shortIntroduction || []).map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <Input
                  value={item}
                  onChange={(e) =>
                    updateItem('shortIntroduction', index, e.target.value)
                  }
                  placeholder="E.g: Self-discipline"
                  className="flex-1"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Trash2 size={14} />}
                  onClick={() => removeItem('shortIntroduction', index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              leftIcon={<Plus size={16} />}
              onClick={() =>
                addItem('shortIntroduction')
              }
              className="text-blue-600 hover:text-blue-700"
            >
              Add more to your response
            </Button>
          </div>
        </div>

        {/* Requirements */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            What are the requirements or prerequisites for taking your course?
          </h4>
          <div className="space-y-3">
            {(formData.requirements || []).map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <Input
                  value={item}
                  onChange={(e) =>
                    updateItem('requirements', index, e.target.value)
                  }
                  placeholder="E.g: Basic programming knowledge"
                  className="flex-1"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Trash2 size={14} />}
                  onClick={() => removeItem('requirements', index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              leftIcon={<Plus size={16} />}
              onClick={() => addItem('requirements')}
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
            {(formData.targetAudience || []).map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <Input
                  value={item}
                  onChange={(e) =>
                    updateItem('targetAudience', index, e.target.value)
                  }
                  placeholder="E.g: Beginners in programming"
                  className="flex-1"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Trash2 size={14} />}
                  onClick={() => removeItem('targetAudience', index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              leftIcon={<Plus size={16} />}
              onClick={() => addItem('targetAudience')}
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
