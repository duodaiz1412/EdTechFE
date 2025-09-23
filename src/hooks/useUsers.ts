import {useState, useEffect, useCallback} from "react";
import {userServices} from "../lib/services/user.services";
import type {User} from "../pages/Cms/UserManagement";

export interface UseUsersState {
  users: User[];
  filteredUsers: User[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  searchTerm: string;
}

export interface UseUsersActions {
  fetchUsers: (page?: number, size?: number) => Promise<void>;
  createUser: (userData: Omit<User, "id">) => Promise<void>;
  updateUser: (userId: string, userData: Omit<User, "id">) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  clearError: () => void;
  refreshUsers: () => Promise<void>;
}

export interface UseUsersReturn extends UseUsersState, UseUsersActions {}

/**
 * Custom hook for managing users
 * Handles state management, API calls, and data transformations
 */
export function useUsers(initialPageSize: number = 10): UseUsersReturn {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(initialPageSize);
  const [searchTerm, setSearchTerm] = useState("");

  // Computed values
  const filteredUsers = userServices.filterUsers(users, searchTerm);

  const fetchUsers = useCallback(
    async (page: number = currentPage, size: number = pageSize) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await userServices.getUsers({page, size});

        setUsers(data.content);
        setCurrentPage(data.pagination.number);
        setTotalPages(data.pagination.totalPages);
        setTotalElements(data.pagination.totalElements);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch users";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, pageSize],
  );

  /**
   * Create a new user
   */
  const createUser = useCallback(
    async (userData: Omit<User, "id">) => {
      setIsSubmitting(true);
      setError(null);

      try {
        // Option 1: Using object-based service (recommended)
        await userServices.createUser(userData);

        // Option 2: Using class-based service (legacy)
        // await UserService.createUser(userData);

        // Refresh users after creation
        await fetchUsers(currentPage, pageSize);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create user";
        setError(errorMessage);
        // Don't re-throw - error is handled via error state
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchUsers, currentPage, pageSize],
  );

  /**
   * Update an existing user
   */
  const updateUser = useCallback(
    async (userId: string, userData: Omit<User, "id">) => {
      setIsSubmitting(true);
      setError(null);

      try {
        // Option 1: Using object-based service (recommended)
        await userServices.updateUser(userId, userData);

        // Option 2: Using class-based service (legacy)
        // await UserService.updateUser(userId, userData);

        // Refresh users after update
        await fetchUsers(currentPage, pageSize);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update user";
        setError(errorMessage);
        // Don't re-throw - error is handled via error state
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchUsers, currentPage, pageSize],
  );

  /**
   * Delete a user
   */
  const deleteUser = useCallback(
    async (userId: string) => {
      setIsSubmitting(true);
      setError(null);

      try {
        await userServices.deleteUser(userId);

        await fetchUsers(currentPage, pageSize);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete user";
        setError(errorMessage);
        // Don't re-throw - error is handled via error state
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchUsers, currentPage, pageSize],
  );

  /**
   * Change current page and fetch data
   */
  const handleSetCurrentPage = useCallback(
    async (page: number) => {
      if (page >= 0 && page < totalPages && page !== currentPage) {
        await fetchUsers(page, pageSize);
      }
    },
    [fetchUsers, totalPages, currentPage, pageSize],
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refresh current page data
   */
  const refreshUsers = useCallback(async () => {
    await fetchUsers(currentPage, pageSize);
  }, [fetchUsers, currentPage, pageSize]);

  // Load users on mount
  useEffect(() => {
    fetchUsers(0, pageSize);
  }, [pageSize]); // Only run on mount and when pageSize changes

  return {
    // State
    users,
    filteredUsers,
    isLoading,
    isSubmitting,
    error,
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    searchTerm,

    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    setSearchTerm,
    setCurrentPage: handleSetCurrentPage,
    clearError,
    refreshUsers,
  };
}

export default useUsers;
