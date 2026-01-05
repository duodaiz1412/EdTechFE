import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Camera, Mail, ShieldUser, Trash2, User} from "lucide-react";

import {login} from "@/redux/slice/userSlice";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {userServices} from "@/lib/services/user.services";
import {getFileUrlFromMinIO} from "@/lib/services/upload.services";
import ProfileAvatarForm from "./ProfileAvatarForm";

export default function Profile() {
  const userData = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(userData?.name || "");
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [isAvatarChoosing, setIsAvatarChoosing] = useState(false);

  useEffect(() => {
    async function fetchAvatarUrl() {
      if (userData?.image) {
        const url = await getFileUrlFromMinIO(userData.image);
        setAvatarUrl(url.uploadUrl);
      }
    }
    fetchAvatarUrl();
  }, [userData?.image]);

  const handleSaveFullName = async () => {
    const accessToken = await getAccessToken();
    const response = await userServices.changeUserInfo(accessToken, {
      id: userData?.id || "",
      fullName: fullName,
      userImage: userData?.image || "",
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
      id: userData?.id || "",
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
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-slate-800">My Profile</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* General info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">
                Personal Information
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">
                  Full Name
                </label>
                <div className="flex gap-3">
                  <div className="px-4 py-2 w-full border border-slate-300 rounded-lg flex items-center gap-3 bg-white hover:border-slate-400 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                    <User size={20} className="text-slate-400" />
                    <input
                      className="w-full outline-none text-slate-700"
                      autoFocus
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <button
                    className="btn btn-neutral rounded-lg px-6 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                    disabled={fullName === userData?.name}
                    onClick={handleSaveFullName}
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">
                  Email Address
                </label>
                <div className="flex items-center gap-3 border border-slate-200 bg-slate-50 px-4 py-3 rounded-lg">
                  <Mail size={20} className="text-slate-400" />
                  <span className="text-slate-700">{userData?.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">
                  Username
                </label>
                <div className="flex items-center gap-3 border border-slate-200 bg-slate-50 px-4 py-3 rounded-lg">
                  <ShieldUser size={20} className="text-slate-400" />
                  <span className="text-slate-700">{userData?.username}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Avatar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col items-center space-y-5">
              <h3 className="text-lg font-semibold text-slate-700 self-start">
                Profile Picture
              </h3>

              <div className="w-48 h-48 border-2 border-slate-200 rounded-full overflow-hidden shadow-md">
                {!userData?.image ? (
                  <div className="w-full h-full flex flex-col gap-2 justify-center items-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                    <User size={48} />
                    <span className="text-sm">No avatar</span>
                  </div>
                ) : (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <button
                className="btn btn-neutral rounded-lg w-full flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                onClick={() => setIsAvatarChoosing(true)}
              >
                <Camera size={20} />
                <span>Change Avatar</span>
              </button>

              {userData?.image && (
                <button
                  className="btn btn-outline rounded-lg w-full flex items-center justify-center gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:scale-105 transition-transform"
                  onClick={() => handleSaveAvatar("")}
                >
                  <Trash2 size={20} />
                  <span>Delete Avatar</span>
                </button>
              )}
            </div>
          </div>
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
