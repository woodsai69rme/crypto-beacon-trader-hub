
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsTabsProps {
  activeTab: string;
}

const SettingsTabs = ({ activeTab }: SettingsTabsProps) => {
  return (
    <TabsList className="grid grid-cols-4 mb-4">
      <TabsTrigger value="general">General</TabsTrigger>
      <TabsTrigger value="appearance">Appearance</TabsTrigger>
      <TabsTrigger value="notifications">Notifications</TabsTrigger>
      <TabsTrigger value="data">Data & Privacy</TabsTrigger>
    </TabsList>
  );
};

export default SettingsTabs;
