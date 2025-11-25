import {adminServices} from "@/lib/services/admin.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {User} from "@/types";
import {useQueries} from "@tanstack/react-query";
import {
  ArrowLeft,
  Mail,
  PlusCircle,
  ShieldUser,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import {useState} from "react";
import {Link, useParams} from "react-router-dom";
import {toast} from "react-toastify";

const ROLES = [
  "SYSTEM_MANAGER",
  "MODERATOR",
  "COURSE_CREATOR",
  "BATCH_EVALUATOR",
  "LMS_STUDENT",
];

export default function UserDetail() {
  const {userId} = useParams();
  const [user, setUser] = useState<User>();
  const [fullName, setFullName] = useState("");

  const [currentRoles, setCurrentRoles] = useState<string[]>([]);
  const [isAddingRole, setIsAddingRole] = useState(false);

  const results = useQueries({
    queries: [
      {
        queryKey: ["user", userId],
        queryFn: async () => {
          const accessToken = await getAccessToken();
          const response = await adminServices.getUser(userId!, accessToken);
          setUser(response);
          setFullName(response.fullName || "");
          return response;
        },
      },
      {
        queryKey: ["userRoles", userId],
        queryFn: async () => {
          const accessToken = await getAccessToken();
          const roles = await adminServices.getUserRoles(accessToken, userId!);
          setCurrentRoles(roles);
          return roles;
        },
      },
    ],
  });

  const handleSaveFullName = async () => {
    const body = {
      ...user,
      fullName: fullName,
    };

    const accessToken = await getAccessToken();
    const response = await adminServices.updateUser(
      user?.id || "",
      body as User,
      accessToken,
    );

    if (response.status === 200) {
      toast.success("Fullname updated successfully");
    }
  };

  const handleAddRole = async (role: string) => {
    const accessToken = await getAccessToken();
    const response = await adminServices.addRoleToUser(
      accessToken,
      userId!,
      role,
    );

    if (response.status === 200) {
      setCurrentRoles((prev) => [...prev, role]);
      toast.success("Role added successfully");
    }
    setIsAddingRole(false);
  };

  const handleDeleteRole = async (role: string) => {
    const accessToken = await getAccessToken();
    const response = await adminServices.deleteRoleFromUser(
      accessToken,
      userId!,
      role,
    );

    if (response.status === 200) {
      setCurrentRoles((prev) => prev.filter((r) => r !== role));
      toast.success("Role deleted successfully");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        to="/users"
        className="inline-flex items-center space-x-2 mb-6 text-slate-600 hover:text-blue-600 transition-colors group"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="font-medium">Back to all users</span>
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
              {!user?.userImage ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  <UserIcon size={40} className="text-white" />
                </div>
              ) : (
                <img
                  src={user?.userImage}
                  alt={user?.fullName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {user?.fullName}
              </h1>
              <p className="text-slate-600 mt-1">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Full Name
            </label>
            <div className="flex gap-3">
              <input
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
              />
              <button
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-all shadow-sm hover:shadow"
                disabled={fullName === results[0].data?.fullName}
                onClick={handleSaveFullName}
              >
                Save
              </button>
            </div>
          </div>

          {/* User Type */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              User Type
            </label>
            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-700 font-medium">
                {user?.userType}
              </span>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Email Address
            </label>
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
              <Mail size={20} className="text-slate-400" />
              <span className="text-slate-700">{user?.email}</span>
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Username
            </label>
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
              <ShieldUser size={20} className="text-slate-400" />
              <span className="text-slate-700">{user?.username}</span>
            </div>
          </div>

          {/* Roles */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Roles
            </label>
            <div className="space-y-2">
              {currentRoles?.map((role: string) => (
                <div
                  key={role}
                  className="flex justify-between items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg group hover:border-slate-300 transition-colors"
                >
                  <span className="text-slate-700 font-medium">{role}</span>
                  <button
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    onClick={() => handleDeleteRole(role)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {currentRoles.length !== 5 && !isAddingRole && (
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium"
                onClick={() => setIsAddingRole(true)}
              >
                <PlusCircle size={20} />
                <span>Add role to user</span>
              </button>
            )}

            {isAddingRole && (
              <div className="p-6 rounded-lg border-2 border-blue-200 bg-blue-50 space-y-4">
                <h5 className="text-center text-lg font-semibold text-slate-800">
                  Select a role to add
                </h5>
                <div className="flex flex-wrap justify-center gap-3">
                  {ROLES.map((role: string) => {
                    if (!currentRoles.includes(role)) {
                      return (
                        <button
                          key={role}
                          className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all font-medium shadow-sm hover:shadow"
                          onClick={() => handleAddRole(role)}
                        >
                          {role}
                        </button>
                      );
                    }
                  })}
                </div>
                <button
                  className="w-full px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                  onClick={() => setIsAddingRole(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
