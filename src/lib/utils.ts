import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertUrlToRelatuvePath(presignedUrl: string): string {
  if (!presignedUrl) return presignedUrl;
  
  try {
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
    // Nếu có lỗi parse URL, trả về URL gốc
    return presignedUrl;
  }
}