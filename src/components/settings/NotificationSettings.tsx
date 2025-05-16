
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
        trades: true,
        pricing: true,
        news: false,
        priceAlerts: true
      };
      
      // Update form with notification defaults
      form.setValue("notifications", notificationsDefaults);
    }
  }, [form]);
  
  // Get current values safely 
  const notificationsValues = React.useMemo(() => {
    const values = form.getValues().notifications || {
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
                checked={notificationsValues.email}
                onCheckedChange={(checked) => {
                  form.setValue("notifications", {
                    ...notificationsValues,
                    email: checked
                  });
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
                checked={notificationsValues.push}
                onCheckedChange={(checked) => {
                  form.setValue("notifications", {
                    ...notificationsValues,
                    push: checked
                  });
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
                  form.setValue("notifications", {
                    ...notificationsValues,
                    trades: checked
                  });
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
                  form.setValue("notifications", {
                    ...notificationsValues,
                    pricing: checked
                  });
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
                  form.setValue("notifications", {
                    ...notificationsValues,
                    news: checked
                  });
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
                  form.setValue("notifications", {
                    ...notificationsValues,
                    priceAlerts: checked
                  });
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
