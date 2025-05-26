
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Database } from "lucide-react";
import GeneralSettings from "../settings/GeneralSettings";
import NotificationSettings from "../settings/NotificationSettings";
import PrivacySettings from "../settings/PrivacySettings";
import ThemeSwitcher from "../settings/ThemeSwitcher";
import ApiKeyManagement from "../ApiKeyManagement";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardSettings = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-6'} mb-6`}>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          {!isMobile && (
            <>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </>
          )}
          {isMobile && <TabsTrigger value="more">More</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="general" className="animate-fade-in">
          <GeneralSettings />
        </TabsContent>
        
        <TabsContent value="notifications" className="animate-fade-in">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="privacy" className="animate-fade-in">
          <PrivacySettings />
        </TabsContent>
        
        <TabsContent value="appearance" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ThemeSwitcher />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="animate-fade-in">
          <ApiKeyManagement />
        </TabsContent>
        
        <TabsContent value="advanced" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <SettingsIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Advanced settings coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {isMobile && (
          <TabsContent value="more" className="animate-fade-in">
            <Tabs defaultValue="appearance">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="api">API Keys</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Appearance Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ThemeSwitcher />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="api">
                <ApiKeyManagement />
              </TabsContent>
              
              <TabsContent value="advanced">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <SettingsIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Advanced settings coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default DashboardSettings;
