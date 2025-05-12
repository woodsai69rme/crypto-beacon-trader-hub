
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUI } from "@/contexts/UIContext";
import { 
  Settings, 
  BellRing, 
  ApiIcon, 
  Palette, 
  Volume2, 
  Moon, 
  Sun, 
  CheckCircle, 
  Mail, 
  MessageSquare, 
  Command,
  Smartphone, 
  Laptop,
  Key
} from "lucide-react";

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const { themeSettings, updateThemeSettings } = useUI();
  
  // Notification settings
  const [whaleMoves, setWhaleMoves] = useState<boolean>(true);
  const [sentimentShifts, setSentimentShifts] = useState<boolean>(true);
  const [priceThresholds, setPriceThresholds] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [apiKeys, setApiKeys] = useState({
    coinmarketcap: '',
    binance: '',
    coingecko: ''
  });
  
  // Mock device data
  const connectedDevices = [
    { id: 'dev1', name: 'Chrome on Mac', type: 'browser', lastActive: '2023-05-12 08:32' },
    { id: 'dev2', name: 'iPhone 13', type: 'mobile', lastActive: '2023-05-11 19:45' }
  ];
  
  const handleSendTestNotification = (type: string) => {
    toast({
      title: "Test Notification Sent",
      description: `A test ${type} notification has been sent.`,
    });
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Customize your app preferences and notification settings
        </p>
      </div>
      
      <div className="space-y-6">
        <Tabs defaultValue="notifications">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 mb-6">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="api">API Settings</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellRing className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure which notifications you want to receive and how
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Event Settings</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="whale-moves">Whale Moves</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when large wallet transactions occur
                      </p>
                    </div>
                    <Switch
                      id="whale-moves"
                      checked={whaleMoves}
                      onCheckedChange={setWhaleMoves}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sentiment-shifts">Sentiment Shifts</Label>
                      <p className="text-sm text-muted-foreground">
                        Alerts when market sentiment changes significantly
                      </p>
                    </div>
                    <Switch
                      id="sentiment-shifts"
                      checked={sentimentShifts}
                      onCheckedChange={setSentimentShifts}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="price-thresholds">Price Thresholds</Label>
                      <p className="text-sm text-muted-foreground">
                        Get alerts when prices cross your set thresholds
                      </p>
                    </div>
                    <Switch
                      id="price-thresholds"
                      checked={priceThresholds}
                      onCheckedChange={setPriceThresholds}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">Delivery Preferences</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">Connected Devices</h3>
                    <p className="text-sm text-muted-foreground">
                      Devices that can receive push notifications
                    </p>
                    
                    <div className="space-y-2">
                      {connectedDevices.map((device) => (
                        <div key={device.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            {device.type === 'browser' ? (
                              <Laptop className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <Smartphone className="h-5 w-5 text-muted-foreground" />
                            )}
                            <div>
                              <p className="font-medium">{device.name}</p>
                              <p className="text-xs text-muted-foreground">Last active: {device.lastActive}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Remove</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">Test Notifications</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={() => handleSendTestNotification('email')}>
                        <Mail className="h-4 w-4 mr-2" />
                        Test Email
                      </Button>
                      <Button variant="outline" onClick={() => handleSendTestNotification('push')}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Test Push
                      </Button>
                      <Button variant="outline" onClick={() => handleSendTestNotification('price')}>
                        <BellRing className="h-4 w-4 mr-2" />
                        Test Price Alert
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    Save Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ApiIcon className="h-5 w-5" />
                  API Settings
                </CardTitle>
                <CardDescription>
                  Configure API keys for external services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="coinmarketcap-api" className="flex gap-2 items-center">
                      <Key className="h-4 w-4" />
                      CoinMarketCap API Key
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="coinmarketcap-api"
                        type="password"
                        placeholder="Enter API key"
                        value={apiKeys.coinmarketcap}
                        onChange={(e) => setApiKeys({...apiKeys, coinmarketcap: e.target.value})}
                      />
                      <Button variant="outline">Verify</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Used for market data and price information</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="binance-api" className="flex gap-2 items-center">
                      <Key className="h-4 w-4" />
                      Binance API Key
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="binance-api"
                        type="password"
                        placeholder="Enter API key"
                        value={apiKeys.binance}
                        onChange={(e) => setApiKeys({...apiKeys, binance: e.target.value})}
                      />
                      <Button variant="outline">Verify</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Required for trading and account connections</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="coingecko-api" className="flex gap-2 items-center">
                      <Key className="h-4 w-4" />
                      CoinGecko API Key
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="coingecko-api"
                        type="password"
                        placeholder="Enter API key"
                        value={apiKeys.coingecko}
                        onChange={(e) => setApiKeys({...apiKeys, coingecko: e.target.value})}
                      />
                      <Button variant="outline">Verify</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Used for historical data and market analytics</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    Save API Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="theme" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme Settings
                </CardTitle>
                <CardDescription>
                  Customize the appearance of your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Theme Mode</h3>
                  
                  <div className="flex flex-wrap gap-4">
                    <div
                      className={`border rounded-md p-4 cursor-pointer transition-all hover:border-primary ${
                        themeSettings.mode === 'light' ? 'border-primary ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      onClick={() => updateThemeSettings({ mode: 'light' })}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sun className="h-5 w-5" />
                          <span>Light Mode</span>
                        </div>
                        {themeSettings.mode === 'light' && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                    
                    <div
                      className={`border rounded-md p-4 cursor-pointer transition-all hover:border-primary ${
                        themeSettings.mode === 'dark' ? 'border-primary ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      onClick={() => updateThemeSettings({ mode: 'dark' })}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Moon className="h-5 w-5" />
                          <span>Dark Mode</span>
                        </div>
                        {themeSettings.mode === 'dark' && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Accent Color</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {['blue', 'green', 'purple', 'amber', 'rose'].map((color) => (
                        <div
                          key={color}
                          className={`border rounded-md p-4 cursor-pointer transition-all hover:border-primary ${
                            themeSettings.accent === color ? 'border-primary ring-2 ring-primary ring-offset-2' : ''
                          }`}
                          onClick={() => updateThemeSettings({ accent: color as any })}
                        >
                          <div className="flex items-center justify-between">
                            <div className="capitalize">{color}</div>
                            <div className={`w-6 h-6 rounded-full bg-${color}-500`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Sound Effects</h3>
                        <p className="text-sm text-muted-foreground">
                          Enable sound effects for notifications and alerts
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="volume-control">Volume</Label>
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">70%</span>
                        </div>
                      </div>
                      <Slider
                        id="volume-control"
                        defaultValue={[70]}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    Save Theme Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
