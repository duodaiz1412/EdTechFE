import {useState, useEffect} from "react";
import {Plus, Eye} from "lucide-react";
import {useNavigate} from "react-router";
import Button from "@/components/Button";
import {Heading3} from "@/components/Typography";
import Input from "@/components/Input";
import ChapterList from "./ChapterList";
import {CourseItem} from "@/context/CourseContext";
import Modal from "@/components/Modal";
import DeleteModal from "@/components/DeleteModal";
import {useCourseContext} from "@/context/CourseContext";
import {toast} from "react-toastify";
import NewChapterForm from "./NewChapterForm";

export default function CurriculumContent() {
  const navigate = useNavigate();
  const {
    // Form data from context
    formData,
    updateFormData,

    // API State (from hook via context)
    state: courseState,
    createChapter,
    deleteChapter,
    deleteLesson,
    isLoading,
    error,
  } = useCourseContext();
  const {course} = courseState;

  // Local state for UI-specific data (form inputs, modals)
  const [showNewChapterForm, setShowNewChapterForm] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterSummary, setNewChapterSummary] = useState("");

  useEffect(() => {
    if (course && (formData.chapters?.length || 0) === 0) {
      // Validate and clean course chapters data
      const courseChapters = course.chapters || [];
      const validChapters = courseChapters.map((chapter: any) => ({
        ...chapter,
        lessons:
          chapter.lessons?.map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title || null,
            slug: lesson.slug || null,
            content: lesson.content || null,
            videoUrl: lesson.videoUrl || null,
            fileUrl: lesson.fileUrl || null,
            quizDto: lesson.quizDto || null,
            position: lesson.position || null,
          })) || [],
      }));

      updateFormData({
        chapters: validChapters,
      });
    }
  }, [course, formData.chapters?.length, updateFormData]);

  // Chapter functions
  const addChapter = async () => {
    if (!newChapterTitle.trim() || !course?.id) {
      toast.warning("Please enter a chapter title");
      return;
    }

    try {
      const chapterData = {
        title: newChapterTitle,
        summary: newChapterSummary,
      };

      const createdChapter = await createChapter(course.id, chapterData);

      if (createdChapter) {
        // Update local form data with chapter from API response
        const currentChapters = formData.chapters || [];
        const updatedChapters = [...currentChapters, createdChapter as any];
        updateFormData({
          chapters: updatedChapters,
        });

        toast.success("Chapter created successfully!");
        setNewChapterTitle("");
        setNewChapterSummary("");
        setShowNewChapterForm(false);
      } else {
        toast.error("Failed to create chapter");
      }
    } catch {
      toast.error("Error creating chapter");
    }
  };

  const updateChapter = (chapterId: string, title: string) => {
    const currentChapters = formData.chapters || [];
    updateFormData({
      chapters: currentChapters.map((chapter) =>
        chapter.id === chapterId ? {...chapter, title} : chapter,
      ),
    });
  };

  const removeChapter = (chapterId: string) => {
    const currentChapters = formData.chapters || [];
    updateFormData({
      chapters: currentChapters.filter((chapter) => chapter.id !== chapterId),
    });
  };

  const updateCourseItem = (
    chapterId: string,
    itemId: string,
    updates: Partial<CourseItem>,
  ) => {
    const currentChapters = formData.chapters || [];
    updateFormData({
      chapters: currentChapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              lessons: (chapter.lessons || []).map((item) =>
                item.id === itemId ? {...item, ...updates} : item,
              ),
            }
          : chapter,
      ),
    });
  };

  const removeCourseItem = (chapterId: string, itemId: string) => {
    const currentChapters = formData.chapters || [];
    updateFormData({
      chapters: currentChapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              lessons: (chapter.lessons || []).filter(
                (item) => item.id !== itemId,
              ),
            }
          : chapter,
      ),
    });
  };

  const handlePreview = () => {
    const courseSlug = course?.slug;
    const chapters = formData.chapters || [];
    const firstLessonWithSlug = chapters
      .flatMap((c: any) => c.lessons || [])
      .find((l: any) => !!l?.slug);

    if (!courseSlug) {
      toast.warning("Course slug is missing");
      return;
    }
    if (!firstLessonWithSlug?.slug) {
      toast.warning("No lesson to preview");
      return;
    }
    // Navigate to preview course page using the cloned components
    navigate(
      `/instructor/courses/${course?.id}/preview/lesson/${firstLessonWithSlug.slug}`,
    );
  };

  const handleLessonCreated = (lesson: any, chapterId?: string) => {
    // Add the new lesson to the specified chapter
    const currentChapters = formData.chapters || [];
    if (chapterId && lesson) {
      updateFormData({
        chapters: currentChapters.map((chapter) =>
          chapter.id === chapterId
            ? {...chapter, lessons: [...(chapter.lessons || []), lesson]}
            : chapter,
        ),
      });
    }
    toast.success("Lesson created successfully!");
  };

  const handleEditChapter = (chapterId: string) => {
    const currentChapters = formData.chapters || [];
    const chapter = currentChapters.find((c) => c.id === chapterId);
    if (!chapter) return;
    const newTitle = prompt("Edit chapter title:", chapter.title);
    if (newTitle?.trim()) {
      updateChapter(chapterId, newTitle);
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    const currentChapters = formData.chapters || [];
    const chapter = currentChapters.find((c) => c.id === chapterId);
    if (!chapter) return;
    setDeleteState({
      open: true,
      type: "chapter",
      chapterId,
      itemId: null,
      title: chapter.title,
    });
  };

  // Modals for editing/deleting items
  const [editItemState, setEditItemState] = useState<{
    open: boolean;
    chapterId: string | null;
    itemId: string | null;
    title: string;
  }>({open: false, chapterId: null, itemId: null, title: ""});
  const [deleteState, setDeleteState] = useState<{
    open: boolean;
    type: "chapter" | "lesson" | null;
    chapterId: string | null;
    itemId: string | null;
    title: string;
  }>({open: false, type: null, chapterId: null, itemId: null, title: ""});

  const handleDeleteItem = (chapterId: string, itemId: string) => {
    const currentChapters = formData.chapters || [];
    const chapter = currentChapters.find((c) => c.id === chapterId);
    const item = chapter?.lessons?.find((i) => i.id === itemId);
    if (!item) return;
    setDeleteState({
      open: true,
      type: "lesson",
      chapterId,
      itemId,
      title: item.title || "Untitled",
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteState.chapterId) return;

    try {
      if (deleteState.type === "chapter") {
        const success = await deleteChapter(deleteState.chapterId);

        if (success) {
          // Remove from local state
          removeChapter(deleteState.chapterId);
          toast.success("Chapter deleted successfully!");
        } else {
          toast.error("Failed to delete chapter");
        }
      } else if (deleteState.type === "lesson" && deleteState.itemId) {
        const success = await deleteLesson(deleteState.itemId);

        if (success) {
          // Remove from local state
          removeCourseItem(deleteState.chapterId, deleteState.itemId);
          toast.success("Lesson deleted successfully!");
        } else {
          toast.error("Failed to delete lesson");
        }
      }
    } catch {
      const itemType = deleteState.type === "chapter" ? "chapter" : "lesson";
      toast.error(`Error deleting ${itemType}`);
    } finally {
      setDeleteState({
        open: false,
        type: null,
        chapterId: null,
        itemId: null,
        title: "",
      });
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
        <Heading3>Curriculum</Heading3>
        <Button
          variant="secondary"
          leftIcon={<Eye size={16} />}
          className="bg-gray-800 text-white hover:bg-gray-700"
          onClick={handlePreview}
        >
          Preview
        </Button>
      </div>

      <div className="space-y-6">
        <ChapterList
          chapters={formData.chapters || []}
          onEditChapter={handleEditChapter}
          onDeleteChapter={handleDeleteChapter}
          onDeleteItem={handleDeleteItem}
          onLessonCreated={handleLessonCreated}
        />

        {!showNewChapterForm ? (
          <Button
            variant="secondary"
            leftIcon={<Plus size={16} />}
            onClick={() => setShowNewChapterForm(true)}
            className="w-full border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400"
          >
            Add new chapter
          </Button>
        ) : (
          <NewChapterForm
            title={newChapterTitle}
            summary={newChapterSummary}
            isLoading={isLoading}
            onTitleChange={setNewChapterTitle}
            onSummaryChange={setNewChapterSummary}
            onSubmit={addChapter}
            onCancel={() => {
              setShowNewChapterForm(false);
              setNewChapterTitle("");
              setNewChapterSummary("");
            }}
          />
        )}
      </div>

      {/* Edit Item Modal */}
      <Modal
        open={editItemState.open}
        onClose={() => setEditItemState((prev) => ({...prev, open: false}))}
        title="Edit item title"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                setEditItemState((prev) => ({...prev, open: false}))
              }
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (
                  editItemState.chapterId == null ||
                  editItemState.itemId == null
                )
                  return;
                const newTitle = editItemState.title.trim();
                if (!newTitle) return;
                updateCourseItem(
                  editItemState.chapterId,
                  editItemState.itemId,
                  {title: newTitle},
                );
                setEditItemState({
                  open: false,
                  chapterId: null,
                  itemId: null,
                  title: "",
                });
              }}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </Button>
          </div>
        }
      >
        <Input
          value={editItemState.title}
          onChange={(e) =>
            setEditItemState((prev) => ({...prev, title: e.target.value}))
          }
          placeholder="Enter item title"
          className="w-full"
        />
      </Modal>

      {/* Delete Modal */}
      <DeleteModal
        open={deleteState.open}
        title={`Delete ${deleteState.type}`}
        message={
          deleteState.type === "chapter"
            ? `Are you sure you want to delete "${deleteState.title}"? This will also delete all lessons in this chapter. This action cannot be undone.`
            : `Are you sure you want to delete "${deleteState.title}"? This action cannot be undone.`
        }
        onClose={() => setDeleteState((prev) => ({...prev, open: false}))}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
