
import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import TickerSettings from '../settings/TickerSettings';
import SidebarSettings from '../settings/SidebarSettings';
import { useForm } from "react-hook-form";
import { SettingsFormValues } from "@/types/trading";

const DashboardTools: React.FC = () => {
  // Create a form for ticker settings
  const tickerSettingsForm = useForm<SettingsFormValues>({
    defaultValues: {
      notifications: {
        email: true,
        push: true,
        trades: true,
        pricing: true,
        news: false,
      },
      tradingPreferences: {
        autoConfirm: false,
        showAdvanced: true,
        defaultAsset: "BTC"
      },
      ticker: {
        enabled: true,
        position: "top",
        speed: 50,
        direction: "left",
        autoPause: false
      }
    }
  });
  
  const sidebarSettingsForm = useForm<SettingsFormValues>({
    defaultValues: {
      sidebar: {
        enabled: true,
        position: "left",
        collapsed: false,
        autoHide: true,
      }
    }
  });
  
  const handleTickerSettingsSubmit = (values: SettingsFormValues) => {
    console.log("Ticker settings updated", values);
    toast({
      title: "Settings Updated",
      description: "Ticker settings have been updated successfully"
    });
  };

  const handleSidebarSettingsSubmit = (values: SettingsFormValues) => {
    console.log("Sidebar settings updated", values);
    toast({
      title: "Settings Updated",
      description: "Sidebar settings have been updated successfully"
    });
  };
  
  return (
    <div className="space-y-6">
      <TickerSettings 
        form={tickerSettingsForm}
        onSave={handleTickerSettingsSubmit}
      />
      
      <SidebarSettings
        form={sidebarSettingsForm}
        onSave={handleSidebarSettingsSubmit}
      />
    </div>
  );
};

export default DashboardTools;
