
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

import { SettingsFormValues } from "@/components/settings/types";
import SettingsTabs from "@/components/settings/SettingsTabs";
import SettingsFooter from "@/components/settings/SettingsFooter";
import GeneralSettings from "@/components/settings/GeneralSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";

const UserSettings: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("general");
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm<SettingsFormValues>({
    defaultValues: {
      email: "user@example.com",
      username: "traderpro",
      displayName: "Crypto Trader",
      bio: "Professional crypto trader and analyst with 5+ years of experience.",
      darkMode: true,
      language: "en",
      timeZone: "UTC",
      layout: "default",
      theme: "dark",
      notifications: {
        email: true,
        push: true,
        trading: true,
        marketAlerts: true,
        newFeatures: false,
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
        highContrastMode: false,
      },
      account: {
        twoFactorEnabled: false,
        loginAlerts: true,
      },
      trading: {
        confirmTradeExecutions: true,
        showPriceAlerts: true,
        defaultTradingPair: "BTC/USD",
      },
      dashboardCustomization: {
        defaultCurrency: "USD",
        defaultTimeframe: "1d",
        alertVolume: 50,
        alertFrequency: "medium",
      },
      dataPrivacy: {
        shareAnalytics: true,
        storeHistory: true,
      },
      exportFormat: "csv",
    }
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Settings updated",
      description: "Your settings have been updated successfully.",
    });
    
    setIsSaving(false);
  });

  const handleReset = () => {
    form.reset();
    toast({
      title: "Settings reset",
      description: "Your settings have been reset to defaults.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Settings</CardTitle>
        <CardDescription>
          Configure your account settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab}>
          <SettingsTabs activeTab={activeTab} onTabChange={handleTabChange} />
          
          <form onSubmit={handleSubmit} className="mt-6">
            <TabsContent value="general">
              <GeneralSettings form={form} />
            </TabsContent>
            
            <TabsContent value="notifications">
              <NotificationSettings form={form} />
            </TabsContent>
            
            <TabsContent value="privacy">
              <PrivacySettings form={form} />
            </TabsContent>
            
            <TabsContent value="appearance">
              <AppearanceSettings form={form} />
            </TabsContent>
            
            <CardFooter className="flex px-0 pt-6">
              <SettingsFooter isSaving={isSaving} onReset={handleReset} />
            </CardFooter>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserSettings;
