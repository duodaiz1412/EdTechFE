const BASE_API = import.meta.env.VITE_API_BASE_URL + "/api/v1";
const UPLOAD_ENDPOINTS = {
  PRESIGNED_URL: BASE_API + "/uploads/generate-url",
};

export const uploadServices = {};
