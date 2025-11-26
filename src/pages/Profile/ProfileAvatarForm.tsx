import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {HardDriveUpload, X} from "lucide-react";

import {useAppSelector} from "@/redux/hooks";
import {useUploadFile} from "@/hooks/useUploadFile";
import {UploadPurpose} from "@/types/upload.types";

interface ProfileAvatarFormProps {
  setIsFormOpen: (value: boolean) => void;
  handleSaveAvatar: (url: string) => void;
}

export default function ProfileAvatarForm({
  setIsFormOpen,
  handleSaveAvatar,
}: ProfileAvatarFormProps) {
  const userData = useAppSelector((state) => state.user.data);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const {uploadFile} = useUploadFile({
    onSuccess: (url) => {
      setIsFormOpen(false);
      handleSaveAvatar(url);
    },
  });

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);

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
    if (!selectedFile) {
      toast.error("Please choose an image");
      return;
    }

    await uploadFile(
      selectedFile,
      UploadPurpose.USER_AVATAR,
      userData?.id || "",
    );
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Change Profile Picture
          </h3>
          <button
            onClick={() => setIsFormOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <label htmlFor="avatar" className="block cursor-pointer group">
            {!previewUrl ? (
              <div className="h-64 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 group-hover:border-gray-400 transition-all flex flex-col justify-center items-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HardDriveUpload size={32} className="text-gray-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Click to upload image
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <p className="text-white font-medium">Click to change</p>
                </div>
              </div>
            )}
            <input
              id="avatar"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-xl">
          <button
            className="px-6 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            onClick={() => setIsFormOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
