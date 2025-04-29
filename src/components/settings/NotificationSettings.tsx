
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { SettingsFormValues } from "./types";

interface NotificationSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you want to receive notifications
        </p>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="text-sm font-medium mb-4">Notification Channels</h4>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="notifications.email"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Email Notifications</FormLabel>
                  <FormDescription>
                    Receive notifications via email
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notifications.push"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Push Notifications</FormLabel>
                  <FormDescription>
                    Receive notifications on your device
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="text-sm font-medium mb-4">Notification Types</h4>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="notifications.trading"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Trading Updates</FormLabel>
                  <FormDescription>
                    Notifications about trade executions and updates
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notifications.marketAlerts"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Market Alerts</FormLabel>
                  <FormDescription>
                    Get notified about significant market movements
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notifications.newFeatures"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>New Features</FormLabel>
                  <FormDescription>
                    Updates about new platform features and improvements
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
