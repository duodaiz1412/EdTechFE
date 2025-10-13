import {useState, useEffect} from "react";
import {X, Upload, Eye} from "lucide-react";
import Button from "@/components/Button";
import {Heading3} from "@/components/Typography";
import Input from "@/components/Input";
import CommonSelect from "@/components/CommonSelect";
import Chip from "@/components/Chip";
import {useCourseContext} from "@/context/CourseContext";
import {toast} from "react-toastify";

export default function LandingPageContent() {
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

  // Local state for UI-specific data (files, temporary inputs)
  const [newTag, setNewTag] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [courseImage, setCourseImage] = useState<File | null>(null);
  const [promotionalVideo, setPromotionalVideo] = useState<File | null>(null);

  // Fill form with course data when course is loaded (only once)
  useEffect(() => {
    if (course && formData.title === "") {
      // Only update if formData is empty (first load)
      updateFormData({
        title: course.title || "",
        subtitle: course.shortIntroduction || "",
        description: course.description || "",
        language: course.language || "vietnamese",
        price: course.price || 0,
        currency: course.currency || "vnd",
        originalPrice: course.coursePrice || 0,
        sellingPrice: course.sellingPrice || 0,
        tag: course.tags?.map((tag: any) => ({name: tag.name})) || [],
        label: course.labels?.map((label: any) => ({name: label.name})) || [],
      });
    }
  }, [course]);

  const languageOptions = [
    {value: "vietnamese", label: "Vietnamese"},
    {value: "english", label: "English"},
    {value: "chinese", label: "Chinese"},
    {value: "japanese", label: "Japanese"},
  ];

  const handleInputChange = (field: string, value: string) => {
    updateFormData({[field]: value} as any);
  };

  const handleFileChange = (
    field: "courseImage" | "promotionalVideo",
    file: File | null,
  ) => {
    if (field === "courseImage") {
      setCourseImage(file);
    } else {
      setPromotionalVideo(file);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tag.some((tag) => tag.name === newTag)) {
      updateFormData({
        tag: [...formData.tag, {name: newTag}],
      });
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    // Prevent removing the last tag
    if (formData.tag.length <= 1) {
      toast.warning("You must have at least one tag");
      return;
    }

    updateFormData({
      tag: formData.tag.filter((t) => t.name !== tag),
    });
  };

  const addSubject = () => {
    if (
      newSubject.trim() &&
      !formData.label.some((label) => label.name === newSubject)
    ) {
      updateFormData({
        label: [...formData.label, {name: newSubject}],
      });
      setNewSubject("");
    }
  };

  const removeSubject = (subject: string) => {
    // Prevent removing the last subject
    if (formData.label.length <= 1) {
      toast.warning("You must have at least one subject");
      return;
    }

    updateFormData({
      label: formData.label.filter((s) => s.name !== subject),
    });
  };

  const handleSave = async () => {
    if (!course?.id) {
      toast.error("No course selected");
      return;
    }

    // Validation: Must have at least 1 tag and 1 label
    if (formData.tag.length === 0) {
      toast.warning("Please add at least one tag");
      return;
    }

    if (formData.label.length === 0) {
      toast.warning("Please add at least one subject");
      return;
    }

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        shortIntroduction: formData.subtitle,
        language: formData.language,
        currency: formData.currency,
        coursePrice: formData.originalPrice,
        sellingPrice: formData.sellingPrice,
        tag: formData.tag,
        label: formData.label,
      };

      const success = await updateCourse(course.id, updateData);

      if (success) {
        toast.success("Course landing page saved successfully!");
      } else {
        toast.error("Failed to save course landing page");
      }
    } catch {
      toast.error("Error saving course landing page");
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
        <Heading3>Course Landing Page</Heading3>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            leftIcon={<Eye size={16} />}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Course Information */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Example title"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course short introduction/subtitle
            </label>
            <Input
              value={formData.subtitle || ""}
              onChange={(e) => handleInputChange("subtitle", e.target.value)}
              placeholder="Enter course subtitle"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter course description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-900">Basic Info</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <CommonSelect
              value={formData.language || "vietnamese"}
              onChange={(value) => handleInputChange("language", value)}
              options={languageOptions}
              placeholder="Select language"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tag.map((tag, index) => (
                <Chip
                  key={index}
                  variant="default"
                  className="bg-gray-800 text-white border-gray-800"
                >
                  <div className="flex items-center gap-2">
                    {tag.name}
                    <button
                      onClick={() => removeTag(tag.name)}
                      disabled={formData.tag.length <= 1}
                      className={`ml-1 hover:text-gray-300 ${
                        formData.tag.length <= 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:text-gray-300"
                      }`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </Chip>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag"
                className="flex-1"
              />
              <Button
                variant="secondary"
                onClick={addTag}
                disabled={!newTag.trim()}
              >
                Add
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Add tags to help students discover your course (at least 1
              required)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What you primarily taught in this course?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.label.map((subject, index) => (
                <Chip
                  key={index}
                  variant="default"
                  className="bg-gray-800 text-white border-gray-800"
                >
                  <div className="flex items-center gap-2">
                    {subject.name}
                    <button
                      onClick={() => removeSubject(subject.name)}
                      disabled={formData.label.length <= 1}
                      className={`ml-1 hover:text-gray-300 ${
                        formData.label.length <= 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:text-gray-300"
                      }`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </Chip>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Add subject"
                className="flex-1"
              />
              <Button
                variant="secondary"
                onClick={addSubject}
                disabled={!newSubject.trim()}
              >
                Add
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Add subjects you teach in this course (at least 1 required)
            </p>
          </div>
        </div>

        {/* Course Image */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Course Image
          </h4>
          <div className="flex gap-6">
            <div className="w-64 h-40 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              {courseImage ? (
                <div className="text-center">
                  <p className="text-sm text-gray-600">{courseImage.name}</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Upload size={32} className="mx-auto mb-2" />
                  <p className="text-sm">Upload course image</p>
                </div>
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange("courseImage", e.target.files?.[0] || null)
                }
                className="hidden"
                id="course-image-upload"
              />
              <label
                htmlFor="course-image-upload"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
              >
                Upload an image
              </label>
            </div>
          </div>
        </div>

        {/* Promotional Video */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Promotional Video
          </h4>
          <div className="flex gap-6">
            <div className="w-64 h-40 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              {promotionalVideo ? (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {promotionalVideo.name}
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Upload size={32} className="mx-auto mb-2" />
                  <p className="text-sm">Upload promotional video</p>
                </div>
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  handleFileChange(
                    "promotionalVideo",
                    e.target.files?.[0] || null,
                  )
                }
                className="hidden"
                id="promotional-video-upload"
              />
              <label
                htmlFor="promotional-video-upload"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
              >
                Upload a video
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
