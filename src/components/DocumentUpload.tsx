import {Upload, X} from "lucide-react";
import Button from "@/components/Button";

type DocumentUploadProps = {
  title: string;
  accept: string;
  src?: string; // URL của file hiện có
  selectedFile?: File | null;
  onFileSelect?: (file: File | null) => void;
  className?: string;
};

export default function DocumentUpload({
  title,
  accept,
  src,
  selectedFile,
  onFileSelect,
  className = "",
}: DocumentUploadProps) {
  const handleFileChange = (file: File | null) => {
    onFileSelect?.(file);
  };

  const resetFile = () => {
    onFileSelect?.(null);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "txt":
        return "📃";
      case "md":
        return "📋";
      default:
        return "📄";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-lg font-semibold text-gray-900">{title}</h4>

      <div className="space-y-3">
        {/* File Input */}
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className="hidden"
          id={`document-upload-${title.toLowerCase().replace(/\s+/g, "-")}`}
        />
        <label
          htmlFor={`document-upload-${title.toLowerCase().replace(/\s+/g, "-")}`}
          className={`block w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            selectedFile
              ? "border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-center space-x-3">
            <Upload size={20} />
            <span>{selectedFile ? selectedFile.name : "Choose a file"}</span>
          </div>
        </label>

        {/* File Info */}
        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getFileIcon(selectedFile.name)}</span>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={() => onFileSelect?.(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Current File Display */}
        {src && !selectedFile && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📄</span>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Current file
                </p>
                <p className="text-xs text-blue-600">File already uploaded</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {selectedFile && (
          <div className="flex gap-2">
            <Button onClick={resetFile} variant="secondary">
              Remove File
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
