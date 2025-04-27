
import { useState, useCallback } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query";
import SettingsTabs from "./settings/SettingsTabs";
import SettingsFooter from "./settings/SettingsFooter";
import GeneralSettings from "./settings/GeneralSettings";
import AppearanceSettings from "./settings/AppearanceSettings";
import NotificationSettings from "./settings/NotificationSettings";
import DataPrivacySettings from "./settings/DataPrivacySettings";
import { SettingsFormValues, SettingsTab } from "./settings/types";

interface UserSettingsProps {
  className?: string;
}

const defaultSettings: SettingsFormValues = {
  darkMode: true,
  notifications: true,
  language: "en",
  layout: "default",
  timeZone: "UTC",
  exportFormat: "csv",
  alertVolume: 70,
  alertFrequency: "medium",
  dataPrivacy: {
    shareAnalytics: true,
    storeHistory: true,
    autoDeleteData: false,
    dataRetentionPeriod: "90days"
  },
  dashboardCustomization: {
    showPortfolioValue: true,
    defaultCurrency: "USD",
    defaultTimeframe: "1M",
    defaultChartType: "line",
    chartColors: "default"
  },
  security: {
    enableTwoFactor: false,
    autoLock: false,
    lockTimeout: 15
  }
};

const UserSettings = ({ className }: UserSettingsProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  // Load saved settings from localStorage or use defaults
  const getSavedSettings = useCallback(() => {
    try {
      const savedSettings = localStorage.getItem("userSettings");
      if (savedSettings) {
        return { ...defaultSettings, ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      console.error("Failed to load saved settings:", error);
    }
    return defaultSettings;
  }, []);
  
  const form = useForm<SettingsFormValues>({
    defaultValues: getSavedSettings()
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value as SettingsTab);
  };

  const handleCancel = () => {
    form.reset(getSavedSettings());
    setOpen(false);
  };

  const onSubmit = (data: SettingsFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // In a real application, save these settings to a database or localStorage
        localStorage.setItem("userSettings", JSON.stringify(data));
        toast({
          title: "Settings updated",
          description: "Your preferences have been saved successfully.",
          variant: "default"
        });
        setOpen(false);
      } catch (error) {
        toast({
          title: "Error saving settings",
          description: "Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (isOpen) {
        form.reset(getSavedSettings());
      }
      setOpen(isOpen);
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Settings className="h-4 w-4 mr-2" />
          <span>Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className={isMobile ? "w-[95vw] max-w-none" : "sm:max-w-[625px]"}>
        <DialogHeader>
          <DialogTitle>User Settings</DialogTitle>
          <DialogDescription>
            Customize your dashboard experience and preferences
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="general" value={activeTab} onValueChange={handleTabChange}>
          <SettingsTabs activeTab={activeTab} onTabChange={handleTabChange} />
        
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TabsContent value="general">
                <GeneralSettings form={form} />
              </TabsContent>
              
              <TabsContent value="appearance">
                <AppearanceSettings form={form} />
              </TabsContent>
              
              <TabsContent value="notifications">
                <NotificationSettings form={form} />
              </TabsContent>
              
              <TabsContent value="data">
                <DataPrivacySettings form={form} />
              </TabsContent>
              
              <SettingsFooter onCancel={handleCancel} isSubmitting={isSubmitting} />
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettings;
