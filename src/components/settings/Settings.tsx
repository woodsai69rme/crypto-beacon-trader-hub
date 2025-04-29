import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Check, Save, RefreshCw } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Settings = () => {
  // General settings
  const [darkMode, setDarkMode] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [timeZone, setTimeZone] = useState("UTC");
  
  // Appearance settings
  const [colorScheme, setColorScheme] = useState("blue");
  const [fontFamily, setFontFamily] = useState("inter");
  const [fontSize, setFontSize] = useState(16);
  const [borderRadius, setBorderRadius] = useState(8);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [newsAlerts, setNewsAlerts] = useState(false);
  const [notificationSound, setNotificationSound] = useState("default");
  
  // Trading settings
  const [defaultFiat, setDefaultFiat] = useState("USD");
  const [defaultCrypto, setDefaultCrypto] = useState("BTC");
  const [confirmTradeExecutions, setConfirmTradeExecutions] = useState(true);
  const [showPnLInHeader, setShowPnLInHeader] = useState(true);
  const [defaultTradeSize, setDefaultTradeSize] = useState(100);
  
  // Data settings 
  const [dataRefreshInterval, setDataRefreshInterval] = useState(60);
  const [preferredChartType, setPreferredChartType] = useState("candlestick");
  const [defaultTimeframe, setDefaultTimeframe] = useState("1h");
  const [historicalDataCache, setHistoricalDataCache] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  
  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [apiKeyVisibility, setApiKeyVisibility] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    }, 1000);
  };

  const handleResetSettings = () => {
    // Reset to defaults
    setDarkMode(true);
    setCompactMode(false);
    setLanguage("en");
    setTimeZone("UTC");
    setColorScheme("blue");
    setFontFamily("inter");
    setFontSize(16);
    setBorderRadius(8);
    setAnimationsEnabled(true);
    setEmailNotifications(true);
    setPushNotifications(true);
    setPriceAlerts(true);
    setNewsAlerts(false);
    setNotificationSound("default");
    setDefaultFiat("USD");
    setDefaultCrypto("BTC");
    setConfirmTradeExecutions(true);
    setShowPnLInHeader(true);
    setDefaultTradeSize(100);
    setDataRefreshInterval(60);
    setPreferredChartType("candlestick");
    setDefaultTimeframe("1h");
    setHistoricalDataCache(true);
    setShowVolume(true);
    setTwoFactorAuth(false);
    setSessionTimeout(30);
    setApiKeyVisibility(false);
    setIpWhitelist("");
    
    toast({
      title: "Settings reset",
      description: "All settings have been reset to their default values.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Customize your trading experience with these application settings.
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            {isOpen ? "Hide" : "Show"}
          </Button>
        </div>
      </CardHeader>
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="trading">Trading</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              {/* General Settings */}
              <TabsContent value="general" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">General Preferences</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use dark theme for the application
                      </p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-mode">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce spacing and font sizes
                      </p>
                    </div>
                    <Switch
                      id="compact-mode"
                      checked={compactMode}
                      onCheckedChange={setCompactMode}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={timeZone} onValueChange={setTimeZone}>
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                        <SelectItem value="CST">Central Time (CST)</SelectItem>
                        <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                        <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                        <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                        <SelectItem value="CET">Central European Time (CET)</SelectItem>
                        <SelectItem value="JST">Japan Standard Time (JST)</SelectItem>
                        <SelectItem value="AEST">Australian Eastern Standard Time (AEST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              {/* Appearance Settings */}
              <TabsContent value="appearance" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Theme & Appearance</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="color-scheme">Color Scheme</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {["blue", "purple", "green", "amber", "red"].map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-full h-10 rounded-md border ${
                            colorScheme === color 
                              ? "ring-2 ring-primary ring-offset-2" 
                              : "ring-offset-0"
                          }`}
                          style={{ 
                            backgroundColor: 
                              color === "blue" ? "#1e40af" : 
                              color === "purple" ? "#7e22ce" :
                              color === "green" ? "#15803d" :
                              color === "amber" ? "#d97706" : 
                              "#dc2626" 
                          }}
                          onClick={() => setColorScheme(color)}
                          aria-label={`${color} theme`}
                        >
                          {colorScheme === color && (
                            <Check className="mx-auto text-white" size={16} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="font-family">Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger id="font-family">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="poppins">Poppins</SelectItem>
                        <SelectItem value="opensans">Open Sans</SelectItem>
                        <SelectItem value="montserrat">Montserrat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="font-size">Font Size ({fontSize}px)</Label>
                    </div>
                    <Slider
                      id="font-size"
                      min={12}
                      max={24}
                      step={1}
                      value={[fontSize]}
                      onValueChange={(values) => setFontSize(values[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="border-radius">Border Radius ({borderRadius}px)</Label>
                    </div>
                    <Slider
                      id="border-radius"
                      min={0}
                      max={16}
                      step={1}
                      value={[borderRadius]}
                      onValueChange={(values) => setBorderRadius(values[0])}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="animations-enabled">Enable Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Show transition animations
                      </p>
                    </div>
                    <Switch
                      id="animations-enabled"
                      checked={animationsEnabled}
                      onCheckedChange={setAnimationsEnabled}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Notification Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important updates via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts in your browser
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="price-alerts">Price Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about significant price changes
                      </p>
                    </div>
                    <Switch
                      id="price-alerts"
                      checked={priceAlerts}
                      onCheckedChange={setPriceAlerts}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="news-alerts">News Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about important crypto news
                      </p>
                    </div>
                    <Switch
                      id="news-alerts"
                      checked={newsAlerts}
                      onCheckedChange={setNewsAlerts}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="notification-sound">Notification Sound</Label>
                    <Select value={notificationSound} onValueChange={setNotificationSound}>
                      <SelectTrigger id="notification-sound">
                        <SelectValue placeholder="Select sound" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="chime">Chime</SelectItem>
                        <SelectItem value="bell">Bell</SelectItem>
                        <SelectItem value="ping">Ping</SelectItem>
                        <SelectItem value="none">None (Silent)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              {/* Trading Settings */}
              <TabsContent value="trading" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Trading Preferences</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default-fiat">Default Fiat Currency</Label>
                    <Select value={defaultFiat} onValueChange={setDefaultFiat}>
                      <SelectTrigger id="default-fiat">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                        <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                        <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                        <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default-crypto">Default Cryptocurrency</Label>
                    <Select value={defaultCrypto} onValueChange={setDefaultCrypto}>
                      <SelectTrigger id="default-crypto">
                        <SelectValue placeholder="Select cryptocurrency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                        <SelectItem value="SOL">Solana (SOL)</SelectItem>
                        <SelectItem value="ADA">Cardano (ADA)</SelectItem>
                        <SelectItem value="XRP">XRP (XRP)</SelectItem>
                        <SelectItem value="DOT">Polkadot (DOT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="confirm-trades">Confirm Trade Executions</Label>
                      <p className="text-sm text-muted-foreground">
                        Show confirmation dialog before executing trades
                      </p>
                    </div>
                    <Switch
                      id="confirm-trades"
                      checked={confirmTradeExecutions}
                      onCheckedChange={setConfirmTradeExecutions}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-pnl">Show P&L in Header</Label>
                      <p className="text-sm text-muted-foreground">
                        Display profit/loss in the application header
                      </p>
                    </div>
                    <Switch
                      id="show-pnl"
                      checked={showPnLInHeader}
                      onCheckedChange={setShowPnLInHeader}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="default-trade-size">Default Trade Size (${defaultTradeSize})</Label>
                    </div>
                    <Slider
                      id="default-trade-size"
                      min={10}
                      max={1000}
                      step={10}
                      value={[defaultTradeSize]}
                      onValueChange={(values) => setDefaultTradeSize(values[0])}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Data Settings */}
              <TabsContent value="data" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data & Charts</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="refresh-interval">Data Refresh Interval ({dataRefreshInterval}s)</Label>
                    </div>
                    <Slider
                      id="refresh-interval"
                      min={10}
                      max={300}
                      step={10}
                      value={[dataRefreshInterval]}
                      onValueChange={(values) => setDataRefreshInterval(values[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="chart-type">Preferred Chart Type</Label>
                    <Select value={preferredChartType} onValueChange={setPreferredChartType}>
                      <SelectTrigger id="chart-type">
                        <SelectValue placeholder="Select chart type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="candlestick">Candlestick</SelectItem>
                        <SelectItem value="line">Line</SelectItem>
                        <SelectItem value="bar">Bar</SelectItem>
                        <SelectItem value="area">Area</SelectItem>
                        <SelectItem value="heikinashi">Heikin-Ashi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default-timeframe">Default Timeframe</Label>
                    <Select value={defaultTimeframe} onValueChange={setDefaultTimeframe}>
                      <SelectTrigger id="default-timeframe">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1m">1 Minute</SelectItem>
                        <SelectItem value="5m">5 Minutes</SelectItem>
                        <SelectItem value="15m">15 Minutes</SelectItem>
                        <SelectItem value="30m">30 Minutes</SelectItem>
                        <SelectItem value="1h">1 Hour</SelectItem>
                        <SelectItem value="4h">4 Hours</SelectItem>
                        <SelectItem value="1d">1 Day</SelectItem>
                        <SelectItem value="1w">1 Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="historical-cache">Cache Historical Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Store historical data locally for faster loading
                      </p>
                    </div>
                    <Switch
                      id="historical-cache"
                      checked={historicalDataCache}
                      onCheckedChange={setHistoricalDataCache}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-volume">Show Volume</Label>
                      <p className="text-sm text-muted-foreground">
                        Display volume indicator on charts
                      </p>
                    </div>
                    <Switch
                      id="show-volume"
                      checked={showVolume}
                      onCheckedChange={setShowVolume}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security & Privacy</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="2fa">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Switch
                      id="2fa"
                      checked={twoFactorAuth}
                      onCheckedChange={setTwoFactorAuth}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="session-timeout">Session Timeout ({sessionTimeout} minutes)</Label>
                    </div>
                    <Slider
                      id="session-timeout"
                      min={5}
                      max={120}
                      step={5}
                      value={[sessionTimeout]}
                      onValueChange={(values) => setSessionTimeout(values[0])}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="api-key-visibility">API Key Visibility</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow API keys to be displayed in plaintext
                      </p>
                    </div>
                    <Switch
                      id="api-key-visibility"
                      checked={apiKeyVisibility}
                      onCheckedChange={setApiKeyVisibility}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ip-whitelist">IP Whitelist</Label>
                    <Input
                      id="ip-whitelist"
                      placeholder="e.g., 192.168.1.1, 10.0.0.1"
                      value={ipWhitelist}
                      onChange={(e) => setIpWhitelist(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate multiple IP addresses with commas
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleResetSettings}
              disabled={isLoading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
            <Button 
              onClick={handleSaveSettings} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>Loading...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default Settings;
