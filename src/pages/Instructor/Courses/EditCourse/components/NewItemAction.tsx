import Button from "@/components/Button";
import {HelpCircle, FileText} from "lucide-react";
import {useState} from "react";
import CreateLessonModal from "@/components/CreateLessonModal";

interface NewItemActionProps {
  chapterId: string;
  onAddItem: (chapterId: string) => void;
  onLessonCreated?: (lessonId: string) => void;
}

export default function NewItemAction({
  chapterId,
  onAddItem,
  onLessonCreated,
}: NewItemActionProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateLesson = (lessonId: string) => {
    // Call parent callback to update the curriculum list
    if (onLessonCreated) {
      onLessonCreated(lessonId);
    }
    setShowCreateModal(false);
  };

  return (
    <>
      <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-sm text-gray-600 mb-3">Add new item:</p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
          >
            <span className="inline-flex items-center gap-2">
              <FileText size={16} /> Lecture
            </span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-blue-50 text-blue-700"
            onClick={() => onAddItem(chapterId)}
          >
            <span className="inline-flex items-center gap-2">
              <HelpCircle size={16} /> Quiz
            </span>
          </Button>
        </div>
      </div>

      <CreateLessonModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        chapterId={chapterId}
        onSuccess={handleCreateLesson}
      />
    </>
  );
}
