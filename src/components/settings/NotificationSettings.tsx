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
        email: true,
        push: true,
        priceAlerts: true,
        trades: true,
        pricing: true,
        news: false,
        enableEmail: true,
        enablePush: true,
        alertPrice: true,
        alertNews: false
      };
      
      // Update form with notification defaults
      form.setValue("notifications", notificationsDefaults, { shouldValidate: false });
    }
  }, [form]);
  
  // Get current values safely 
  const notificationsValues = React.useMemo(() => {
    const values = form.getValues().notifications || {
      email: true,
      push: true,
      priceAlerts: true,
      trades: true,
      pricing: true,
      news: false,
      enableEmail: true,
      enablePush: true,
      alertPrice: true,
      alertNews: false
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
                checked={notificationsValues.email || false}
                onCheckedChange={(checked) => {
                  form.setValue("notifications.email", checked, { shouldValidate: false });
                  // Instead of setting enableEmail directly, update notifications object
                  const updatedNotifications = { ...notificationsValues, email: checked, enableEmail: checked };
                  form.setValue("notifications", updatedNotifications, { shouldValidate: false });
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
                checked={notificationsValues.push || false}
                onCheckedChange={(checked) => {
                  form.setValue("notifications.push", checked, { shouldValidate: false });
                  // Instead of setting enablePush directly, update notifications object
                  const updatedNotifications = { ...notificationsValues, push: checked, enablePush: checked };
                  form.setValue("notifications", updatedNotifications, { shouldValidate: false });
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
                  // Update both properties in the notifications object
                  const updatedNotifications = { 
                    ...notificationsValues, 
                    pricing: checked, 
                    alertPrice: checked 
                  };
                  form.setValue("notifications", updatedNotifications, { shouldValidate: false });
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
                  // Update both properties in the notifications object
                  const updatedNotifications = { 
                    ...notificationsValues,
                    news: checked,
                    alertNews: checked 
                  };
                  form.setValue("notifications", updatedNotifications, { shouldValidate: false });
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
