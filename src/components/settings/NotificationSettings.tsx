
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const NotificationSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Email Notifications</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-trade-alerts">Trade Alerts</Label>
            <Switch id="email-trade-alerts" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="email-price-alerts">Price Alerts</Label>
            <Switch id="email-price-alerts" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="email-news">News Updates</Label>
            <Switch id="email-news" defaultChecked={false} />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="email-weekly-summary">Weekly Summary</Label>
            <Switch id="email-weekly-summary" defaultChecked />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Push Notifications</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="push-trade-alerts">Trade Alerts</Label>
            <Switch id="push-trade-alerts" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="push-price-alerts">Price Alerts</Label>
            <Switch id="push-price-alerts" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="push-news">News Updates</Label>
            <Switch id="push-news" defaultChecked={false} />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Frequency</h3>
        
        <div className="grid gap-2">
          <Label htmlFor="notification-frequency">Alert Frequency</Label>
          <Select defaultValue="immediate">
            <SelectTrigger id="notification-frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="hourly">Hourly Digest</SelectItem>
              <SelectItem value="daily">Daily Digest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
