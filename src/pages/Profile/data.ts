import {User, BookOpen, BarChart3, Settings} from "lucide-react";
import {
  UserInfo,
  MenuItem,
  ProfileCourse,
  WeeklyProgress,
  SettingItem,
} from "@/types";

export const initialUserInfo: UserInfo = {
  name: "John Doe",
  title: "Full Stack Developer",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
};

export const menuItems: MenuItem[] = [
  {id: "my-info", label: "My Info", icon: User},
  {id: "courses", label: "Courses", icon: BookOpen},
  {id: "statistics", label: "Statistics", icon: BarChart3},
  {id: "settings", label: "Settings", icon: Settings},
];

export const courses: ProfileCourse[] = [
  {
    id: "1",
    title: "React Advanced Patterns",
    status: "In Progress",
    progress: 75,
    hoursRemaining: 8,
    students: 1234,
    modules: {total: 8, completed: 6},
  },
  {
    id: "2",
    title: "TypeScript Fundamentals",
    status: "Completed",
    progress: 100,
    hoursCompleted: 12,
    certificate: true,
    modules: {total: 10, completed: 10},
  },
  {
    id: "3",
    title: "Node.js Backend Development",
    status: "Not Started",
    progress: 0,
    hoursRemaining: 15,
    students: 892,
    modules: {total: 12, completed: 0},
  },
];

export const weeklyProgress: WeeklyProgress[] = [
  {day: "Monday", hours: 2.4, progress: 80},
  {day: "Tuesday", hours: 1.8, progress: 60},
  {day: "Wednesday", hours: 3.0, progress: 100},
  {day: "Thursday", hours: 1.2, progress: 40},
  {day: "Friday", hours: 2.7, progress: 90},
];

export const accountSettings: SettingItem[] = [
  {
    title: "Email Notifications",
    description: "Receive updates about your courses",
    value: "enabled",
    action: "Configure",
  },
  {
    title: "Privacy Settings",
    description: "Control who can see your profile",
    value: "public",
    action: "Manage",
  },
  {
    title: "Language",
    description: "Choose your preferred language",
    value: "english",
    action: "English",
  },
];

export const learningSettings: SettingItem[] = [
  {
    title: "Daily Goal",
    description: "Set your daily learning target",
    value: "2 hours",
    action: "2 hours",
  },
  {
    title: "Difficulty Level",
    description: "Adjust content difficulty",
    value: "intermediate",
    action: "Intermediate",
  },
  {
    title: "Auto-play Videos",
    description: "Automatically play next video",
    value: "enabled",
    action: "Enabled",
  },
];

export const dangerSettings: SettingItem[] = [
  {
    title: "Delete Account",
    description: "Permanently delete your account and all data",
    value: "danger",
    action: "Delete",
    variant: "destructive",
  },
];
