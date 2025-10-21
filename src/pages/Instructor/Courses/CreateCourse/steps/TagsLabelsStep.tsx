import {useCourseContext} from "@/context/CourseContext";
import {useState, useEffect, useCallback} from "react";
import Input from "@/components/Input";

export default function TagsLabelsStep() {
  const {formData, updateFormData, validateField} = useCourseContext();
  const [tagsInput, setTagsInput] = useState(
    formData.tag.map((tag) => tag.name).join(", "),
  );
  const [labelsInput, setLabelsInput] = useState(
    formData.label.map((label) => label.name).join(", "),
  );
  const [tagsFocused, setTagsFocused] = useState(false);
  const [labelsFocused, setLabelsFocused] = useState(false);

  const tagsError = validateField("tag");
  const labelsError = validateField("label");

  // Sync local state with formData when it changes
  useEffect(() => {
    setTagsInput(formData.tag.map((tag) => tag.name).join(", "));
    setLabelsInput(formData.label.map((label) => label.name).join(", "));
  }, [formData.tag, formData.label]);

  // Process input strings into arrays
  const processTagsAndLabels = useCallback(() => {
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .map((tag) => ({name: tag}));

    const labels = labelsInput
      .split(",")
      .map((label) => label.trim())
      .filter((label) => label.length > 0)
      .map((label) => ({name: label}));

    updateFormData({tag: tags, label: labels});
  }, [tagsInput, labelsInput, updateFormData]);

  // Handle focus events
  const handleTagsFocus = () => {
    setTagsFocused(true);
  };

  const handleLabelsFocus = () => {
    setLabelsFocused(true);
  };

  // Auto-process when input changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      processTagsAndLabels();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [processTagsAndLabels]);

  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Add tags and labels to your course
        </h2>
        <p className="text-lg text-gray-600">
          Tags and labels help students find your course. You can add them now
          or later.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Tags Section */}
        <div className="text-left">
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tags <span className="text-red-500">*</span>
          </label>
          <Input
            id="tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onFocus={handleTagsFocus}
            placeholder="e.g: JavaScript, React, Web Development, Programming (separated by commas)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            autoComplete="off"
          />
          {tagsFocused && tagsError && (
            <p className="text-red-500 text-sm mt-1">{tagsError}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Add at least one tag to help students discover your course
          </p>
        </div>

        {/* Labels Section */}
        <div className="text-left">
          <label
            htmlFor="labels"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Labels <span className="text-red-500">*</span>
          </label>
          <Input
            id="labels"
            value={labelsInput}
            onChange={(e) => setLabelsInput(e.target.value)}
            onFocus={handleLabelsFocus}
            placeholder="e.g: Beginner, Intermediate, Advanced, Professional (separated by commas)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:border-gray-300"
            autoComplete="off"
          />
          {labelsFocused && labelsError && (
            <p className="text-red-500 text-sm mt-1">{labelsError}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Add at least one label to categorize your course level or type
          </p>
        </div>
      </div>
    </div>
  );
}
