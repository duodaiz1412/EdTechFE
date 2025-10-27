import {useEffect, useRef, useCallback} from "react";
import {useTaskSelectors, useTaskActions} from "@/stores/taskStore";
import useCourse from "./useCourse";

/**
 * Global polling hook that automatically manages polling for all processing tasks
 * This ensures polling continues even when user navigates between pages
 */
export const useGlobalPolling = () => {
  const {tasks, isPolling, currentPollingTask} = useTaskSelectors();
  const {
    updateTask,
    startPolling: storeStartPolling,
    setPollingState,
    updateTasksFromJobs,
    removeTask,
  } = useTaskActions();
  const {getMyJobs} = useCourse();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 100;
  const interval = 5000;

  // Check job status function
  const checkJobStatus = useCallback(
    async (entityId: string) => {
      try {
        const allJobs = await getMyJobs(0, 100);
        // Tìm job theo entityId thay vì jobId
        const job = allJobs.find((j: any) => j.entityId === entityId);

        // If job doesn't exist in API response, stop polling and clear task
        if (!job) {
          const currentTask = tasks.find((t) => t.id === entityId);
          if (currentTask && currentTask.status === "processing") {
            // Clear task thay vì mark failed
            removeTask(entityId);
            setPollingState(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
          return;
        }

        updateTasksFromJobs(allJobs);

        // Clear tasks that don't exist in API response
        const existingEntityIds = allJobs.map((j: any) => j.entityId);
        const tasksToRemove = tasks.filter(
          (task) =>
            task.status === "processing" &&
            !existingEntityIds.includes(task.id),
        );

        tasksToRemove.forEach((task) => {
          updateTask(task.id, {status: "completed"});
        });

        // Map backend status to frontend status
        let mappedStatus: "pending" | "processing" | "completed" | "failed";

        switch (job.status.toUpperCase()) {
          case "COMPLETED":
            mappedStatus = "completed";

            // Dispatch custom event để các component có thể listen
            window.dispatchEvent(
              new CustomEvent("videoTranscodingCompleted", {
                detail: {entityId, job},
              }),
            );

            setPollingState(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }

            // Clear task sau 2s để component có thời gian xử lý event
            setTimeout(() => {
              removeTask(entityId);
            }, 2000);
            break;

          case "FAILED":
            mappedStatus = "failed";
            setPollingState(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            removeTask(entityId);
            break;

          case "PROCESSING":
          case "PENDING":
          case "RUNNING": // Handle RUNNING as PROCESSING
            mappedStatus = "processing";
            break;

          default:
            // Unknown status, keep current status
            return;
        }

        // Update task with mapped status
        const currentTask = tasks.find((t) => t.id === entityId);
        if (currentTask) {
          updateTask(entityId, {
            status: mappedStatus,
            progress: job.progress || currentTask.progress,
          });
        }
      } catch {
        // Handle error silently or log to service
      }
    },
    [
      getMyJobs,
      tasks,
      updateTasksFromJobs,
      updateTask,
      setPollingState,
      removeTask,
    ],
  );

  // Start polling function
  const startPolling = useCallback(
    (entityId: string) => {
      if (isPolling && currentPollingTask === entityId) {
        return;
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      storeStartPolling(entityId);
      retryCountRef.current = 0;

      // Delay 1s trước khi bắt đầu polling để BE có thời gian tạo job
      setTimeout(() => {
        checkJobStatus(entityId);
      }, 1000);

      intervalRef.current = setInterval(() => {
        retryCountRef.current += 1;

        if (retryCountRef.current >= maxRetries) {
          setPollingState(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return;
        }

        checkJobStatus(entityId);
      }, interval);
    },
    [
      isPolling,
      currentPollingTask,
      checkJobStatus,
      storeStartPolling,
      setPollingState,
    ],
  );

  // Stop polling function
  const stopPolling = useCallback(() => {
    setPollingState(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [setPollingState]);

  // Auto-resume polling for processing tasks
  useEffect(() => {
    const processingTasks = tasks.filter(
      (task) => task.status === "processing",
    );

    if (processingTasks.length > 0) {
      const firstTask = processingTasks[0];

      // If not polling or polling a different task, start polling
      if (!isPolling || currentPollingTask !== firstTask.id) {
        // Delay 1s cho auto-resume để đảm bảo BE đã sẵn sàng
        setTimeout(() => {
          startPolling(firstTask.id);
        }, 1000);
      }
    }
  }, [tasks, isPolling, startPolling, currentPollingTask]);

  // Cleanup when no processing tasks
  useEffect(() => {
    const hasProcessingTasks = tasks.some(
      (task) => task.status === "processing",
    );

    if (!hasProcessingTasks && isPolling) {
      stopPolling();
    }
  }, [tasks, isPolling, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const currentJob = currentPollingTask
    ? tasks.find((t) => t.id === currentPollingTask) || null
    : null;

  return {
    isPolling,
    currentJob,
    tasks,
    startPolling,
    stopPolling,
  };
};

export default useGlobalPolling;
