import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import type {Item} from "../../../types/index.ts";
import {Loader2, PlusCircle, Search} from "lucide-react";
import {Heading3} from "@/components/Typography";
import Input from "@/components/Input.tsx";
import Button from "@/components/Button.tsx";
import Select from "@/components/Select.tsx";
import ItemDisplay from "@/components/Item.tsx";
import DeleteModal from "@/components/DeleteModal.tsx";
import useCourseHook from "@/hooks/useCourse";
export default function InstructorBatch() {
  const navigate = useNavigate();
  const {
    state: courseState,
    getMyBatches,
    deleteBatch,
    clearError,
  } = useCourseHook();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [batchs, setBatches] = useState<Item[]>([]);
  const [currentPage] = useState(0);
  const [pageSize] = useState(10);
  const [deleteState, setDeleteState] = useState<{
    open: boolean;
    batch: Item | null;
  }>({open: false, batch: null});

  const fetchBatchs = async () => {
    try {
      const batchesData = await getMyBatches(currentPage, pageSize);
      const transformBatches: Item[] = batchesData.map((batch) => ({
        id: batch.id,
        title: batch.title,
        type: "batch",
        status: batch.status === "PUBLISHED" ? "Published" : "Draft",
      }));
      setBatches(transformBatches);
    } catch {
      // Error
    }
  };
  useEffect(() => {
    fetchBatchs();
  }, [getMyBatches, currentPage, pageSize]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleCreateBatch = () => {
    navigate("/instructor/batch/create");
  };

  const handleEditBatch = (batch: Item) => {
    navigate(`/instructor/batch/${batch.id}/edit`);
  };

  const handleDeleteBatch = (batch: Item) => {
    setDeleteState({open: true, batch});
  };

  const handleConfirmDelete = async () => {
    if (!deleteState.batch) return;
    try {
      const success = await deleteBatch(deleteState.batch.id);
      if (success) {
        setDeleteState({open: false, batch: null});
        await fetchBatchs();
      }
    } catch {
      // Error
    }
  };
  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const displayBatches = () => {
    const keyword = searchTerm.trim().toLocaleLowerCase();
    const filtered = keyword
      ? batchs
      : batchs.filter((c) => c.title.toLowerCase().includes(keyword));
    switch (sortBy) {
      case "a-z":
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      case "z-a":
        return [...filtered].sort((a, b) => b.title.localeCompare(a.title));
      // "newest" | "oldest" giữ nguyên thứ tự từ API do thiếu metadata thời gian
      default:
        return filtered;
    }
  };

  return (
    <div className="w-full h-full container mx-auto flex flex-col gap-6">
      {/* Error display */}
      {courseState.error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{courseState.error}</p>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 text-sm mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Page header */}
      <div className="flex flex-col gap-3 justify-between">
        <div className="flex justify-between items-center w-full">
          <Heading3>Batches</Heading3>
          {courseState.isLoading && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Search your batch"
              size="md"
              className="w-64"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <Button
              variant="secondary"
              leftIcon={<Search size={16} />}
              onClick={handleSearch}
            >
              Search
            </Button>

            <Select
              size="md"
              className="w-40"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              options={[
                {value: "newest", label: "Newest"},
                {value: "oldest", label: "Oldest"},
                {value: "a-z", label: "A-Z"},
                {value: "z-a", label: "Z-A"},
              ]}
            />
          </div>

          <Button
            leftIcon={<PlusCircle size={18} />}
            size="md"
            onClick={handleCreateBatch}
            disabled={courseState.isLoading}
          >
            New batch
          </Button>
        </div>
      </div>

      {/* Course list */}
      <div className="space-y-4">
        {courseState.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 size={24} className="animate-spin" />
              <span>Loading courses...</span>
            </div>
          </div>
        ) : displayBatches().length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No batches found</p>
            <Button onClick={handleCreateBatch}>
              Create your first batch ?
            </Button>
          </div>
        ) : (
          displayBatches().map((batch) => (
            <ItemDisplay
              key={batch.id}
              item={batch}
              onEdit={handleEditBatch}
              onDelete={handleDeleteBatch}
            />
          ))
        )}
      </div>

      <DeleteModal
        open={deleteState.open}
        title="Delete course"
        message={
          deleteState.batch
            ? `Are you sure you want to delete "${deleteState.batch.title}"?`
            : "Are you sure you want to delete this batch?"
        }
        onClose={() => setDeleteState({open: false, batch: null})}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
