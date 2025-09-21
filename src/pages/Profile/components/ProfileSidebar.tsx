import {Menu, X} from "lucide-react";
import {MenuItem} from "@/types";

type Props = {
  menuItems: MenuItem[];
  activeTab: string;
  sidebarCollapsed: boolean;
  onTabChange: (tabId: string) => void;
  onToggleSidebar: () => void;
};

export default function ProfileSidebar({
  menuItems,
  activeTab,
  sidebarCollapsed,
  onTabChange,
  onToggleSidebar,
}: Props) {
  return (
    <div
      className={`${sidebarCollapsed ? "w-16" : "w-64"} bg-base-200 border-r border-base-300 transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold text-base-content">Edtech</h1>
          )}
          <button
            onClick={onToggleSidebar}
            className="btn btn-ghost btn-sm text-base-content hover:bg-base-300"
          >
            {sidebarCollapsed ? (
              <Menu className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-content"
                      : "text-base-content hover:bg-base-300 hover:text-base-content"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
