import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";

export interface Task {
  id: string;
  type: "video_transcoding" | "note_creation" | "content_generation";
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  metadata: {
    lessonId?: string;
    courseId?: string;
    entityId?: string;
    entityType?: string;
    [key: string]: any;
  };
  createdAt: number;
  updatedAt: number;
  retryCount: number;
  maxRetries: number;
}

interface TaskStore {
  // State
  tasks: Task[];
  isPolling: boolean;
  currentPollingTask: string | null;

  // Actions
  addTask: (task: Omit<Task, "createdAt" | "updatedAt" | "retryCount">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  getTask: (id: string) => Task | undefined;
  clearCompleted: () => void;

  // Polling management
  startPolling: (taskId: string) => void;
  stopPolling: () => void;
  setPollingState: (isPolling: boolean, taskId?: string) => void;

  // Getters
  getTasksByType: (type: Task["type"]) => Task[];
  getProcessingTasks: () => Task[];
  getTaskByEntityId: (entityId: string) => Task | undefined;
  isTaskProcessing: (id: string) => boolean;

  // Bulk operations
  updateTasksFromJobs: (jobs: any[]) => void;
  cleanupOldTasks: (maxAge: number) => void;
  clearAllTasks: () => void;
}

const DEFAULT_MAX_RETRIES = 50;
const DEFAULT_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      // Initial state
      tasks: [],
      isPolling: false,
      currentPollingTask: null,

      // Add new task
      addTask: (task) => {
        const newTask: Task = {
          ...task,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          retryCount: 0,
          maxRetries: task.maxRetries || DEFAULT_MAX_RETRIES,
        };

        set((state) => {
          // Avoid duplicates
          if (state.tasks.some((t) => t.id === task.id)) {
            return state;
          }
          return {tasks: [...state.tasks, newTask]};
        });
      },

      // Update existing task
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {...task, ...updates, updatedAt: Date.now()}
              : task,
          ),
        }));
      },

      // Remove task
      removeTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      // Get specific task
      getTask: (id) => {
        return get().tasks.find((task) => task.id === id);
      },

      // Clear completed tasks
      clearCompleted: () => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.status !== "completed"),
        }));
      },

      // Start polling for a task
      startPolling: (taskId) => {
        set({isPolling: true, currentPollingTask: taskId});
      },

      // Stop polling
      stopPolling: () => {
        set({isPolling: false, currentPollingTask: null});
      },

      // Set polling state
      setPollingState: (isPolling, taskId) => {
        set({
          isPolling,
          currentPollingTask: isPolling ? taskId || null : null,
        });
      },

      // Get tasks by type
      getTasksByType: (type) => {
        return get().tasks.filter((task) => task.type === type);
      },

      // Get processing tasks
      getProcessingTasks: () => {
        return get().tasks.filter((task) =>
          ["pending", "processing"].includes(task.status),
        );
      },

      // Get task by entity ID
      getTaskByEntityId: (entityId) => {
        return get().tasks.find(
          (task) =>
            task.metadata.entityId === entityId ||
            task.metadata.lessonId === entityId,
        );
      },

      // Check if task is processing
      isTaskProcessing: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        return task ? ["pending", "processing"].includes(task.status) : false;
      },

      // Update tasks from API jobs
      updateTasksFromJobs: (jobs: any[]) => {
        set((state) => {
          const updatedTasks = state.tasks.map((task) => {
            const job = jobs.find((j) => j.id === task.id);
            if (job) {
              // Map backend status to frontend status
              let mappedStatus: Task["status"];
              switch (job.status.toUpperCase()) {
                case "COMPLETED":
                  mappedStatus = "completed";
                  break;
                case "FAILED":
                  mappedStatus = "failed";
                  break;
                case "PROCESSING":
                case "PENDING":
                case "RUNNING": // Handle RUNNING as PROCESSING
                  mappedStatus = "processing";
                  break;
                default:
                  // Keep current status if unknown
                  mappedStatus = task.status;
              }

              return {
                ...task,
                status: mappedStatus,
                progress: job.progress || task.progress,
                updatedAt: Date.now(),
              };
            }
            return task;
          });
          return {tasks: updatedTasks};
        });
      },

      // Cleanup old tasks
      cleanupOldTasks: (maxAge = DEFAULT_MAX_AGE) => {
        const cutoff = Date.now() - maxAge;
        set((state) => ({
          tasks: state.tasks.filter(
            (task) =>
              task.createdAt > cutoff ||
              ["pending", "processing"].includes(task.status),
          ),
        }));
      },

      // Clear all tasks (useful for debugging)
      clearAllTasks: () => {
        set({tasks: [], isPolling: false, currentPollingTask: null});
      },
    }),
    {
      name: "etech-task-store",
      storage: createJSONStorage(() => localStorage),
      // Only persist essential data, exclude polling state
      partialize: (state) => ({
        tasks: state.tasks,
        // Don't persist polling state
      }),
      // Version for migrations
      version: 1,
    },
  ),
);

// Selectors for better performance
export const useTaskSelectors = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const isPolling = useTaskStore((state) => state.isPolling);
  const currentPollingTask = useTaskStore((state) => state.currentPollingTask);

  const getTask = useTaskStore((state) => state.getTask);
  const getTasksByType = useTaskStore((state) => state.getTasksByType);
  const getProcessingTasks = useTaskStore((state) => state.getProcessingTasks);
  const getTaskByEntityId = useTaskStore((state) => state.getTaskByEntityId);
  const isTaskProcessing = useTaskStore((state) => state.isTaskProcessing);

  return {
    tasks,
    isPolling,
    currentPollingTask,
    getTask,
    getTasksByType,
    getProcessingTasks,
    getTaskByEntityId,
    isTaskProcessing,
  };
};

// Actions hook
export const useTaskActions = () => {
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const removeTask = useTaskStore((state) => state.removeTask);
  const clearCompleted = useTaskStore((state) => state.clearCompleted);
  const startPolling = useTaskStore((state) => state.startPolling);
  const stopPolling = useTaskStore((state) => state.stopPolling);
  const setPollingState = useTaskStore((state) => state.setPollingState);
  const updateTasksFromJobs = useTaskStore(
    (state) => state.updateTasksFromJobs,
  );
  const cleanupOldTasks = useTaskStore((state) => state.cleanupOldTasks);
  const clearAllTasks = useTaskStore((state) => state.clearAllTasks);

  return {
    addTask,
    updateTask,
    removeTask,
    clearCompleted,
    startPolling,
    stopPolling,
    setPollingState,
    updateTasksFromJobs,
    cleanupOldTasks,
    clearAllTasks,
  };
};

export default useTaskStore;
