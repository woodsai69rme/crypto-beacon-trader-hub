
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AppearanceSettings from "./settings/AppearanceSettings";
import DataPrivacySettings from "./settings/DataPrivacySettings";
import GeneralSettings from "./settings/GeneralSettings";
import NotificationSettings from "./settings/NotificationSettings";
import SettingsFooter from "./settings/SettingsFooter";
import SettingsTabs from "./settings/SettingsTabs";

// Define schema for settings form
const settingsFormSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  displayName: z.string().min(1).max(50),
  bio: z.string().max(160).optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    trading: z.boolean(),
    marketAlerts: z.boolean(),
    newFeatures: z.boolean(),
  }),
  privacy: z.object({
    publicProfile: z.boolean(),
    showPortfolio: z.boolean(),
    shareActivity: z.boolean(),
  }),
  appearance: z.object({
    theme: z.enum(["light", "dark", "system"]),
    compactView: z.boolean(),
    animationsEnabled: z.boolean(),
  }),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

// Initial form values
const defaultValues: SettingsFormValues = {
  email: "user@example.com",
  username: "cryptotrader",
  displayName: "Crypto Trader",
  bio: "Crypto enthusiast and trader",
  notifications: {
    email: true,
    push: true,
    trading: true,
    marketAlerts: true,
    newFeatures: true,
  },
  privacy: {
    publicProfile: false,
    showPortfolio: false,
    shareActivity: true,
  },
  appearance: {
    theme: "system",
    compactView: false,
    animationsEnabled: true,
  },
};

interface SettingsFormProps {
  form: UseFormReturn<SettingsFormValues>;
}

// Modified SettingsTabs to accept form props
const EnhancedSettingsTabs: React.FC<SettingsFormProps> = ({ form }) => {
  return <SettingsTabs />;
};

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  });
  
  const handleSaveSettings = async (values: SettingsFormValues) => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Save to local storage for demo purposes
      localStorage.setItem('user_settings', JSON.stringify(values));
      
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Load settings from local storage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('user_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        Object.keys(parsedSettings).forEach(key => {
          form.setValue(key as any, parsedSettings[key]);
        });
      } catch (error) {
        console.error("Error parsing saved settings:", error);
      }
    }
  }, [form]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Account Settings</h2>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>
      </div>
      
      <form onSubmit={form.handleSubmit(handleSaveSettings)}>
        <Card>
          <CardHeader className="pb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 md:grid-cols-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="security" className="hidden md:block">Security</TabsTrigger>
                <TabsTrigger value="advanced" className="hidden md:block">Advanced</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="space-y-4">
            <TabsContent value="general">
              <GeneralSettings form={form} />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationSettings form={form} />
            </TabsContent>
            <TabsContent value="privacy">
              <DataPrivacySettings form={form} />
            </TabsContent>
            <TabsContent value="appearance">
              <AppearanceSettings form={form} />
            </TabsContent>
            <TabsContent value="security">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security Settings</h3>
                <p className="text-muted-foreground">Manage your account security settings</p>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="2fa">Two-factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch id="2fa" />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="advanced">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Advanced Settings</h3>
                <p className="text-muted-foreground">Configure advanced features and options</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>API Access</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable API access for third-party applications
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Developer Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable advanced features for developers
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <Separator />
                  
                  <div className="pt-4">
                    <Button variant="destructive">Delete Account</Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      This will permanently delete your account and all associated data
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
          <CardFooter>
            <SettingsFooter 
              isSaving={isSaving} 
              onReset={() => form.reset()} 
            />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default UserSettings;
