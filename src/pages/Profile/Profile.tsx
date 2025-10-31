import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Camera, Mail, ShieldUser, Trash2, User} from "lucide-react";

import {login} from "@/redux/slice/userSlice";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {userServices} from "@/lib/services/user.services";
import ProfileAvatarForm from "./ProfileAvatarForm";

export default function Profile() {
  const userData = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(userData?.name || "");
  const [isAvatarChoosing, setIsAvatarChoosing] = useState(false);

  const handleSaveFullName = async () => {
    const accessToken = await getAccessToken();
    const response = await userServices.changeUserInfo(accessToken, {
      fullName: fullName,
    });

    if (response.status === 200) {
      toast.success("Fullname updated successfully");
      dispatch(login({...userData, name: fullName}));
    } else {
      toast.error("Failed to update fullname");
    }
  };

  const handleSaveAvatar = async (url: string) => {
    const accessToken = await getAccessToken();
    const response = await userServices.changeUserInfo(accessToken, {
      fullName: userData?.name || "",
      userImage: url,
    });

    if (response.status === 200) {
      dispatch(login({...userData, image: url || undefined}));
    } else {
      toast.error("Failed to update avatar");
    }

    navigate(0);
  };

  return (
    <div className="px-6">
      <h2 className="text-xl font-bold mb-10">Profile</h2>
      <div className="grid grid-cols-3 gap-6">
        {/* General info */}
        <div className="col-span-2 space-y-6">
          <div className="space-y-2">
            <p className="font-semibold">Fullname</p>
            <div className="flex space-x-4">
              <div className="px-2 space-x-2 w-full border border-slate-400 rounded-md flex items-center">
                <User size={20} />
                <input
                  className="w-full py-2 outline-none cursor-pointer"
                  autoFocus
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <button
                className="btn btn-neutral rounded-md"
                disabled={fullName === userData?.name}
                onClick={handleSaveFullName}
              >
                Save
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">Email</p>
            <p className="flex items-center space-x-2 border border-slate-400 bg-slate-100 p-2 rounded-md">
              <Mail size={20} />
              <span>{userData?.email}</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">Username</p>
            <p className="flex items-center space-x-2 border border-slate-400 bg-slate-100 p-2 rounded-md">
              <ShieldUser size={20} />
              <span>{userData?.username}</span>
            </p>
          </div>
        </div>
        {/* Image */}
        <div className="col-span-1 flex flex-col items-center space-y-4">
          <div className="w-56 h-56 border border-slate-300 rounded-md overflow-hidden">
            {!userData?.image && (
              <div className="w-full h-full flex flex-col space-y-2 justify-center items-center bg-slate-100 text-slate-500">
                <span>No avatar</span>
              </div>
            )}
            {userData?.image && (
              <img
                src={userData.image}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <button
            className="btn btn-neutral rounded-md w-56 space-x-2"
            onClick={() => setIsAvatarChoosing(true)}
          >
            <Camera size={20} />
            <span>Change avatar</span>
          </button>
          {userData?.image && (
            <button className="btn rounded-md w-56 space-x-2">
              <Trash2 size={20} />
              <span onClick={() => handleSaveAvatar("")}>Delete avatar</span>
            </button>
          )}
        </div>
        {/* Form change image */}
        {isAvatarChoosing && (
          <ProfileAvatarForm
            setIsFormOpen={setIsAvatarChoosing}
            handleSaveAvatar={handleSaveAvatar}
          />
        )}
      </div>
    </div>
  );
}
