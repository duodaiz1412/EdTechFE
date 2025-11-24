import {useState, useCallback} from "react";
import {
  UploadPurpose,
  UploadState,
  UseUploadFileOptions,
} from "../types/upload.types";
import {
  getFileUrlFromMinIO,
  generatePresignedUrl,
  uploadFileToMinIO,
  uploadVideoForTranscoding,
} from "../lib/services/upload.services";

export const useUploadFile = (options?: UseUploadFileOptions) => {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: null,
    error: null,
    success: false,
    uploadedUrl: null,
  });

  const resetState = useCallback(() => {
    setState({
      isUploading: false,
      progress: null,
      error: null,
      success: false,
      uploadedUrl: null,
    });
  }, []);

  const uploadFile = useCallback(
    async (file: File, purpose: UploadPurpose, entityId: string) => {
      try {
        setState((prev) => ({
          ...prev,
          isUploading: true,
          error: null,
          success: false,
          uploadedUrl: null,
        }));

        // Bước 1: Tạo presigned URL
        const presignedResponse = await generatePresignedUrl({
          fileName: file.name,
          entityId,
          purpose,
        });

        // Bước 2: Upload file lên MinIO
        const uploadedUrl = await uploadFileToMinIO(
          file,
          presignedResponse.uploadUrl,
          (progress) => {
            setState((prev) => ({
              ...prev,
              progress,
            }));

            // Gọi callback nếu có
            options?.onProgress?.(progress);
          },
        );

        setState((prev) => ({
          ...prev,
          isUploading: false,
          success: true,
          uploadedUrl,
        }));

        // Gọi callback thành công
        options?.onSuccess?.(uploadedUrl);

        return uploadedUrl;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error occurred while uploading file";

        setState((prev) => ({
          ...prev,
          isUploading: false,
          error: errorMessage,
          success: false,
        }));

        // Gọi callback lỗi
        options?.onError?.(errorMessage);

        throw error;
      }
    },
    [options],
  );

  const uploadAvatar = useCallback(
    async (file: File, userId: string) => {
      return uploadFile(file, UploadPurpose.USER_AVATAR, userId);
    },
    [uploadFile],
  );

  const uploadCourseThumbnail = useCallback(
    async (file: File, courseId: string) => {
      return uploadFile(file, UploadPurpose.COURSE_THUMBNAIL, courseId);
    },
    [uploadFile],
  );

  const uploadLessonResource = useCallback(
    async (file: File, lessonId: string) => {
      return uploadFile(file, UploadPurpose.LESSON_RESOURCE, lessonId);
    },
    [uploadFile],
  );

  const uploadLessonVideo = useCallback(
    async (file: File, lessonId: string) => {
      return uploadFile(file, UploadPurpose.LESSON_VIDEO, lessonId);
    },
    [uploadFile],
  );

  const uploadVideo = useCallback(
    async (file: File, entityId: string, purpose: UploadPurpose) => {
      try {
        setState((prev) => ({
          ...prev,
          isUploading: true,
          error: null,
          success: false,
          uploadedUrl: null,
        }));

        const response = await uploadVideoForTranscoding(
          {file, entityId, purpose},
          (progress) => {
            setState((prev) => ({
              ...prev,
              progress,
            }));

            // Gọi callback nếu có
            options?.onProgress?.(progress);
          },
        );

        setState((prev) => ({
          ...prev,
          isUploading: false,
          success: true,
          uploadedUrl: null, // Video transcoding không trả về URL ngay
        }));

        // Gọi callback thành công với entityId thay vì jobId
        options?.onSuccess?.(response.entityId);

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error occurred while uploading video";

        setState((prev) => ({
          ...prev,
          isUploading: false,
          error: errorMessage,
          success: false,
        }));

        // Gọi callback lỗi
        options?.onError?.(errorMessage);

        throw error;
      }
    },
    [options],
  );

  const getFileUrl = useCallback(async (objectName: string) => {
    if (!objectName) return null;
    return getFileUrlFromMinIO(objectName);
  }, []);

  return {
    // State
    ...state,

    // Actions
    uploadFile,
    uploadAvatar,
    uploadCourseThumbnail,
    uploadLessonResource,
    uploadLessonVideo,
    uploadVideo,
    getFileUrl,
    resetState,
  };
};
