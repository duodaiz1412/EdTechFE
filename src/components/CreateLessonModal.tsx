import {useState} from "react";
import Button from "@/components/Button";
import useCourse from "@/hooks/useCourse";
import {toast} from "react-toastify";

interface CreateLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterId: string;
  onSuccess: (lessonId: string) => void;
}

export default function CreateLessonModal({
  isOpen,
  onClose,
  chapterId,
  onSuccess,
}: CreateLessonModalProps) {
  const {
    createLesson,
    state: {isSubmitting},
  } = useCourse();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateLesson = async () => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const lessonId = await createLesson(chapterId);

      if (lessonId) {
        toast.success("Lesson created successfully!");
        onSuccess(lessonId);
        onClose();
      } else {
        toast.error("Failed to create lesson");
      }
    } catch {
      toast.error("Error creating lesson");
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Create New Lesson
        </h3>

        <p className="text-gray-600 mb-6">
          This will create an empty lesson that you can edit later. You can add
          content, video, and other materials after creation.
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isCreating || isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateLesson}
            disabled={isCreating || isSubmitting}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {isCreating || isSubmitting ? "Creating..." : "Create Lesson"}
          </Button>
        </div>
      </div>
    </div>
  );
}
