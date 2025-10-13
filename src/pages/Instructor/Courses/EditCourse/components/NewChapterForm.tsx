import Button from "@/components/Button";
import Input from "@/components/Input";

interface NewChapterFormProps {
  title: string;
  summary: string;
  isLoading: boolean;
  onTitleChange: (title: string) => void;
  onSummaryChange: (summary: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function NewChapterForm({
  title,
  summary,
  isLoading,
  onTitleChange,
  onSummaryChange,
  onSubmit,
  onCancel,
}: NewChapterFormProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New chapter:
          </label>
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Chapter name"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chapter summary/goal:
          </label>
          <textarea
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            placeholder="Enter chapter summary or goal..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!title.trim() || isLoading}
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Add chapter"}
          </Button>
        </div>
      </div>
    </div>
  );
}
