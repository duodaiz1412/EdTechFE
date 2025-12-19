/**
 * Utility functions to clear task store localStorage
 * Useful for debugging when tasks persist after database clear
 */

/**
 * Clear task store from localStorage
 * This will remove all persisted tasks and reset the store
 */
export const clearTaskStoreFromLocalStorage = () => {
  localStorage.removeItem("etech-task-store");
};

/**
 * Clear only processing tasks from localStorage
 * This will mark all processing tasks as completed
 */
export const clearProcessingTasksFromLocalStorage = () => {
  const stored = localStorage.getItem("etech-task-store");
  if (!stored) return;

  try {
    const data = JSON.parse(stored);
    if (data.state?.tasks) {
      data.state.tasks = data.state.tasks.map((task: any) => {
        if (task.status === "processing") {
          return {...task, status: "completed"};
        }
        return task;
      });
      localStorage.setItem("etech-task-store", JSON.stringify(data));
    }
  } catch {
    return;
  }
};

/**
 * Get current task store state from localStorage
 * Useful for debugging
 */
export const getTaskStoreFromLocalStorage = () => {
  const stored = localStorage.getItem("etech-task-store");
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

/**
 * Debug function to log current task store state
 */
export const debugTaskStore = () => {
  const store = getTaskStoreFromLocalStorage();
  if (store) return;
  return;
};
