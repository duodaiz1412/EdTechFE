import {useState} from "react";
import {X, Upload, Eye} from "lucide-react";
import Button from "@/components/Button";
import {Heading3} from "@/components/Typography";
import Input from "@/components/Input";
import CommonSelect from "@/components/CommonSelect";
import Chip from "@/components/Chip";

export default function LandingPageContent() {
  const [courseData, setCourseData] = useState({
    title: "",
    subtitle: "",
    description: "",
    language: "vietnamese",
    categories: ["Category 1", "Category 2"],
    taughtSubjects: ["Machine Learning", "Computer Vision"],
    courseImage: null as File | null,
    promotionalVideo: null as File | null,
  });

  const [newCategory, setNewCategory] = useState("");
  const [newSubject, setNewSubject] = useState("");

  const languageOptions = [
    {value: "vietnamese", label: "Vietnamese"},
    {value: "english", label: "English"},
    {value: "chinese", label: "Chinese"},
    {value: "japanese", label: "Japanese"},
  ];

  const handleInputChange = (field: string, value: string) => {
    setCourseData((prev) => ({...prev, [field]: value}));
  };

  const handleFileChange = (
    field: "courseImage" | "promotionalVideo",
    file: File | null,
  ) => {
    setCourseData((prev) => ({...prev, [field]: file}));
  };

  const addCategory = () => {
    if (newCategory.trim() && !courseData.categories.includes(newCategory)) {
      setCourseData((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));
      setNewCategory("");
    }
  };

  const removeCategory = (category: string) => {
    setCourseData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  };

  const addSubject = () => {
    if (newSubject.trim() && !courseData.taughtSubjects.includes(newSubject)) {
      setCourseData((prev) => ({
        ...prev,
        taughtSubjects: [...prev.taughtSubjects, newSubject],
      }));
      setNewSubject("");
    }
  };

  const removeSubject = (subject: string) => {
    setCourseData((prev) => ({
      ...prev,
      taughtSubjects: prev.taughtSubjects.filter((s) => s !== subject),
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    alert("Course landing page saved!");
  };

  return (
    <div className="">
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
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            Save
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
              value={courseData.title}
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
              value={courseData.subtitle}
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
              value={courseData.description}
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
              value={courseData.language}
              onChange={(value) => handleInputChange("language", value)}
              options={languageOptions}
              placeholder="Select language"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {courseData.categories.map((category, index) => (
                <Chip
                  key={index}
                  variant="default"
                  className="bg-gray-800 text-white border-gray-800"
                >
                  <div className="flex items-center gap-2">
                    {category}
                    <button
                      onClick={() => removeCategory(category)}
                      className="ml-1 hover:text-gray-300"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </Chip>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add category"
                className="flex-1"
              />
              <Button
                variant="secondary"
                onClick={addCategory}
                disabled={!newCategory.trim()}
              >
                Add
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What you primarily taught in this course?
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {courseData.taughtSubjects.map((subject, index) => (
                <Chip
                  key={index}
                  variant="default"
                  className="bg-gray-800 text-white border-gray-800"
                >
                  <div className="flex items-center gap-2">
                    {subject}
                    <button
                      onClick={() => removeSubject(subject)}
                      className="ml-1 hover:text-gray-300"
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
          </div>
        </div>

        {/* Course Image */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Course Image
          </h4>
          <div className="flex gap-6">
            <div className="w-64 h-40 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              {courseData.courseImage ? (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {courseData.courseImage.name}
                  </p>
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
              {courseData.promotionalVideo ? (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {courseData.promotionalVideo.name}
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
