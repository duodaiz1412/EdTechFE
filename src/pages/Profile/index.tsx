"use client";

import {useState} from "react";
import {
  ProfileSidebar,
  MyInfoTab,
  CoursesTab,
  StatisticsTab,
  SettingsTab,
} from "./components";
import {
  menuItems,
  courses,
  weeklyProgress,
  accountSettings,
  learningSettings,
  dangerSettings,
} from "./data";
import {UserInfo} from "@/types";
import useAuth from "@/hooks/useAuth";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("my-info");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const {user} = useAuth();

  // Tạo userInfo từ dữ liệu user thật
  const userInfo: UserInfo = {
    name: user?.fullName || "Chưa cập nhật",
    title:
      user?.userType === "WEBSITE_USER"
        ? "Học viên"
        : user?.userType || "Chưa cập nhật",
    email: user?.email || "Chưa cập nhật",
    phone: "Chưa cập nhật", // Chưa có trong API
    location: "Chưa cập nhật", // Chưa có trong API
  };

  const handleUpdateUserInfo = (field: string, value: string) => {
    // TODO: Implement API call to update user info
    // eslint-disable-next-line no-console
    console.log(`Update ${field} to ${value}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "my-info":
        return (
          <MyInfoTab
            userInfo={userInfo}
            onUpdateUserInfo={handleUpdateUserInfo}
          />
        );
      case "courses":
        return <CoursesTab courses={courses} />;
      case "statistics":
        return (
          <StatisticsTab totalHours={156} weeklyProgress={weeklyProgress} />
        );
      case "settings":
        return (
          <SettingsTab
            accountSettings={accountSettings}
            learningSettings={learningSettings}
            dangerSettings={dangerSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-base-100">
      <ProfileSidebar
        menuItems={menuItems}
        activeTab={activeTab}
        sidebarCollapsed={sidebarCollapsed}
        onTabChange={setActiveTab}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{renderContent()}</div>
      </div>
    </div>
  );
}
