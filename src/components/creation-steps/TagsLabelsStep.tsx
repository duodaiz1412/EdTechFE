import {useState, useEffect, useCallback} from "react";
import Input from "@/components/Input";
import {Tag, Label} from "@/types";
interface TagsLabelsStepProps {
  type: "course" | "batch";
  tags: Tag[];
  labels: Label[];
  onTagsChange: (tags: {name: string}[]) => void;
  onLabelsChange: (labels: {name: string}[]) => void;
  tagsError?: string | null;
  labelsError?: string | null;
}

export default function TagsLabelsStep({
  type,
  tags,
  labels,
  onTagsChange,
  onLabelsChange,
  tagsError,
  labelsError,
}: TagsLabelsStepProps) {
  const [tagsInput, setTagsInput] = useState(
    tags.map((tag) => tag.name).join(", "),
  );
  const [labelsInput, setLabelsInput] = useState(
    labels.map((label) => label.name).join(", "),
  );
  const [tagsFocused, setTagsFocused] = useState(false);
  const [labelsFocused, setLabelsFocused] = useState(false);

  useEffect(() => {
    setTagsInput(tags.map((tag) => tag.name).join(", "));
  }, [tags]);

  useEffect(() => {
    setLabelsInput(labels.map((label) => label.name).join(", "));
  }, [labels]);

  const processInputs = useCallback(() => {
    const newTags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .map((tag) => ({name: tag}));
    onTagsChange(newTags);

    const newLabels = labelsInput
      .split(",")
      .map((label) => label.trim())
      .filter((label) => label.length > 0)
      .map((label) => ({name: label}));
    onLabelsChange(newLabels);
  }, [tagsInput, labelsInput, onTagsChange, onLabelsChange]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      processInputs();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [tagsInput, labelsInput, processInputs]);

  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Add tags and labels to your {type}
        </h2>
        <p className="text-lg text-gray-600">
          Tags and labels help students find your {type}. You can add them now
          or later.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
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
            onFocus={() => setTagsFocused(true)}
            placeholder="e.g: JavaScript, React, Web Development (separated by commas)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            autoComplete="off"
          />
          {tagsFocused && tagsError && (
            <p className="text-red-500 text-sm mt-1">{tagsError}</p>
          )}
        </div>

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
            onFocus={() => setLabelsFocused(true)}
            placeholder="e.g: Beginner, Intermediate, Advanced (separated by commas)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            autoComplete="off"
          />
          {labelsFocused && labelsError && (
            <p className="text-red-500 text-sm mt-1">{labelsError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
