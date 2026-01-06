import {useRef, useState, useCallback} from "react";

import {getAccessToken} from "@/lib/utils/getAccessToken";
import {liveServices} from "@/lib/services/live.services";

interface RecordingRefs {
  // Streams
  screenStream: MediaStream | null;
  micStream: MediaStream | null;
  audioContext: AudioContext | null;
  combinedStream: MediaStream | null;

  // MediaRecorder
  mediaRecorder: MediaRecorder | null;
  recordingOptions: MediaRecorderOptions | null;

  // Counters
  chunkIndex: number;
  uploadedChunks: number;

  // Timers
  chunkTimer: NodeJS.Timeout | null;
  durationTimer: NodeJS.Timeout | null;
  startTime: number | null;
  totalDurationSeconds: number;

  // Flags
  isRecording: boolean;
  isStopping: boolean;
  isCompleting: boolean;

  // Tracking
  roomId: number | null;
  sessionId: number | null;
  handleId: number | null;
}

export function useRecording() {
  const refs = useRef<RecordingRefs>({
    screenStream: null,
    micStream: null,
    audioContext: null,
    combinedStream: null,
    mediaRecorder: null,
    recordingOptions: null,
    chunkIndex: 0,
    uploadedChunks: 0,
    chunkTimer: null,
    durationTimer: null,
    startTime: null,
    totalDurationSeconds: 0,
    isRecording: false,
    isStopping: false,
    isCompleting: false,
    roomId: null,
    sessionId: null,
    handleId: null,
  });

  // UI state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isStopping, setIsStopping] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [uploadedChunks, setUploadedChunks] = useState<number>(0);

  // Upload chunk
  const uploadChunk = useCallback(
    async (blob: Blob, durationSeconds: number) => {
      const roomId = refs.current.roomId;
      const currentIndex = refs.current.chunkIndex;

      if (!roomId) {
        throw new Error("No room ID");
      }

      if (!blob || blob.size === 0) {
        console.log("[UPLOAD CHUNK]: No data to upload");
        return;
      }

      if (blob.size < 1000) {
        console.warn("[UPLOAD CHUNK]: Chunk size too small");
      }

      console.log(
        `[UPLOAD CHUNK]: Uploading chunk #${currentIndex} (${(blob.size / 1024 / 1024).toFixed(2)} MB)`,
      );

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      try {
        const accessToken = await getAccessToken();
        const response = await liveServices.uploadChunk(
          accessToken,
          roomId,
          blob,
          currentIndex,
          durationSeconds,
        );

        clearTimeout(timeoutId);

        if (response.status === 200) {
          const newTotal = response.data.totalChunksUploaded || 0;
          refs.current.uploadedChunks = newTotal;
          setUploadedChunks(newTotal);
          console.log(
            `[UPLOAD CHUNK]: Chunk #${currentIndex} uploaded (total: ${newTotal})`,
          );
        } else {
          throw new Error(
            `Upload failed: ${response.data.message || "Unknown error"}`,
          );
        }
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
          throw new Error("Upload timeout after 60 seconds");
        }
        throw error;
      }
    },
    [],
  );

  const createMediaRecorder = useCallback(
    (roomId: number) => {
      const stream = refs.current.combinedStream;
      const options = refs.current.recordingOptions;

      if (!stream || !options) {
        throw new Error("No stream or options available");
      }

      const mr = new MediaRecorder(stream, options);

      mr.ondataavailable = async (event) => {
        if (!event.data || event.data.size < 1000) {
          console.log("[MEDIA RECORDER]: Ignored small data chunk");
          return;
        }

        const blob = event.data;
        const currentIndex = refs.current.chunkIndex;
        const duration = 30;

        console.log(
          `[MEDIA RECORDER]: Chunk #${currentIndex} ready (${(blob.size / 1024 / 1024).toFixed(2)} MB)`,
        );

        try {
          await uploadChunk(blob, duration);
          // Only increment after successful upload
          refs.current.chunkIndex += 1;
          console.log(
            `[MEDIA RECORDER]: Chunk #${currentIndex} uploaded successfully`,
          );
        } catch (error) {
          // Don't increment on failure
          console.error(
            `[MEDIA RECORDER]: Failed to upload chunk #${currentIndex}`,
            error,
          );
        }
      };

      mr.onerror = (event) => {
        console.error("[MEDIA RECORDER]: Error occurred", event);
      };

      mr.onstop = async () => {
        console.log(
          `[MEDIA RECORDER]: Stop (chunk #${refs.current.chunkIndex} completed)`,
        );

        if (refs.current.isStopping || !refs.current.isRecording) {
          console.log(
            "[MEDIA RECORDER]: Recording is stopping, NOT restarting",
          );
          return;
        }

        // Wait for final data
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Check again with fresh values
        if (refs.current.isRecording && !refs.current.isStopping) {
          console.log(
            `[MEDIA RECORDER]: Restarting for chunk #${refs.current.chunkIndex}`,
          );

          try {
            const newMr = createMediaRecorder(roomId);
            refs.current.mediaRecorder = newMr;
            newMr.start();
            console.log(`[MEDIA RECORDER]: Restarted successfully`);
          } catch (error) {
            console.error("[MEDIA RECORDER]: Failed to restart", error);
            stopRecording();
          }
        } else {
          console.log("[MEDIA RECORDER]: Not restarting (state changed)");
        }
      };

      return mr;
    },
    [uploadChunk],
  );

  // Start duration timer
  const startDurationTimer = useCallback(() => {
    refs.current.durationTimer = setInterval(() => {
      if (refs.current.startTime) {
        const elapsedMs = Date.now() - refs.current.startTime;
        const seconds = Math.floor(elapsedMs / 1000);
        refs.current.totalDurationSeconds = seconds;
        setDuration(seconds);
      }
    }, 1000);
  }, []);

  // Cleanup
  const cleanup = useCallback(() => {
    console.log("[CLEANUP]: Starting cleanup...");

    // Stop all tracks
    if (refs.current.screenStream) {
      refs.current.screenStream.getTracks().forEach((track) => track.stop());
      refs.current.screenStream = null;
    }
    if (refs.current.micStream) {
      refs.current.micStream.getTracks().forEach((track) => track.stop());
      refs.current.micStream = null;
    }
    if (refs.current.combinedStream) {
      refs.current.combinedStream.getTracks().forEach((track) => track.stop());
      refs.current.combinedStream = null;
    }

    // Close audio context
    if (refs.current.audioContext) {
      refs.current.audioContext.close();
      refs.current.audioContext = null;
    }

    // Stop timers
    if (refs.current.durationTimer) {
      clearInterval(refs.current.durationTimer);
      refs.current.durationTimer = null;
    }
    if (refs.current.chunkTimer) {
      clearInterval(refs.current.chunkTimer);
      refs.current.chunkTimer = null;
    }

    // Reset refs
    refs.current.mediaRecorder = null;
    refs.current.recordingOptions = null;
    refs.current.chunkIndex = 0;
    refs.current.uploadedChunks = 0;
    refs.current.startTime = null;
    refs.current.totalDurationSeconds = 0;
    refs.current.isRecording = false;
    refs.current.isStopping = false;
    refs.current.isCompleting = false;
    refs.current.roomId = null;
    refs.current.sessionId = null;
    refs.current.handleId = null;

    // Reset UI state
    setIsRecording(false);
    setIsStopping(false);
    setDuration(0);
    setUploadedChunks(0);

    console.log("[CLEANUP]: Cleanup complete");
  }, []);

  // Start Recording
  const startRecording = useCallback(
    async (roomId: number) => {
      if (!roomId) {
        throw new Error("No room ID provided");
      }

      try {
        console.log("[START RECORDING]: Initializing...");

        // 1. Get screen stream with system audio
        console.log("[START RECORDING]: Requesting screen share...");
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: {ideal: 1920},
            height: {ideal: 1080},
            frameRate: {ideal: 30},
          },
          audio: true,
        });
        refs.current.screenStream = screenStream;

        // Handle user stops sharing via browser button
        screenStream.getVideoTracks()[0].onended = () => {
          console.log("[START RECORDING]: Screen sharing stopped by user");
          stopRecording();
        };

        // 2. Get microphone stream
        console.log("[START RECORDING]: Requesting microphone...");
        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        refs.current.micStream = micStream;

        // 3. Merge audio tracks using Web Audio API
        console.log("[START RECORDING]: Merging audio tracks...");
        const audioContext = new AudioContext();
        refs.current.audioContext = audioContext;
        const destination = audioContext.createMediaStreamDestination();

        // Add system audio
        const screenAudioTracks = screenStream.getAudioTracks();
        if (screenAudioTracks.length > 0) {
          const screenAudioSource = audioContext.createMediaStreamSource(
            new MediaStream(screenAudioTracks),
          );
          screenAudioSource.connect(destination);
          console.log("[START RECORDING]: System audio added");
        } else {
          console.log("[START RECORDING]: No system audio found");
        }

        // Add microphone audio
        const micAudioSource = audioContext.createMediaStreamSource(micStream);
        micAudioSource.connect(destination);
        console.log("[START RECORDING]: Microphone audio added");

        // 4. Create combined stream
        const combinedStream = new MediaStream([
          ...screenStream.getVideoTracks(),
          ...destination.stream.getAudioTracks(),
        ]);
        refs.current.combinedStream = combinedStream;
        console.log(
          `[START RECORDING]: Combined stream created (${combinedStream.getTracks().length} tracks)`,
        );

        // 5. Setup MediaRecorder with WebM format
        const mimeType = "video/webm;codecs=vp8,opus";
        const options: MediaRecorderOptions = {
          mimeType: mimeType,
          videoBitsPerSecond: 2500000,
          audioBitsPerSecond: 128000,
        };

        if (!MediaRecorder.isTypeSupported(mimeType)) {
          throw new Error(`MediaRecorder doesn't support ${mimeType}`);
        }

        refs.current.recordingOptions = options;
        console.log("[START RECORDING]: Using VP8 codec for stable chunks");

        // 6. Create and start MediaRecorder
        const mediaRecorder = createMediaRecorder(roomId);
        refs.current.mediaRecorder = mediaRecorder;
        mediaRecorder.start();
        console.log("[START RECORDING]: MediaRecorder started");

        // 7. Setup chunk timer (stop/restart every 30s)
        refs.current.chunkTimer = setInterval(() => {
          // Read from refs.current - NOT closure
          if (
            refs.current.isRecording &&
            refs.current.mediaRecorder &&
            !refs.current.isStopping
          ) {
            const mrState = refs.current.mediaRecorder.state;
            if (mrState === "recording") {
              console.log(
                "[START RECORDING]: 30s elapsed, stopping for chunk...",
              );
              refs.current.mediaRecorder.stop();
            } else {
              console.log(`[START RECORDING]: MediaRecorder is ${mrState}`);
            }
          }
        }, 30000);

        // 8. Initialize state (at the END - only if everything succeeded!)
        refs.current.isRecording = true;
        refs.current.isStopping = false;
        refs.current.isCompleting = false;
        refs.current.chunkIndex = 0;
        refs.current.uploadedChunks = 0;
        refs.current.startTime = Date.now();
        refs.current.roomId = roomId;

        // Update UI
        setIsRecording(true);
        setIsStopping(false);
        setDuration(0);
        setUploadedChunks(0);

        // Start duration timer
        startDurationTimer();

        console.log("[START RECORDING]: Recording started successfully!");
      } catch (error) {
        console.error("[START RECORDING]: Failed to start", error);
        cleanup();
        throw error;
      }
    },
    [createMediaRecorder, startDurationTimer, cleanup],
  );

  // Stop Recording
  const stopRecording = useCallback(async () => {
    if (!refs.current.isRecording) {
      console.log("[STOP RECORDING]: Not recording");
      return;
    }

    if (refs.current.isCompleting) {
      console.log("[STOP RECORDING]: Already completing");
      return;
    }

    const roomId = refs.current.roomId;
    if (!roomId) {
      throw new Error("No room ID");
    }

    try {
      console.log("[STOP RECORDING]: Stopping...");

      // Set flags
      refs.current.isStopping = true;
      refs.current.isRecording = false;
      refs.current.isCompleting = true;
      setIsStopping(true);
      setIsRecording(false);

      // Stop chunk timer FIRST
      if (refs.current.chunkTimer) {
        clearInterval(refs.current.chunkTimer);
        refs.current.chunkTimer = null;
        console.log("[STOP RECORDING]: Chunk timer stopped");
      }

      // Wait to ensure timer callback doesn't fire
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Stop MediaRecorder (triggers final chunk)
      if (
        refs.current.mediaRecorder &&
        refs.current.mediaRecorder.state !== "inactive"
      ) {
        console.log("[STOP RECORDING]: Stopping MediaRecorder...");
        refs.current.mediaRecorder.stop();
      }

      // Wait for final chunk upload
      console.log("[STOP RECORDING]: Waiting for final chunk...");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Call complete API
      const totalChunks = refs.current.uploadedChunks;
      const totalDuration = refs.current.totalDurationSeconds;

      console.log(
        `[STOP RECORDING]: Completing with ${totalChunks} chunks, ${totalDuration}s`,
      );

      const accessToken = await getAccessToken();
      const response = await liveServices.completeRecord(
        accessToken,
        roomId,
        totalChunks,
        totalDuration,
      );

      if (response.status !== 200) {
        throw new Error("Complete recording failed");
      }

      console.log("[STOP RECORDING]: Recording completed successfully!");
      return response.data;
    } catch (error) {
      console.error("[STOP RECORDING]: Error", error);
      throw error;
    } finally {
      cleanup();
    }
  }, [cleanup]);

  return {
    isRecording,
    isStopping,
    duration,
    uploadedChunks,
    startRecording,
    stopRecording,
  };
}
