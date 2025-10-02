import {useState} from "react";
import {Plus, Eye} from "lucide-react";
import Button from "@/components/Button";
import {Heading3} from "@/components/Typography";
import Input from "@/components/Input";
import ChapterList, {Chapter} from "./ChapterList";
import {CourseItem} from "./ChapterItem";
import Modal from "@/components/Modal";
import DeleteModal from "@/components/DeleteModal";

// Types are imported from ChapterList/ChapterItem

export default function CurriculumContent() {
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: 1,
      title: "Chapter name",
      items: [
        {id: 1, type: "lecture", title: "Lecture name", status: "published"},
        {id: 2, type: "quiz", title: "Quiz name", status: "draft"},
        {id: 3, type: "assignment", title: "Assignment name", status: "draft"},
        {id: 4, type: "coding", title: "Name", status: "draft"},
      ],
    },
  ]);

  const [showNewChapterForm, setShowNewChapterForm] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterSummary, setNewChapterSummary] = useState("");

  // Chapter functions
  const addChapter = () => {
    if (newChapterTitle.trim()) {
      const nextId = chapters.length
        ? Math.max(...chapters.map((c) => c.id)) + 1
        : 1;
      const newChapter: Chapter = {
        id: nextId,
        title: newChapterTitle,
        summary: newChapterSummary,
        items: [],
      };
      setChapters((prev) => [...prev, newChapter]);
      setNewChapterTitle("");
      setNewChapterSummary("");
      setShowNewChapterForm(false);
    }
  };

  const updateChapter = (chapterId: number, title: string) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId ? {...chapter, title} : chapter,
      ),
    );
  };

  const removeChapter = (chapterId: number) => {
    setChapters((prev) => prev.filter((chapter) => chapter.id !== chapterId));
  };

  // Course item functions
  const addCourseItem = (
    chapterId: number,
    type: CourseItem["type"],
    title: string,
  ) => {
    const newItem: CourseItem = {
      id: Date.now(),
      type,
      title,
      status: "draft",
    };
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId
          ? {...chapter, items: [...chapter.items, newItem]}
          : chapter,
      ),
    );
  };

  const updateCourseItem = (
    chapterId: number,
    itemId: number,
    updates: Partial<CourseItem>,
  ) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              items: chapter.items.map((item) =>
                item.id === itemId ? {...item, ...updates} : item,
              ),
            }
          : chapter,
      ),
    );
  };

  const removeCourseItem = (chapterId: number, itemId: number) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              items: chapter.items.filter((item) => item.id !== itemId),
            }
          : chapter,
      ),
    );
  };

  const handleAddItem = (chapterId: number, type: CourseItem["type"]) => {
    const title = prompt(`Enter ${type} title:`);
    if (title?.trim()) {
      addCourseItem(chapterId, type, title);
    }
  };

  const handleEditChapter = (chapterId: number) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter) return;
    const newTitle = prompt("Edit chapter title:", chapter.title);
    if (newTitle?.trim()) {
      updateChapter(chapterId, newTitle);
    }
  };

  const handleDeleteChapter = (chapterId: number) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter) return;
    if (
      confirm(`Are you sure you want to delete chapter "${chapter.title}"?`)
    ) {
      removeChapter(chapterId);
    }
  };

  // Modals for editing/deleting items
  const [editItemState, setEditItemState] = useState<{
    open: boolean;
    chapterId: number | null;
    itemId: number | null;
    title: string;
  }>({open: false, chapterId: null, itemId: null, title: ""});
  const [deleteItemState, setDeleteItemState] = useState<{
    open: boolean;
    chapterId: number | null;
    itemId: number | null;
    title: string;
  }>({open: false, chapterId: null, itemId: null, title: ""});

  const handleEditItem = (chapterId: number, itemId: number) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    const item = chapter?.items.find((i) => i.id === itemId);
    if (!item) return;
    setEditItemState({open: true, chapterId, itemId, title: item.title});
  };

  const handleDeleteItem = (chapterId: number, itemId: number) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    const item = chapter?.items.find((i) => i.id === itemId);
    if (!item) return;
    setDeleteItemState({open: true, chapterId, itemId, title: item.title});
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <Heading3>Curriculum</Heading3>
        <Button
          variant="secondary"
          leftIcon={<Eye size={16} />}
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          Preview
        </Button>
      </div>

      <div className="space-y-6">
        <ChapterList
          chapters={chapters}
          onEditChapter={handleEditChapter}
          onDeleteChapter={handleDeleteChapter}
          onAddItem={handleAddItem}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
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
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New chapter:
                </label>
                <Input
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="Chapter name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chapter summary/goal:
                </label>
                <textarea
                  value={newChapterSummary}
                  onChange={(e) => setNewChapterSummary(e.target.value)}
                  placeholder="Enter chapter summary or goal..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowNewChapterForm(false);
                    setNewChapterTitle("");
                    setNewChapterSummary("");
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addChapter}
                  disabled={!newChapterTitle.trim()}
                  className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add chapter
                </Button>
              </div>
            </div>
          </div>
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

      {/* Delete Item Modal */}
      <DeleteModal
        open={deleteItemState.open}
        title="Delete item"
        message={`Are you sure you want to delete "${deleteItemState.title}"?`}
        onClose={() => setDeleteItemState((prev) => ({...prev, open: false}))}
        onConfirm={() => {
          if (
            deleteItemState.chapterId == null ||
            deleteItemState.itemId == null
          )
            return;
          removeCourseItem(deleteItemState.chapterId, deleteItemState.itemId);
          setDeleteItemState({
            open: false,
            chapterId: null,
            itemId: null,
            title: "",
          });
        }}
      />
    </div>
  );
}
