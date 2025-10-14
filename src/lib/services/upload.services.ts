import axios from "axios";
import {toast} from "react-toastify";
import {
  PresignedUrlRequest,
  PresignedUrlResponse,
  TranscodeRequest,
  Job,
} from "../../types/upload.types";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1";

// Upload API Endpoints
const UPLOAD_ENDPOINTS = {
  GENERATE_PRESIGNED_URL: BASE_API + "/uploads/generate-url",
  UPLOAD_VIDEO: BASE_API + "/uploads/videos",
} as const;

/**
 * Tạo presigned URL để upload file lên MinIO
 */
export const generatePresignedUrl = async (
  request: PresignedUrlRequest,
): Promise<PresignedUrlResponse> => {
  try {
    const response = await axios.post<PresignedUrlResponse>(
      UPLOAD_ENDPOINTS.GENERATE_PRESIGNED_URL,
      request,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
    return response.data;
  } catch {
    toast.error("Không thể tạo URL upload file");
    throw new Error("Không thể tạo URL upload file");
  }
};

/**
 * Upload file lên MinIO sử dụng presigned URL
 */
export const uploadFileToMinIO = async (
  file: File,
  presignedUrl: string,
  onProgress?: (progress: {
    loaded: number;
    total: number;
    percentage: number;
  }) => void,
): Promise<string> => {
  try {
    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            ),
          };
          onProgress(progress);
        }
      },
    });

    // Trả về path tương đối từ bucket root (bỏ query parameters)
    const cleanUrl = presignedUrl.split("?")[0]; // Loại bỏ query parameters
    const url = new URL(cleanUrl);
    const pathname = url.pathname.substring(1); // Bỏ dấu / đầu tiên
    // Tìm vị trí của bucket name và lấy phần từ đó trở đi
    const bucketName = "edtech-content";
    const bucketIndex = pathname.indexOf(bucketName + "/");
    const relativePath = bucketIndex !== -1 ? pathname.substring(bucketIndex + bucketName.length + 1) : pathname;
    // Trả về path tương đối từ bucket root
    return relativePath;
  } catch {
    toast.error("Không thể upload file");
    throw new Error("Không thể upload file");
  }
};

/**
 * Upload video để transcoding
 */
export const uploadVideoForTranscoding = async (
  request: TranscodeRequest,
  onProgress?: (progress: {
    loaded: number;
    total: number;
    percentage: number;
  }) => void,
): Promise<Job> => {
  try {
    const formData = new FormData();
    formData.append("file", request.file);
    formData.append("entityId", request.entityId);
    formData.append("purpose", request.purpose);

    const response = await axios.post<Job>(
      UPLOAD_ENDPOINTS.UPLOAD_VIDEO,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              ),
            };
            onProgress(progress);
          }
        },
      },
    );
    return response.data;
  } catch {
    toast.error("Không thể upload video để transcoding");
    throw new Error("Không thể upload video để transcoding");
  }
};
