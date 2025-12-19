import {useState, useEffect} from "react";
import {Upload} from "lucide-react";
import Button from "@/components/Button";
import {useUploadFile} from "@/hooks/useUploadFile";
import {UploadPurpose} from "@/types/upload.types";

type FileUploadProps = {
  title: string;
  accept: "image/*" | "video/*";
  purpose: UploadPurpose;
  courseId: string;
  src?: string; // URL của file hiện có
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
  className?: string;
};

export default function FileUpload({
  title,
  accept,
  purpose,
  courseId,
  src,
  onUploadSuccess,
  onUploadError,
  className = "",
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);

  const uploadHook = useUploadFile({
    onSuccess: (url) => {
      // Đối với video, url có thể là job ID, nhưng chúng ta vẫn set uploadedUrl để hiển thị success
      setUploadedUrl(url || "uploaded");
      onUploadSuccess?.(url);
    },
    onError: (error) => {
      onUploadError?.(error);
    },
  });

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);

    // Cleanup previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !courseId) {
      return;
    }

    try {
      if (accept === "video/*") {
        await uploadHook.uploadVideo(selectedFile, courseId, purpose);
      } else {
        await uploadHook.uploadFile(selectedFile, purpose, courseId);
      }
    } catch {
      // Error handling is done in the upload hook
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadedUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    uploadHook.resetState();
  };

  // Cleanup preview URL khi component unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    // If src (objectName) is provided and it's not a full URL, fetch the presigned URL
    if (src && !src.startsWith("http")) {
      const fetchUrl = async () => {
        try {
          const url = await uploadHook.getFileUrl(src);
          setDisplaySrc(url?.uploadUrl != undefined ? url?.uploadUrl : "");
        } catch {
          setDisplaySrc(null);
        }
      };
      fetchUrl();
    } else {
      setDisplaySrc(src || null);
    }
  }, [src, uploadHook.getFileUrl]);

  const isImage = accept === "image/*";

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-lg font-semibold text-gray-900">{title}</h4>

      <div className="flex flex-wrap gap-6">
        {/* Preview Area */}
        <div className="w-64 h-40 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
          {previewUrl || displaySrc ? (
            <div className="relative w-full h-full">
              {isImage ? (
                <img
                  src={previewUrl || displaySrc || ""}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={previewUrl || displaySrc || ""}
                  className="w-full h-full object-cover"
                  controls
                  muted
                />
              )}

              {/* Upload Progress Overlay */}
              {uploadHook.isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${uploadHook.progress?.percentage || 0}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs">
                      {uploadHook.progress?.percentage || 0}%
                    </p>
                  </div>
                </div>
              )}

              {/* Upload Success Badge */}
              {uploadedUrl && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                  ✓ Uploaded
                </div>
              )}

              {/* Current File Badge - chỉ hiện khi không có previewUrl (file mới) */}
              {displaySrc && !previewUrl && !uploadedUrl && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                  Current
                </div>
              )}
            </div>
          ) : selectedFile ? (
            <div className="text-center">
              <p className="text-sm text-gray-600">{selectedFile.name}</p>
              {uploadHook.isUploading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${uploadHook.progress?.percentage || 0}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {uploadHook.progress?.percentage || 0}%
                  </p>
                </div>
              )}
              {uploadedUrl && (
                <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Upload size={32} className="mx-auto mb-2" />
              <p className="text-sm">Upload {isImage ? "image" : "video"}</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="min-w-[400px] space-y-3">
          <input
            type="file"
            accept={accept}
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="hidden"
            id={`file-upload-${title.toLowerCase().replace(/\s+/g, "-")}`}
          />
          <label
            htmlFor={`file-upload-${title.toLowerCase().replace(/\s+/g, "-")}`}
            className={`block w-full px-4 py-2 border rounded-md cursor-pointer transition-colors ${
              uploadedUrl
                ? "border-green-300 bg-green-50 text-green-800 hover:bg-green-100"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>
                {uploadedUrl
                  ? "Uploaded successfully"
                  : selectedFile
                    ? selectedFile.name
                    : `Choose ${isImage ? "an image" : "a video"}`}
              </span>
              {uploadedUrl && (
                <span className="text-green-600 text-sm font-medium">
                  ✓ Uploaded
                </span>
              )}
            </div>
          </label>
          {/* Upload Progress Message */}
          {uploadHook.isUploading && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800">
                    Uploading {isImage ? "image" : "video"}...
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {uploadHook.progress?.percentage || 0}% complete
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {selectedFile && !uploadedUrl && (
              <Button
                onClick={handleUpload}
                disabled={uploadHook.isUploading}
                className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadHook.isUploading
                  ? "Uploading..."
                  : `Upload ${isImage ? "Image" : "Video"}`}
              </Button>
            )}

            {(selectedFile || uploadedUrl) && (
              <Button onClick={resetUpload} variant="secondary" className="">
                {uploadedUrl ? "Upload New" : "Reset"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
