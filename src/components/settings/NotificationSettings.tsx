
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./types";

interface NotificationSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you'd like to receive notifications
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="email-notifications" className="block">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive important alerts via email</p>
          </div>
          <Switch
            id="email-notifications"
            checked={form.watch("notifications.email")}
            onCheckedChange={(checked) => form.setValue("notifications.email", checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="push-notifications" className="block">Push Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive real-time alerts in your browser</p>
          </div>
          <Switch
            id="push-notifications"
            checked={form.watch("notifications.push")}
            onCheckedChange={(checked) => form.setValue("notifications.push", checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="app-notifications" className="block">In-App Notifications</Label>
            <p className="text-sm text-muted-foreground">Show notifications within the application</p>
          </div>
          <Switch
            id="app-notifications"
            checked={form.watch("notifications.inApp")}
            onCheckedChange={(checked) => form.setValue("notifications.inApp", checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="alert-sounds" className="block">Alert Sounds</Label>
            <p className="text-sm text-muted-foreground">Play sounds for important notifications</p>
          </div>
          <Switch
            id="alert-sounds"
            checked={form.watch("notifications.sound")}
            onCheckedChange={(checked) => form.setValue("notifications.sound", checked)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Notification Frequency</Label>
        <Select
          value={form.watch("notifications.frequency")}
          onValueChange={(value) => form.setValue("notifications.frequency", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select notification frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="realtime">Real-time</SelectItem>
            <SelectItem value="hourly">Hourly Digest</SelectItem>
            <SelectItem value="daily">Daily Summary</SelectItem>
            <SelectItem value="weekly">Weekly Roundup</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Price Alert Sensitivity</Label>
        <Select
          value={form.watch("priceAlerts.sensitivity")}
          onValueChange={(value) => form.setValue("priceAlerts.sensitivity", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select price alert sensitivity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low (10% changes)</SelectItem>
            <SelectItem value="medium">Medium (5% changes)</SelectItem>
            <SelectItem value="high">High (2% changes)</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default NotificationSettings;
