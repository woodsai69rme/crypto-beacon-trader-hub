
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface NotificationSettingsProps {
  form?: any;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ form }) => {
  const [emailSettings, setEmailSettings] = useState({
    tradeAlerts: true,
    priceAlerts: true,
    news: false,
    weeklySummary: true
  });

  const [pushSettings, setPushSettings] = useState({
    tradeAlerts: true,
    priceAlerts: true,
    news: false
  });

  const [frequency, setFrequency] = useState("immediate");

  const handleEmailSettingChange = (setting: keyof typeof emailSettings) => {
    setEmailSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePushSettingChange = (setting: keyof typeof pushSettings) => {
    setPushSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Email Notifications</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-trade-alerts">Trade Alerts</Label>
            <Switch 
              id="email-trade-alerts" 
              checked={emailSettings.tradeAlerts}
              onCheckedChange={() => handleEmailSettingChange("tradeAlerts")}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="email-price-alerts">Price Alerts</Label>
            <Switch 
              id="email-price-alerts" 
              checked={emailSettings.priceAlerts}
              onCheckedChange={() => handleEmailSettingChange("priceAlerts")}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="email-news">News Updates</Label>
            <Switch 
              id="email-news" 
              checked={emailSettings.news}
              onCheckedChange={() => handleEmailSettingChange("news")}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="email-weekly-summary">Weekly Summary</Label>
            <Switch 
              id="email-weekly-summary" 
              checked={emailSettings.weeklySummary}
              onCheckedChange={() => handleEmailSettingChange("weeklySummary")}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Push Notifications</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="push-trade-alerts">Trade Alerts</Label>
            <Switch 
              id="push-trade-alerts" 
              checked={pushSettings.tradeAlerts}
              onCheckedChange={() => handlePushSettingChange("tradeAlerts")}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="push-price-alerts">Price Alerts</Label>
            <Switch 
              id="push-price-alerts" 
              checked={pushSettings.priceAlerts}
              onCheckedChange={() => handlePushSettingChange("priceAlerts")}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="push-news">News Updates</Label>
            <Switch 
              id="push-news" 
              checked={pushSettings.news}
              onCheckedChange={() => handlePushSettingChange("news")}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Frequency</h3>
        
        <div className="grid gap-2">
          <Label htmlFor="notification-frequency">Alert Frequency</Label>
          <Select
            value={frequency}
            onValueChange={setFrequency}
          >
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
