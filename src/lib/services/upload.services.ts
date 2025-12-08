import axios from "axios";
import {toast} from "react-toastify";
import {
  PresignedUrlRequest,
  PresignedUrlResponse,
  TranscodeRequest,
} from "../../types/upload.types";
import {convertUrlToRelatuvePath} from "../utils";
import {getAccessToken} from "../utils/getAccessToken";

const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1";

// Upload API Endpoints
const UPLOAD_ENDPOINTS = {
  GENERATE_PRESIGNED_URL: BASE_API + "/uploads/generate-url",
  GET_URL: BASE_API + "/uploads/get-url",
  UPLOAD_VIDEO: BASE_API + "/uploads/videos",
} as const;

/**
 * Tạo presigned URL để upload file lên MinIO
 */
export const generatePresignedUrl = async (
  request: PresignedUrlRequest,
): Promise<PresignedUrlResponse> => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.post<PresignedUrlResponse>(
      UPLOAD_ENDPOINTS.GENERATE_PRESIGNED_URL,
      request,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch {
    toast.error("Cannot create file upload URL");
    throw new Error("Cannot create file upload URL");
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

    // Sử dụng function convertUrl để rút gọn URL
    return convertUrlToRelatuvePath(presignedUrl);
  } catch {
    toast.error("Cannot upload file");
    throw new Error("Cannot upload file");
  }
};

/**
 * Upload video để transcoding
 * Chỉ trả về status code 202 Accepted, không trả về job data
 */
export const uploadVideoForTranscoding = async (
  request: TranscodeRequest,
  onProgress?: (progress: {
    loaded: number;
    total: number;
    percentage: number;
  }) => void,
): Promise<{status: number; entityId: string}> => {
  try {
    const formData = new FormData();
    formData.append("file", request.file);
    formData.append("entityId", request.entityId);
    formData.append("purpose", request.purpose);

    const accessToken = await getAccessToken();
    const response = await axios.post(UPLOAD_ENDPOINTS.UPLOAD_VIDEO, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${accessToken}`,
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

    // Chỉ trả về status và entityId để tracking
    return {
      status: response.status,
      entityId: request.entityId,
    };
  } catch {
    toast.error("Cannot upload video for transcoding");
    throw new Error("Cannot upload video for transcoding");
  }
};

/**
 * Lấy URL của file từ MinIO bằng objectName
 * @param objectName - Tên object trong MinIO
 * @returns Object chứa uploadUrl và objectName
 */
export const getFileUrlFromMinIO = async (
  objectName: string,
): Promise<PresignedUrlResponse> => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get<PresignedUrlResponse>(
      UPLOAD_ENDPOINTS.GET_URL,
      {
        params: {objectName},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch {
    toast.error("Cannot get file URL");
    throw new Error("Cannot get file URL");
  }
};

/**
 * Lấy URL của file từ objectName (chỉ trả về URL string)
 * Helper function để dễ sử dụng hơn khi chỉ cần URL
 * @param objectName - Tên object trong MinIO
 * @returns URL string để truy cập file
 */
export const getFileUrl = async (objectName: string): Promise<string> => {
  if (!objectName) {
    return "";
  }

  const result = await getFileUrlFromMinIO(objectName);
  return result.uploadUrl;
};
