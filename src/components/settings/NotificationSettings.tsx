
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import { SettingsComponentProps } from './types';

const NotificationSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  // Initialize notifications object if it doesn't exist
  React.useEffect(() => {
    const formValues = form.getValues();
    
    if (!formValues.notifications) {
      const notificationsDefaults = {
        enablePush: true,
        enableEmail: true,
        alertPrice: true,
        alertNews: false,
        email: true,
        push: true,
        trades: true,
        pricing: true,
        news: false,
        priceAlerts: true
      };
      
      // Update form with notification defaults
      form.setValue("notifications", notificationsDefaults, { shouldValidate: false });
    }
  }, [form]);
  
  // Get current values safely 
  const notificationsValues = React.useMemo(() => {
    const values = form.getValues().notifications || {
      enablePush: true,
      enableEmail: true,
      alertPrice: true,
      alertNews: false,
      email: true,
      push: true,
      trades: true,
      pricing: true,
      news: false,
      priceAlerts: true
    };
    return values;
  }, [form]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Control what notifications you receive and how they're delivered
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Notification Channels</h3>
          
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Email Notifications</FormLabel>
              <FormDescription>
                Receive important updates via email
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={notificationsValues.enableEmail}
                onCheckedChange={(checked) => {
                  form.setValue("notifications.enableEmail", checked, { shouldValidate: false });
                  form.setValue("notifications.email", checked, { shouldValidate: false });
                }}
              />
            </FormControl>
          </FormItem>
          
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Push Notifications</FormLabel>
              <FormDescription>
                Receive real-time alerts on your device
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={notificationsValues.enablePush}
                onCheckedChange={(checked) => {
                  form.setValue("notifications.enablePush", checked, { shouldValidate: false });
                  form.setValue("notifications.push", checked, { shouldValidate: false });
                }}
              />
            </FormControl>
          </FormItem>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Notification Categories</h3>
          
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Trade Notifications</FormLabel>
              <FormDescription>
                Alerts about completed trades and orders
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={notificationsValues.trades || false}
                onCheckedChange={(checked) => {
                  form.setValue("notifications.trades", checked, { shouldValidate: false });
                }}
              />
            </FormControl>
          </FormItem>
          
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Price Change Alerts</FormLabel>
              <FormDescription>
                Notifications about significant price changes
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={notificationsValues.pricing || false}
                onCheckedChange={(checked) => {
                  form.setValue("notifications.pricing", checked, { shouldValidate: false });
                  form.setValue("notifications.alertPrice", checked, { shouldValidate: false });
                }}
              />
            </FormControl>
          </FormItem>
          
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Market News</FormLabel>
              <FormDescription>
                Important market news and updates
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={notificationsValues.news || false}
                onCheckedChange={(checked) => {
                  form.setValue("notifications.news", checked, { shouldValidate: false });
                  form.setValue("notifications.alertNews", checked, { shouldValidate: false });
                }}
              />
            </FormControl>
          </FormItem>
          
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Custom Price Alerts</FormLabel>
              <FormDescription>
                Alerts when assets hit your set price targets
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={notificationsValues.priceAlerts || false}
                onCheckedChange={(checked) => {
                  form.setValue("notifications.priceAlerts", checked, { shouldValidate: false });
                }}
              />
            </FormControl>
          </FormItem>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
