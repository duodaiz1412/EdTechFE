import React, {useState, useEffect, useCallback, useMemo} from "react";
import {useSelector} from "react-redux";
import {X} from "lucide-react";
import Input from "./Input";
import {instructorServices} from "../lib/services/instructor.services";
// Assuming User type is exported from types/index.ts and has id, fullName, and email
import {User} from "../types";
import Button from "./Button";
import Chip from "./Chip";
import {toast} from "react-toastify";
import {RootState} from "@/lib/redux/store";
import {getAccessToken} from "@/lib/utils/getAccessToken";

interface AddInstructorsProps {
  typeAdd: "course" | "batch";
  dataId: string; // courseId or batchId
  currentInstructors: User[]; // Instructors already assigned
  onAddSuccess: () => void;
}

const AddInstructor: React.FC<AddInstructorsProps> = ({
  // Unused props typeAdd is removed for brevity if not used in logic
  dataId,
  currentInstructors,
  onAddSuccess,
}) => {
  // Get the current user from the Redux store
  const {data: currentUser} = useSelector((state: RootState) => state.user);
  // 1. ADDED: State for search term
  const [searchTerm, setSearchTerm] = useState("");
  // 2. RENAMED: from fetchUsers to allInstructors for clarity
  const [allInstructors, setAllInstructors] = useState<User[]>([]);
  const [selectedInstructors, setSelectedInstructors] = useState<User[]>([]);
  const [existingInstructors, setExistingInstructors] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(true); // RENAMED and initialized to true
  const [error, setError] = useState<string | null>(null);

  // Set existing instructors from props when component mounts or props change
  useEffect(() => {
    setExistingInstructors(currentInstructors);
  }, [currentInstructors]);

  // Helper function to fetch all instructors
  const getListInstructors = useCallback(async (): Promise<User[]> => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error("No access token found");
    }
    // Assuming response.data is User[]
    const response = await instructorServices.getAllInstructors(accessToken);
    return response.data;
  }, []);

  // Fetch all instructors on initial mount
  useEffect(() => {
    const fetchUsersData = async () => {
      setIsFetchingUsers(true);
      try {
        const users = await getListInstructors();
        setAllInstructors(users);
      } catch (err) {
        setError("Failed to load available instructors." + err);
      } finally {
        setIsFetchingUsers(false);
      }
    };

    fetchUsersData();
  }, [getListInstructors]); // Run only on mount

  // Handle search input change (now uses useCallback correctly)
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    [], // No dependencies needed
  );

  // 3. ADDED: Filtering logic (useMemo for performance)
  const availableInstructors = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    // 1. Filter by search term (name or email)
    const filteredBySearch = allInstructors.filter((instructor) => {
      if (!lowerSearchTerm) return true; // Show all if search is empty

      const matchesName = instructor.fullName
        ? instructor.fullName.toLowerCase().includes(lowerSearchTerm)
        : false;

      const matchesEmail = instructor.email
        ? instructor.email.toLowerCase().includes(lowerSearchTerm)
        : false;

      return matchesName || matchesEmail;
    });

    // 2. Filter out instructors already assigned (existingInstructors)
    const filteredByExisting = filteredBySearch.filter(
      (instructor) =>
        !existingInstructors.some((existing) => existing.id === instructor.id),
    );

    // 3. Filter out the currently logged-in user if they are an instructor
    const finalFiltered = filteredByExisting.filter(
      (instructor) => instructor.id !== currentUser?.id,
    );

    return finalFiltered;
  }, [allInstructors, existingInstructors, searchTerm, currentUser]);

  const handleSelectInstructor = (instructor: User) => {
    setSelectedInstructors((prev) => {
      if (prev.some((inst) => inst.id === instructor.id)) {
        return prev.filter((inst) => inst.id !== instructor.id);
      }
      return [...prev, instructor];
    });
  };

  const handleRemoveExistingInstructor = (instructorToRemove: User) => {
    // Business rule: prevent removing the current user if they are an instructor
    if (instructorToRemove.id === currentUser?.id) {
      toast.warn("You cannot remove yourself as an instructor.");
      return;
    }
    setExistingInstructors((prev) =>
      prev.filter((inst) => inst.id !== instructorToRemove.id),
    );
  };
  const handleAddInstructors = async () => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare the final list of instructor IDs for the upsert operation
      const existingInstructorIds = existingInstructors.map((inst) => inst.id);
      const newInstructorIds = selectedInstructors.map((inst) => inst.id);

      // Combine existing, new, and the current user's ID, ensuring no duplicates.
      const finalInstructorIds = [
        ...new Set([
          ...existingInstructorIds,
          ...newInstructorIds,
          currentUser?.id,
        ]),
      ].filter((id): id is string => !!id); // Filter out any potential null/undefined IDs

      // Ensure instructorServices.upsertInstructorToCourse is awaited
      await instructorServices.upsertInstructorToCourse(
        dataId,
        finalInstructorIds,
        accessToken,
      );

      toast.success("Instructors updated successfully!");
      setSelectedInstructors([]); // Clear selections on success
      onAddSuccess(); // Trigger parent component to refetch and update
    } catch (err) {
      setError("Failed to add instructors. Please try again." + err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear local error state when showing a toast instead
  // This is a good practice if you switch to toasts
  useEffect(() => {
    if (error) setError(null);
  }, [error]);

  const hasChanges = useMemo(() => {
    const initialIds = new Set(currentInstructors.map((i) => i.id));
    const currentIds = new Set(existingInstructors.map((i) => i.id));

    // A change is: a new instructor is selected, or an existing one was removed.
    return (
      selectedInstructors.length > 0 ||
      initialIds.size !== currentIds.size ||
      !currentInstructors.every((inst) => currentIds.has(inst.id))
    );
  }, [currentInstructors, existingInstructors, selectedInstructors]);

  return (
    <div className="space-y-8 border-t border-gray-200 pt-8 mt-8">
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-gray-900">
          Update Instructors
        </h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Instructors
          </label>
          <div className="flex flex-wrap gap-2">
            {existingInstructors.length > 0 ? (
              existingInstructors.map((instructor) => (
                <Chip
                  key={instructor.id}
                  variant="default"
                  className="bg-gray-800 text-white border-gray-800"
                >
                  <div className="flex items-center gap-2">
                    {instructor.fullName}
                    <button
                      onClick={() => handleRemoveExistingInstructor(instructor)}
                      className="ml-1 hover:text-gray-300"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </Chip>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No instructors assigned yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* The error state is now handled by toasts, but this can be kept for non-blocking errors if needed */}

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Find and Add Instructors
        </label>
        <Input
          type="text"
          placeholder="Search instructors by email or name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full md:w-1/2"
        />

        <div className="max-h-60 overflow-y-auto border rounded p-2 space-y-1">
          {isFetchingUsers ? (
            <div className="p-2 text-gray-500">
              Loading available instructors...
            </div>
          ) : availableInstructors.length === 0 ? (
            <div className="p-2 text-gray-500">
              {searchTerm
                ? "No instructors match your search."
                : "No new instructors available."}
            </div>
          ) : (
            availableInstructors.map((instructor) => (
              <div
                key={instructor.id}
                className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => handleSelectInstructor(instructor)}
              >
                <span>
                  {instructor.fullName} ({instructor.email})
                </span>
                <input
                  type="checkbox"
                  readOnly
                  checked={selectedInstructors.some(
                    (inst) => inst.id === instructor.id,
                  )}
                  className="form-checkbox h-4 w-4 text-gray-800 rounded"
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Newly Selected
        </label>
        {selectedInstructors.length === 0 ? (
          <p className="text-sm text-gray-500">No instructors selected.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedInstructors.map((instructor) => (
              <Chip
                key={instructor.id}
                variant="default"
                className="bg-gray-800 text-white border-gray-800"
              >
                <div className="flex items-center gap-2">
                  {instructor.fullName}
                  <button
                    onClick={() => handleSelectInstructor(instructor)}
                    className="ml-1 hover:text-gray-300"
                  >
                    <X size={14} />
                  </button>
                </div>
              </Chip>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          onClick={handleAddInstructors}
          disabled={isLoading || !hasChanges}
          className="bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default AddInstructor;
