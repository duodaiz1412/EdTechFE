export enum UploadPurpose {
  USER_AVATAR = 'USER_AVATAR',
  COURSE_THUMBNAIL = 'COURSE_THUMBNAIL',
  LESSON_RESOURCE = 'LESSON_RESOURCE',
  LESSON_VIDEO = 'LESSON_VIDEO'
}

export interface PresignedUrlRequest {
  fileName: string;
  entityId: string;
  purpose: UploadPurpose;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  objectName: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadState {
  isUploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
  success: boolean;
  uploadedUrl: string | null;
}

export interface UseUploadFileOptions {
  onProgress?: (progress: UploadProgress) => void;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}
