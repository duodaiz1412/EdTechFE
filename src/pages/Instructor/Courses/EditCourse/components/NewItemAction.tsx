import Button from "@/components/Button";
import {FileText} from "lucide-react";
import {useState} from "react";
import CreateLessonModal from "@/components/CreateLessonModal";

interface NewItemActionProps {
  chapterId: string;
  onLessonCreated?: (lesson: any) => void;
}

export default function NewItemAction({
  chapterId,
  onLessonCreated,
}: NewItemActionProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateLesson = (lesson: any) => {
    // Call parent callback to update the curriculum list
    if (onLessonCreated) {
      onLessonCreated(lesson);
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
          {/* Quiz functionality will be implemented later */}
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
