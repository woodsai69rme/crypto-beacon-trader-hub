
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import GeneralSettings from "./settings/GeneralSettings";
import NotificationSettings from "./settings/NotificationSettings";
import DataPrivacySettings from "./settings/DataPrivacySettings";
import AppearanceSettings from "./settings/AppearanceSettings";
import SettingsTabs from "./settings/SettingsTabs";
import SettingsFooter from "./settings/SettingsFooter";
import { SettingsFormValues } from "./settings/types";
import CollapsibleCard from "./CollapsibleCard";

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<SettingsFormValues>({
    defaultValues: {
      email: "user@example.com",
      username: "cryptotrader",
      displayName: "Crypto Trader",
      bio: "Passionate about cryptocurrency trading and blockchain technology.",
      darkMode: true, 
      language: "en",
      timeZone: "UTC",
      layout: "default",
      theme: "system",
      notifications: {
        email: true,
        push: true,
        trading: true,
        marketAlerts: true,
        newFeatures: true,
      },
      privacy: {
        publicProfile: true,
        showPortfolio: false,
        shareActivity: true,
      },
      appearance: {
        compactMode: false,
        animationsEnabled: true,
        showTradingHistory: true,
        showPortfolioChart: true,
        highContrastMode: false
      },
      account: {
        twoFactorEnabled: false,
        loginAlerts: true
      },
      trading: {
        confirmTradeExecutions: true,
        showPriceAlerts: true,
        defaultTradingPair: "BTC/USD"
      },
      dashboardCustomization: {
        defaultCurrency: "USD",
        defaultTimeframe: "1W",
        alertVolume: 50,
        alertFrequency: "medium"
      },
      dataPrivacy: {
        shareAnalytics: true,
        storeHistory: true
      },
      exportFormat: "json"
    }
  });
  
  const handleSave = async (data: SettingsFormValues) => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Settings saved:", data);
    
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved successfully",
    });
    
    setIsSaving(false);
  };
  
  const handleReset = () => {
    form.reset();
    
    toast({
      title: "Settings reset",
      description: "Your settings have been reset to default values",
    });
  };

  return (
    <CollapsibleCard 
      title="User Settings" 
      defaultCollapsed={true}  // Changed to true to make it collapsed by default
      collapseBelow="md"
      className="w-full"
    >
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
        <SettingsTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="general" className="space-y-6">
            <GeneralSettings form={form} />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings form={form} />
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
            <DataPrivacySettings form={form} />
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <AppearanceSettings form={form} />
          </TabsContent>
        </Tabs>
        
        <SettingsFooter 
          isSaving={isSaving} 
          onReset={handleReset} 
        />
      </form>
    </CollapsibleCard>
  );
};

export default UserSettings;
