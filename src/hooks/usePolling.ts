import {useState, useCallback, useRef, useEffect, useMemo} from "react";
import useCourse from "./useCourse";
import {useTaskSelectors, useTaskActions, Task} from "@/stores/taskStore";

export interface PollingOptions {
  interval?: number;
  maxRetries?: number;
  autoStart?: boolean;
  onSuccess?: (job: Task) => void;
  onError?: (job: Task) => void;
  onTimeout?: () => void;
  onStatusChange?: (job: Task) => void;
}

export interface UsePollingReturn {
  isPolling: boolean;
  currentJob: Task | null;
  jobs: Task[];
  error: string | null;
  retryCount: number;
  startPolling: (jobId: string) => void;
  stopPolling: () => void;
  reset: () => void;
  refreshJobs: () => Promise<void>;
}

const DEFAULT_OPTIONS: Required<PollingOptions> = {
  interval: 5000,
  maxRetries: 50,
  autoStart: false,
  onSuccess: () => {},
  onError: () => {},
  onTimeout: () => {},
  onStatusChange: () => {},
};

export const usePolling = (options: PollingOptions = {}): UsePollingReturn => {
  const mergedOptions = useMemo(
    () => ({...DEFAULT_OPTIONS, ...options}),
    [options],
  );
  const {getMyJobs} = useCourse();

  // Zustand store
  const {tasks, isPolling, currentPollingTask} = useTaskSelectors();
  const {
    updateTask,
    startPolling: storeStartPolling,
    setPollingState,
    updateTasksFromJobs,
  } = useTaskActions();

  // Local state for polling control
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentJobIdRef = useRef<string | null>(null);
  const retryCountRef = useRef(0);

  // Cleanup interval khi component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Reset polling state
      setPollingState(false);
    };
  }, [setPollingState]);

  // Hàm kiểm tra trạng thái job
  const checkJobStatus = useCallback(
    async (jobId: string) => {
      try {
        const allJobs = await getMyJobs(0, 100); // Lấy tất cả jobs
        const job = allJobs.find((j: any) => j.id === jobId);

        if (!job) {
          setError(`Job ${jobId} not found`);
          return;
        }

        // Update Zustand store
        updateTasksFromJobs(allJobs);

        // Find current task in store
        const currentTask = tasks.find((t) => t.id === jobId);
        if (currentTask) {
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
              mappedStatus = currentTask.status;
          }

          updateTask(jobId, {
            status: mappedStatus,
            progress: job.progress || currentTask.progress,
          });
        }

        // Gọi callback khi status thay đổi
        mergedOptions.onStatusChange(job as any);

        // Kiểm tra trạng thái job
        switch (job.status.toUpperCase()) {
          case "COMPLETED":
            setPollingState(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            updateTask(jobId, {status: "completed"});
            mergedOptions.onSuccess(job as any);
            break;

          case "FAILED":
            setPollingState(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            updateTask(jobId, {status: "failed"});
            mergedOptions.onError(job as any);
            break;

          case "PROCESSING":
          case "PENDING":
            updateTask(jobId, {status: "processing"});
            break;

          default:
            break;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    },
    [
      getMyJobs,
      mergedOptions,
      tasks,
      updateTasksFromJobs,
      updateTask,
      setPollingState,
    ],
  );

  // Hàm bắt đầu polling
  const startPolling = useCallback(
    (jobId: string) => {
      if (isPolling && currentJobIdRef.current === jobId) {
        return; // Đã đang polling job này
      }

      // Dừng polling cũ nếu có
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Update Zustand store
      storeStartPolling(jobId);
      setError(null);
      setRetryCount(0);
      retryCountRef.current = 0;
      currentJobIdRef.current = jobId;

      // Kiểm tra ngay lập tức
      checkJobStatus(jobId);

      // Bắt đầu interval
      intervalRef.current = setInterval(() => {
        if (currentJobIdRef.current) {
          retryCountRef.current += 1;
          setRetryCount(retryCountRef.current);

          // Kiểm tra max retries
          if (retryCountRef.current >= mergedOptions.maxRetries) {
            setPollingState(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            mergedOptions.onTimeout();
            return;
          }

          checkJobStatus(jobId);
        }
      }, mergedOptions.interval);
    },
    [
      isPolling,
      checkJobStatus,
      mergedOptions,
      storeStartPolling,
      setPollingState,
    ],
  );

  // Hàm dừng polling
  const stopPolling = useCallback(() => {
    setPollingState(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    currentJobIdRef.current = null;
  }, [setPollingState]);

  // Hàm reset
  const reset = useCallback(() => {
    stopPolling();
    setError(null);
    setRetryCount(0);
    retryCountRef.current = 0;
  }, [stopPolling]);

  // Hàm refresh jobs
  const refreshJobs = useCallback(async () => {
    try {
      const allJobs = await getMyJobs(0, 100);
      updateTasksFromJobs(allJobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh jobs");
    }
  }, [getMyJobs, updateTasksFromJobs]);

  // Auto start nếu được cấu hình
  useEffect(() => {
    if (mergedOptions.autoStart && currentPollingTask) {
      startPolling(currentPollingTask);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mergedOptions.autoStart, currentPollingTask]);

  // Get current job from store
  const currentJob = currentPollingTask
    ? tasks.find((t) => t.id === currentPollingTask) || null
    : null;
  const jobs = tasks;

  return {
    isPolling,
    currentJob,
    jobs,
    error,
    retryCount,
    startPolling,
    stopPolling,
    reset,
    refreshJobs,
  };
};

export default usePolling;
