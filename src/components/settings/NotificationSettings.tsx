
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";

const NotificationSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure how and when you want to receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Notification Channels</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-notify">Email Notifications</Label>
                </div>
                <Switch id="email-notify" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="browser-notify">Browser Notifications</Label>
                </div>
                <Switch id="browser-notify" checked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="mobile-notify">Mobile Push Notifications</Label>
                </div>
                <Switch id="mobile-notify" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="sms-notify">SMS Notifications</Label>
                </div>
                <Switch id="sms-notify" />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Event Types</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="price-alert">Price Alerts</Label>
                <Switch id="price-alert" checked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="news-alert">News Updates</Label>
                <Switch id="news-alert" checked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="portfolio-alert">Portfolio Changes</Label>
                <Switch id="portfolio-alert" checked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="trade-alert">Trade Execution</Label>
                <Switch id="trade-alert" checked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="security-alert">Security Alerts</Label>
                <Switch id="security-alert" checked />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 123 456 7890" />
              </div>
            </div>
          </div>
          
          <Button>Save Notification Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
