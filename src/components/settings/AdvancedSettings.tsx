
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield, Bell, Palette, Database, Key } from 'lucide-react';

const AdvancedSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    // General Settings
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
    currency: 'AUD',
    
    // Trading Settings
    defaultSlippage: '0.5',
    autoRefresh: true,
    confirmations: true,
    maxGasPrice: '50',
    
    // Notifications
    priceAlerts: true,
    newsAlerts: true,
    portfolioAlerts: true,
    emailNotifications: false,
    pushNotifications: true,
    
    // Security
    twoFactorAuth: false,
    biometricAuth: false,
    sessionTimeout: '30',
    ipWhitelist: '',
    
    // Performance
    chartQuality: 'high',
    dataRefreshRate: '5',
    cacheEnabled: true,
    preloadData: true,
    
    // API
    rateLimitBuffer: '10',
    requestTimeout: '30',
    retryAttempts: '3',
    fallbackProviders: true
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'trading-platform-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        theme: 'dark',
        language: 'en',
        timezone: 'UTC',
        currency: 'AUD',
        defaultSlippage: '0.5',
        autoRefresh: true,
        confirmations: true,
        maxGasPrice: '50',
        priceAlerts: true,
        newsAlerts: true,
        portfolioAlerts: true,
        emailNotifications: false,
        pushNotifications: true,
        twoFactorAuth: false,
        biometricAuth: false,
        sessionTimeout: '30',
        ipWhitelist: '',
        chartQuality: 'high',
        dataRefreshRate: '5',
        cacheEnabled: true,
        preloadData: true,
        rateLimitBuffer: '10',
        requestTimeout: '30',
        retryAttempts: '3',
        fallbackProviders: true
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Advanced Settings</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportSettings}>
            Export Settings
          </Button>
          <Button variant="outline" onClick={resetSettings}>
            Reset to Defaults
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Australia/Sydney">Sydney</SelectItem>
                      <SelectItem value="America/New_York">New York</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="currency">Base Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => updateSetting('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trading Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slippage">Default Slippage (%)</Label>
                  <Input
                    id="slippage"
                    type="number"
                    value={settings.defaultSlippage}
                    onChange={(e) => updateSetting('defaultSlippage', e.target.value)}
                    step="0.1"
                    min="0"
                    max="10"
                  />
                </div>

                <div>
                  <Label htmlFor="maxGas">Max Gas Price (Gwei)</Label>
                  <Input
                    id="maxGas"
                    type="number"
                    value={settings.maxGasPrice}
                    onChange={(e) => updateSetting('maxGasPrice', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-refresh Market Data</p>
                    <p className="text-sm text-muted-foreground">Automatically update prices and data</p>
                  </div>
                  <Switch
                    checked={settings.autoRefresh}
                    onCheckedChange={(checked) => updateSetting('autoRefresh', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Confirm Transactions</p>
                    <p className="text-sm text-muted-foreground">Show confirmation dialogs before trades</p>
                  </div>
                  <Switch
                    checked={settings.confirmations}
                    onCheckedChange={(checked) => updateSetting('confirmations', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Price Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when prices hit targets</p>
                  </div>
                  <Switch
                    checked={settings.priceAlerts}
                    onCheckedChange={(checked) => updateSetting('priceAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">News Alerts</p>
                    <p className="text-sm text-muted-foreground">Breaking news and market updates</p>
                  </div>
                  <Switch
                    checked={settings.newsAlerts}
                    onCheckedChange={(checked) => updateSetting('newsAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Portfolio Alerts</p>
                    <p className="text-sm text-muted-foreground">Performance and balance notifications</p>
                  </div>
                  <Switch
                    checked={settings.portfolioAlerts}
                    onCheckedChange={(checked) => updateSetting('portfolioAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Browser and mobile push notifications</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => updateSetting('twoFactorAuth', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Biometric Authentication</p>
                    <p className="text-sm text-muted-foreground">Use fingerprint or face recognition</p>
                  </div>
                  <Switch
                    checked={settings.biometricAuth}
                    onCheckedChange={(checked) => updateSetting('biometricAuth', checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ipWhitelist">IP Whitelist (optional)</Label>
                <Textarea
                  id="ipWhitelist"
                  placeholder="Enter IP addresses, one per line"
                  value={settings.ipWhitelist}
                  onChange={(e) => updateSetting('ipWhitelist', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Performance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="chartQuality">Chart Quality</Label>
                  <Select value={settings.chartQuality} onValueChange={(value) => updateSetting('chartQuality', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="refreshRate">Data Refresh Rate (seconds)</Label>
                  <Input
                    id="refreshRate"
                    type="number"
                    value={settings.dataRefreshRate}
                    onChange={(e) => updateSetting('dataRefreshRate', e.target.value)}
                    min="1"
                    max="60"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Caching</p>
                    <p className="text-sm text-muted-foreground">Cache data for better performance</p>
                  </div>
                  <Switch
                    checked={settings.cacheEnabled}
                    onCheckedChange={(checked) => updateSetting('cacheEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Preload Data</p>
                    <p className="text-sm text-muted-foreground">Load data in advance for faster access</p>
                  </div>
                  <Switch
                    checked={settings.preloadData}
                    onCheckedChange={(checked) => updateSetting('preloadData', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rateLimitBuffer">Rate Limit Buffer (%)</Label>
                  <Input
                    id="rateLimitBuffer"
                    type="number"
                    value={settings.rateLimitBuffer}
                    onChange={(e) => updateSetting('rateLimitBuffer', e.target.value)}
                    min="0"
                    max="50"
                  />
                </div>

                <div>
                  <Label htmlFor="requestTimeout">Request Timeout (seconds)</Label>
                  <Input
                    id="requestTimeout"
                    type="number"
                    value={settings.requestTimeout}
                    onChange={(e) => updateSetting('requestTimeout', e.target.value)}
                    min="5"
                    max="120"
                  />
                </div>

                <div>
                  <Label htmlFor="retryAttempts">Retry Attempts</Label>
                  <Input
                    id="retryAttempts"
                    type="number"
                    value={settings.retryAttempts}
                    onChange={(e) => updateSetting('retryAttempts', e.target.value)}
                    min="0"
                    max="10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Fallback Providers</p>
                  <p className="text-sm text-muted-foreground">Use backup providers when primary fails</p>
                </div>
                <Switch
                  checked={settings.fallbackProviders}
                  onCheckedChange={(checked) => updateSetting('fallbackProviders', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedSettings;
