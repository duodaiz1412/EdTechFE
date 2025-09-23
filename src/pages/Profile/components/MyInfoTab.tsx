import {useState} from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Edit,
  Save,
  XIcon,
  User,
  Shield,
} from "lucide-react";
import {UserInfo} from "@/types";
import useAuth from "@/hooks/useAuth";

type Props = {
  userInfo: UserInfo;
  onUpdateUserInfo: (field: string, value: string) => void;
};

export default function MyInfoTab({userInfo, onUpdateUserInfo}: Props) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const {user} = useAuth();

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveEdit = (field: string) => {
    onUpdateUserInfo(field, tempValue);
    setEditingField(null);
    setTempValue("");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue("");
  };

  const renderEditableField = (field: string, value: string, icon: any) => {
    const Icon = icon;
    const isEditing = editingField === field;

    return (
      <div className="flex items-center gap-3 group">
        <Icon className="w-4 h-4 text-base-content/70 flex-shrink-0" />
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="input input-bordered flex-1"
              autoFocus
            />
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => saveEdit(field)}
            >
              <Save className="w-3 h-3" />
            </button>
            <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>
              <XIcon className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between flex-1">
            <span>{value}</span>
            <button
              className="btn btn-ghost btn-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => startEditing(field, value)}
            >
              <Edit className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-20 h-20 bg-blue-600 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {userInfo.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="flex-1">
          <div className="group">
            {editingField === "name" ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="input input-bordered text-2xl font-bold"
                  autoFocus
                />
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => saveEdit("name")}
                >
                  <Save className="w-4 h-4" />
                </button>
                <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-base-content">
                  {userInfo.name}
                </h2>
                <button
                  className="btn btn-ghost btn-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => startEditing("name", userInfo.name)}
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="group">
            {editingField === "title" ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="input input-bordered text-base-content/70"
                  autoFocus
                />
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => saveEdit("title")}
                >
                  <Save className="w-4 h-4" />
                </button>
                <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <p className="text-base-content/70">{userInfo.title}</p>
                <button
                  className="btn btn-ghost btn-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => startEditing("title", userInfo.title)}
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-1">
            <div
              className={`badge ${user?.enabled ? "badge-success" : "badge-error"}`}
            >
              {user?.enabled ? "Đã kích hoạt" : "Chưa kích hoạt"}
            </div>
            <div className="badge badge-outline">
              {user?.userType === "WEBSITE_USER" ? "Học viên" : user?.userType}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title flex items-center gap-2">
              <Award className="w-5 h-5" />
              Personal Information
            </h3>
            <div className="space-y-4">
              {renderEditableField("email", userInfo.email, Mail)}
              {renderEditableField("phone", userInfo.phone, Phone)}
              {renderEditableField("location", userInfo.location, MapPin)}
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-base-content/70" />
                <span>Username: {user?.username || "Chưa cập nhật"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-base-content/70" />
                <span>
                  Hoạt động cuối:{" "}
                  {user?.lastActive
                    ? new Date(user.lastActive).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Chưa có thông tin"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-base-content/70" />
                <span>ID: {user?.id || "Chưa có thông tin"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Courses Completed</span>
                <div className="badge badge-outline">12</div>
              </div>
              <div className="flex justify-between items-center">
                <span>Certificates Earned</span>
                <div className="badge badge-outline">8</div>
              </div>
              <div className="flex justify-between items-center">
                <span>Study Streak</span>
                <div className="badge badge-outline">45 days</div>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Study Hours</span>
                <div className="badge badge-outline">156h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
