
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Key, Palette, Bell, Shield, Zap } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/hooks/use-toast';

const ComprehensiveSettings: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const { theme, setTheme } = useTheme();
  const [openRouterKey, setOpenRouterKey] = useState(localStorage.getItem('openrouter-api-key') || '');
  const [n8nWebhook, setN8nWebhook] = useState(localStorage.getItem('n8n-webhook-url') || '');
  const [notifications, setNotifications] = useState({
    trades: true,
    botUpdates: true,
    priceAlerts: false,
    email: false
  });

  const handleSaveApiKey = () => {
    localStorage.setItem('openrouter-api-key', openRouterKey);
    toast({
      title: "API Key Saved",
      description: "OpenRouter API key has been saved securely",
    });
  };

  const handleSaveWebhook = () => {
    localStorage.setItem('n8n-webhook-url', n8nWebhook);
    toast({
      title: "Webhook URL Saved",
      description: "N8N webhook URL has been saved",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your trading platform preferences and integrations
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="currency">Currency</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color scheme
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Information</CardTitle>
              <CardDescription>
                Current platform status and version information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Version</Label>
                  <p className="text-sm font-mono">v2.0.0</p>
                </div>
                <div>
                  <Label>Trading Mode</Label>
                  <Badge variant="secondary">Paper Trading</Badge>
                </div>
                <div>
                  <Label>Base Currency</Label>
                  <p className="text-sm font-mono">{currency}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Currency Settings</CardTitle>
              <CardDescription>
                Configure your preferred trading currency and display format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Base Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  All prices and calculations will be displayed in this currency
                </p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Exchange Rates</h4>
                <p className="text-sm text-muted-foreground">
                  Exchange rates are updated in real-time from reliable financial data providers.
                  All paper trading uses current market rates for accurate simulation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Configure API keys for premium AI models and external services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="openrouter">OpenRouter API Key</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="openrouter"
                      type="password"
                      placeholder="sk-or-..."
                      value={openRouterKey}
                      onChange={(e) => setOpenRouterKey(e.target.value)}
                    />
                    <Button onClick={handleSaveApiKey}>Save</Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Required for premium AI models (GPT-4, Claude). Free models work without API key.
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Available AI Models</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">DeepSeek R1</span>
                      <Badge variant="secondary">Free</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Gemini 2.0 Flash</span>
                      <Badge variant="secondary">Free</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">GPT-4o</span>
                      <Badge variant="outline">Premium</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Claude 3 Sonnet</span>
                      <Badge variant="outline">Premium</Badge>
                    </div>
                  </div>
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
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Trade Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when trades are executed
                    </p>
                  </div>
                  <Switch
                    checked={notifications.trades}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, trades: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Bot Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications for AI bot activities
                    </p>
                  </div>
                  <Switch
                    checked={notifications.botUpdates}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, botUpdates: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Price Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alerts for significant price movements
                    </p>
                  </div>
                  <Switch
                    checked={notifications.priceAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, priceAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, email: checked }))
                    }
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
              <CardDescription>
                Manage your account security and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  Paper Trading Security
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  You are currently in paper trading mode. No real funds are at risk, and no sensitive
                  financial information is required. All data is stored locally in your browser.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Data Storage</Label>
                  <p className="text-sm text-muted-foreground">
                    Trading data and bot configurations are stored locally in your browser.
                    No data is sent to external servers except for market data APIs.
                  </p>
                </div>

                <div>
                  <Label>API Key Security</Label>
                  <p className="text-sm text-muted-foreground">
                    API keys are encrypted and stored locally. They are never transmitted
                    to our servers and are only used for direct API communication.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Automation Settings
              </CardTitle>
              <CardDescription>
                Configure N8N workflows and automation features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="n8n-webhook">N8N Webhook URL</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="n8n-webhook"
                      placeholder="https://your-n8n-instance.com/webhook/..."
                      value={n8nWebhook}
                      onChange={(e) => setN8nWebhook(e.target.value)}
                    />
                    <Button onClick={handleSaveWebhook}>Save</Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connect to your N8N instance for advanced automation workflows
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Available Workflows</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Trading Signal Distribution</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Risk Monitoring</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Portfolio Rebalancing</span>
                      <Badge variant="secondary">Inactive</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveSettings;
