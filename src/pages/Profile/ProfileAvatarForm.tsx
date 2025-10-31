import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {HardDriveUpload} from "lucide-react";

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

  // Cleanup preview URL khi component unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md w-1/3 space-y-4">
        <h3 className="text-lg text-center font-semibold">
          Change Profile Image
        </h3>
        <label
          htmlFor="avatar"
          className="block border border-slate-300 cursor-pointer rounded-md"
        >
          {!previewUrl && (
            <div className="h-60 rounded-md bg-slate-50 flex flex-col justify-center items-center space-y-2 text-slate-500 font-semibold">
              <HardDriveUpload size={40} />
              <span>Upload an image</span>
            </div>
          )}
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="w-full rounded-md" />
          )}
          <input
            id="avatar"
            type="file"
            className="mb-4"
            accept="image/*"
            hidden
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />
        </label>
        <div className="flex justify-end space-x-4">
          <button
            className="btn rounded-md"
            onClick={() => setIsFormOpen(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-neutral rounded-md"
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
