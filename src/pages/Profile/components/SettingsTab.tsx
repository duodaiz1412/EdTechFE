import {SettingItem} from "@/types";

type Props = {
  accountSettings: SettingItem[];
  learningSettings: SettingItem[];
  dangerSettings: SettingItem[];
};

export default function SettingsTab({
  accountSettings,
  learningSettings,
  dangerSettings,
}: Props) {
  const renderSettingsGroup = (settings: SettingItem[], title: string) => (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <div className="space-y-4">
          {settings.map((setting, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p
                  className={`font-medium ${setting.variant === "destructive" ? "text-error" : ""}`}
                >
                  {setting.title}
                </p>
                <p className="text-sm text-base-content/70">
                  {setting.description}
                </p>
              </div>
              <button
                className={`btn btn-sm ${setting.variant === "destructive" ? "btn-error" : "btn-outline"}`}
              >
                {setting.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-base-content">Settings</h2>

      <div className="grid gap-6">
        {renderSettingsGroup(accountSettings, "Account Settings")}
        {renderSettingsGroup(learningSettings, "Learning Preferences")}
        {renderSettingsGroup(dangerSettings, "Danger Zone")}
      </div>
    </div>
  );
}
