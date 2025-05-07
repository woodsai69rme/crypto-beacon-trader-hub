
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { UseFormReturn } from "react-hook-form";

import NotificationSettings from "./NotificationSettings";
import AppearanceSettings from "./AppearanceSettings";
import PrivacySettings from "./PrivacySettings";
import TradingSettings from "./TradingSettings";
import { SettingsFormValues } from "./types";
import { User, Settings2, Bell, Shield, BarChart2, UserCircle } from "lucide-react";

interface SettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const Settings: React.FC<SettingsProps> = ({ form }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const onSubmit = async (data: SettingsFormValues) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully."
      });
      
      console.log("Settings saved:", data);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your settings.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="profile" className="flex items-center gap-1">
                  <UserCircle className="h-4 w-4" />
                  <span className="hidden md:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-1">
                  <Settings2 className="h-4 w-4" />
                  <span className="hidden md:inline">Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-1">
                  <Bell className="h-4 w-4" />
                  <span className="hidden md:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span className="hidden md:inline">Privacy</span>
                </TabsTrigger>
                <TabsTrigger value="trading" className="flex items-center gap-1">
                  <BarChart2 className="h-4 w-4" />
                  <span className="hidden md:inline">Trading</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="p-6">
                <TabsContent value="profile">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Profile Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your account information and public profile
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="font-medium">Email</label>
                          <Input 
                            {...form.register("email")}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="font-medium">Username</label>
                          <Input 
                            {...form.register("username")}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="font-medium">Display Name</label>
                          <Input 
                            {...form.register("displayName")}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="font-medium">Bio</label>
                          <Textarea 
                            {...form.register("bio")}
                            className="h-32"
                          />
                          <p className="text-xs text-muted-foreground">
                            Write a short description about yourself. This will be visible on your public profile.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="appearance">
                  <AppearanceSettings form={form} />
                </TabsContent>
                
                <TabsContent value="notifications">
                  <NotificationSettings form={form} />
                </TabsContent>
                
                <TabsContent value="privacy">
                  <PrivacySettings form={form} />
                </TabsContent>
                
                <TabsContent value="trading">
                  <TradingSettings form={form} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Settings;
