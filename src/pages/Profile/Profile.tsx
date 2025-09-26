import {userServices} from "@/lib/services/user.services";
import {useAppSelector} from "@/redux/hooks";
import {useState} from "react";
import {toast} from "react-toastify";

export default function Profile() {
  const userData = useAppSelector((state) => state.user.data);

  const [fullName, setFullName] = useState(userData?.name);
  const [email, setEmail] = useState(userData?.email);
  const [username, setUsername] = useState(userData?.username);
  const [image, setImage] = useState<File | string | undefined>(
    userData?.image,
  );
  const [preview, setPreview] = useState<string | undefined>(undefined);

  const [isChangeInfo, setIsChangeInfo] = useState(false);

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Kiểm tra định dạng file
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.onerror = () => {
      toast.error("Error reading file");
    };

    reader.readAsDataURL(file);
  };

  const handleChangeInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isChangeInfo) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const response = await userServices.changeUserInfo(accessToken, {
      username: username,
      fullName: fullName,
      email: email,
    });

    if (response.status !== 200) {
      toast.error("Failed to change info, please try later.");
    }
    window.location.reload();
  };

  return (
    <div className="w-full max-w-5/6 mx-auto">
      <h2 className="text-xl font-bold mb-10">Your profile</h2>
      <form className="space-y-8" onSubmit={handleChangeInfo}>
        <div className="flex flex-col space-y-2">
          <label htmlFor="fullname" className="font-semibold">
            Fullname
          </label>
          <input
            id="fullname"
            type="text"
            className="input w-full"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setIsChangeInfo(true);
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input w-full"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsChangeInfo(true);
              }}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="fullname" className="font-semibold">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="input w-full"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setIsChangeInfo(true);
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-96 bg-slate-200 border border-slate-200 flex justify-center">
            <img src={preview} />
          </div>
          <div className="col-span-1 space-y-2 flex flex-col">
            <label htmlFor="user-image" className="font-semibold">
              User image
            </label>
            <input
              id="user-image"
              type="file"
              accept="image/*"
              className="file-input w-full"
              onChange={handleUploadImage}
            />
          </div>
        </div>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={!isChangeInfo}
        >
          Save
        </button>
      </form>
    </div>
  );
}
