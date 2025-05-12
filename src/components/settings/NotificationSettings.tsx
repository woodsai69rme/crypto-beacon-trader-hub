
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/types/trading";

interface NotificationSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ form }) => {
  const { register, setValue, watch } = form;

  const handleSwitchChange = (field: string, checked: boolean) => {
    setValue(field as any, checked, { shouldDirty: true });
  };
  
  const watchNotifications = watch('notifications');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications-email">Email Notifications</Label>
            <Switch 
              id="notifications-email" 
              checked={watchNotifications.email}
              onCheckedChange={(checked) => handleSwitchChange('notifications.email', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications-push">Push Notifications</Label>
            <Switch 
              id="notifications-push" 
              checked={watchNotifications.push}
              onCheckedChange={(checked) => handleSwitchChange('notifications.push', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications-trades">Trade Alerts</Label>
            <Switch 
              id="notifications-trades" 
              checked={watchNotifications.trades}
              onCheckedChange={(checked) => handleSwitchChange('notifications.trades', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications-pricing">Price Alerts</Label>
            <Switch 
              id="notifications-pricing" 
              checked={watchNotifications.pricing}
              onCheckedChange={(checked) => handleSwitchChange('notifications.pricing', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications-news">Market News</Label>
            <Switch 
              id="notifications-news" 
              checked={watchNotifications.news}
              onCheckedChange={(checked) => handleSwitchChange('notifications.news', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
