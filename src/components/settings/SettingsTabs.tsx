
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Settings as SettingsIcon 
} from "lucide-react";

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <TabsList className="grid grid-cols-4 w-full">
      <TabsTrigger
        value="general"
        onClick={() => onTabChange("general")}
        className="flex items-center gap-2"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">General</span>
      </TabsTrigger>
      <TabsTrigger
        value="notifications"
        onClick={() => onTabChange("notifications")}
        className="flex items-center gap-2"
      >
        <Bell className="h-4 w-4" />
        <span className="hidden sm:inline">Notifications</span>
      </TabsTrigger>
      <TabsTrigger
        value="privacy"
        onClick={() => onTabChange("privacy")}
        className="flex items-center gap-2"
      >
        <Shield className="h-4 w-4" />
        <span className="hidden sm:inline">Privacy</span>
      </TabsTrigger>
      <TabsTrigger
        value="appearance"
        onClick={() => onTabChange("appearance")}
        className="flex items-center gap-2"
      >
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">Appearance</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default SettingsTabs;
