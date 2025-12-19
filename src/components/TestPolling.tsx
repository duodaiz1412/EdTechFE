import React from "react";
import {useTaskActions} from "@/stores/taskStore";
import {useGlobalPollingContext} from "./GlobalPollingProvider";

const TestPolling: React.FC = () => {
  const {addTask} = useTaskActions();
  const {isPolling, currentJob, tasks, startPolling, stopPolling} =
    useGlobalPollingContext();

  const createTestTask = () => {
    const testJobId = `test-${Date.now()}`;

    addTask({
      id: testJobId,
      type: "video_transcoding",
      status: "processing",
      progress: 0,
      maxRetries: 100,
      metadata: {
        lessonId: "test-lesson",
        courseId: "test-course",
        entityId: "test-lesson",
        entityType: "lesson",
      },
    });
  };

  const startTestPolling = () => {
    if (tasks.length > 0) {
      const firstTask = tasks[0];
      startPolling(firstTask.id);
    }
  };

  const stopTestPolling = () => {
    stopPolling();
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        left: 10,
        background: "white",
        border: "1px solid #ccc",
        padding: "10px",
        zIndex: 9999,
        maxWidth: "300px",
        fontSize: "12px",
      }}
    >
      <h4>🧪 Test Polling</h4>
      <p>
        <strong>Is Polling:</strong> {isPolling ? "✅" : "❌"}
      </p>
      <p>
        <strong>Current Job:</strong> {currentJob?.id || "None"}
      </p>
      <p>
        <strong>Tasks Count:</strong> {tasks.length}
      </p>

      <div style={{marginTop: "10px"}}>
        <button onClick={createTestTask} style={{marginRight: "5px"}}>
          Create Test Task
        </button>
        <button onClick={startTestPolling} style={{marginRight: "5px"}}>
          Start Polling
        </button>
        <button onClick={stopTestPolling}>Stop Polling</button>
      </div>

      <div style={{marginTop: "10px"}}>
        <strong>Tasks:</strong>
        <ul style={{margin: "5px 0", paddingLeft: "15px"}}>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.id} - {task.status} ({task.progress}%)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestPolling;
