import {useState} from "react";
import {Save, RefreshCw} from "lucide-react";

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  adminEmail: string;
  maxFileSize: number;
  allowRegistration: boolean;
  enableNotifications: boolean;
  maintenanceMode: boolean;
}

const defaultSettings: SystemSettings = {
  siteName: "Edtech CMS",
  siteDescription:
    "A modern content management system for educational technology",
  adminEmail: "admin@edtech.com",
  maxFileSize: 5,
  allowRegistration: true,
  enableNotifications: true,
  maintenanceMode: false,
};

export default function Settings() {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const savedSettings = localStorage.getItem("cms_settings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  const [isSaving, setSisSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleInputChange = (
    field: keyof SystemSettings,
    value: string | number | boolean,
  ) => {
    setSettings((prev) => ({...prev, [field]: value}));
    setSaveMessage(""); // Clear save message when user makes changes
  };

  const handleSave = async () => {
    setSisSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      localStorage.setItem("cms_settings", JSON.stringify(settings));
      setSaveMessage("Settings saved successfully!");

      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Error saving settings. Please try again.");
    } finally {
      setSisSaving(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSettings(defaultSettings);
      localStorage.setItem("cms_settings", JSON.stringify(defaultSettings));
      setSaveMessage("Settings reset to default values!");

      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Error resetting settings. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your system configuration and preferences
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            disabled={isResetting || isSaving}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isResetting ? "animate-spin" : ""}`}
            />
            Reset to Default
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || isResetting}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div
          className={`p-4 rounded-lg ${
            saveMessage.includes("Error")
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {saveMessage}
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          {/* General Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              General Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) =>
                    handleInputChange("siteName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter site name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) =>
                    handleInputChange("adminEmail", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter admin email"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Description
              </label>
              <textarea
                rows={3}
                value={settings.siteDescription}
                onChange={(e) =>
                  handleInputChange("siteDescription", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Enter site description"
              />
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* File Upload Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              File Upload Settings
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum File Size (MB)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.maxFileSize}
                onChange={(e) =>
                  handleInputChange(
                    "maxFileSize",
                    parseInt(e.target.value) || 1,
                  )
                }
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Maximum file size allowed for uploads (1-100 MB)
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* System Preferences */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              System Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Allow User Registration
                  </label>
                  <p className="text-xs text-gray-500">
                    Allow new users to register for accounts
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowRegistration}
                    onChange={(e) =>
                      handleInputChange("allowRegistration", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Enable Notifications
                  </label>
                  <p className="text-xs text-gray-500">
                    Send email notifications for important events
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableNotifications}
                    onChange={(e) =>
                      handleInputChange("enableNotifications", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Maintenance Mode
                  </label>
                  <p className="text-xs text-gray-500">
                    Put the site in maintenance mode for updates
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) =>
                      handleInputChange("maintenanceMode", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
