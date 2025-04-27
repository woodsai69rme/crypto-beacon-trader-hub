
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ChevronUp, ChevronDown } from "lucide-react";
import GeneralSettings from "./settings/GeneralSettings";
import NotificationSettings from "./settings/NotificationSettings";
import DataPrivacySettings from "./settings/DataPrivacySettings";
import AppearanceSettings from "./settings/AppearanceSettings";
import SettingsTabs from "./settings/SettingsTabs";
import SettingsFooter from "./settings/SettingsFooter";
import { SettingsFormValues } from "./settings/types";

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isSaving, setIsSaving] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
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

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>User Settings</CardTitle>
        <Button variant="ghost" size="sm" onClick={toggleCollapsed} className="h-8 w-8 p-0">
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </CardHeader>
      {!isCollapsed && (
        <CardContent>
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
        </CardContent>
      )}
    </Card>
  );
};

export default UserSettings;
