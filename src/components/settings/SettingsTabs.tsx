
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";

interface SettingsTabsProps {
  activeTab: string;
  onTabChange?: (value: string) => void;
}

const SettingsTabs = ({ activeTab, onTabChange }: SettingsTabsProps) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  return (
    <TabsList className={isMobile ? "grid grid-cols-2 mb-4" : "grid grid-cols-4 mb-4"}>
      <TabsTrigger 
        value="general" 
        onClick={() => onTabChange && onTabChange("general")}
        data-state={activeTab === "general" ? "active" : "inactive"}
      >
        General
      </TabsTrigger>
      <TabsTrigger 
        value="appearance" 
        onClick={() => onTabChange && onTabChange("appearance")}
        data-state={activeTab === "appearance" ? "active" : "inactive"}
      >
        Appearance
      </TabsTrigger>
      <TabsTrigger 
        value="notifications" 
        onClick={() => onTabChange && onTabChange("notifications")}
        data-state={activeTab === "notifications" ? "active" : "inactive"}
      >
        Notifications
      </TabsTrigger>
      <TabsTrigger 
        value="data" 
        onClick={() => onTabChange && onTabChange("data")}
        data-state={activeTab === "data" ? "active" : "inactive"}
      >
        Data & Privacy
      </TabsTrigger>
    </TabsList>
  );
};

export default SettingsTabs;
