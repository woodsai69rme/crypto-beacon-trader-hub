
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, BellRing, Eye, Key } from 'lucide-react';
import { SettingsComponentProps, SettingsFormValues } from '@/components/settings/types';

const DashboardTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("notifications");
  
  const handleSaveSettings = (values: Partial<SettingsFormValues>) => {
    console.log("Saving settings:", values);
    // Here you would typically save these settings to a user's profile
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Dashboard Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="notifications">
              <BellRing className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="api-keys">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Eye className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications">
            <NotificationSettings 
              onSave={handleSaveSettings}
              defaultValues={{
                notifications: {
                  email: true,
                  push: true,
                  trades: true,
                  pricing: true,
                  news: false
                }
              }}
            />
          </TabsContent>
          
          <TabsContent value="api-keys">
            <ApiKeySettings />
          </TabsContent>
          
          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const NotificationSettings: React.FC<SettingsComponentProps> = ({ onSave, defaultValues }) => {
  const [notifications, setNotifications] = useState(defaultValues?.notifications || {
    email: true,
    push: true,
    trades: true,
    pricing: true,
    news: false
  });
  
  const handleToggle = (key: string, value: boolean) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    
    if (onSave) {
      onSave({ notifications: updated });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email">Email Notifications</Label>
            <div className="text-xs text-muted-foreground">
              Receive important updates via email
            </div>
          </div>
          <Switch 
            id="email"
            checked={notifications.email}
            onCheckedChange={(checked) => handleToggle('email', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push">Push Notifications</Label>
            <div className="text-xs text-muted-foreground">
              Receive alerts on your device
            </div>
          </div>
          <Switch 
            id="push"
            checked={notifications.push}
            onCheckedChange={(checked) => handleToggle('push', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="trades">Trade Alerts</Label>
            <div className="text-xs text-muted-foreground">
              Get notified about trade execution and orders
            </div>
          </div>
          <Switch 
            id="trades"
            checked={notifications.trades}
            onCheckedChange={(checked) => handleToggle('trades', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="pricing">Price Alerts</Label>
            <div className="text-xs text-muted-foreground">
              Receive alerts when prices reach your targets
            </div>
          </div>
          <Switch 
            id="pricing"
            checked={notifications.pricing}
            onCheckedChange={(checked) => handleToggle('pricing', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="news">News Alerts</Label>
            <div className="text-xs text-muted-foreground">
              Get notifications about important market news
            </div>
          </div>
          <Switch 
            id="news"
            checked={notifications.news}
            onCheckedChange={(checked) => handleToggle('news', checked)}
          />
        </div>
      </div>
    </div>
  );
};

const ApiKeySettings: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="apiKey">CoinGecko API Key</Label>
        <div className="flex">
          <Input id="apiKey" type="password" value="••••••••••••••••" readOnly className="flex-1" />
          <Button variant="outline" className="ml-2">Update</Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Last updated: 3 days ago
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="apiKey2">Binance API Key</Label>
        <div className="flex">
          <Input id="apiKey2" type="password" value="••••••••••••••••" readOnly className="flex-1" />
          <Button variant="outline" className="ml-2">Update</Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Last updated: 1 week ago
        </p>
      </div>
      
      <div className="mt-4">
        <Button variant="outline" className="w-full">
          <Key className="h-4 w-4 mr-2" />
          Add New API Key
        </Button>
      </div>
    </div>
  );
};

const AppearanceSettings: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Theme</Label>
        <div className="grid grid-cols-3 gap-2">
          <div className="border rounded p-3 cursor-pointer hover:bg-accent flex flex-col items-center">
            <div className="w-full h-10 bg-background border rounded mb-2"></div>
            <span className="text-xs">Light</span>
          </div>
          <div className="border rounded p-3 cursor-pointer hover:bg-accent flex flex-col items-center">
            <div className="w-full h-10 bg-slate-800 border rounded mb-2"></div>
            <span className="text-xs">Dark</span>
          </div>
          <div className="border rounded p-3 cursor-pointer hover:bg-accent flex flex-col items-center">
            <div className="w-full h-10 bg-gradient-to-r from-white to-slate-800 border rounded mb-2"></div>
            <span className="text-xs">System</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Dashboard Layout</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="border rounded p-3 cursor-pointer hover:bg-accent flex flex-col items-center">
            <div className="w-full h-10 flex mb-2">
              <div className="flex-1 bg-muted rounded-l"></div>
              <div className="flex-[3] bg-slate-100 dark:bg-slate-800 rounded-r"></div>
            </div>
            <span className="text-xs">Sidebar Left</span>
          </div>
          <div className="border rounded p-3 cursor-pointer hover:bg-accent flex flex-col items-center">
            <div className="w-full h-10 flex mb-2">
              <div className="flex-[3] bg-slate-100 dark:bg-slate-800 rounded-l"></div>
              <div className="flex-1 bg-muted rounded-r"></div>
            </div>
            <span className="text-xs">Sidebar Right</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Font Size</Label>
        <div className="flex items-center">
          <span className="text-xs mr-2">A</span>
          <Input type="range" min="80" max="120" defaultValue="100" className="w-full" />
          <span className="text-base ml-2">A</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardTools;
