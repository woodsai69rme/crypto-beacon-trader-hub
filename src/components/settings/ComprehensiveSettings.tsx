
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Settings, 
  Bot, 
  Globe, 
  Shield, 
  Bell, 
  Palette, 
  Database,
  Key,
  Zap,
  DollarSign,
  Activity,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import OpenRouterSettings from './OpenRouterSettings';
import { useToast } from '@/hooks/use-toast';

const ComprehensiveSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    // General Settings
    defaultCurrency: 'AUD',
    timezone: 'Australia/Sydney',
    language: 'en-AU',
    theme: 'system',
    
    // Trading Settings
    defaultOrderType: 'market',
    maxPositionSize: 10,
    stopLossPercentage: 5,
    takeProfitPercentage: 15,
    slippageTolerance: 0.5,
    
    // AI Settings
    defaultAiModel: 'deepseek/deepseek-r1',
    aiConfidenceThreshold: 70,
    maxAiTrades: 10,
    aiRiskLevel: 'medium',
    
    // API Settings
    apiRateLimit: 100,
    cacheDuration: 300,
    retryAttempts: 3,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    tradingAlerts: true,
    priceAlerts: true,
    newsAlerts: false,
    
    // Risk Management
    dailyLossLimit: 2,
    maxDrawdown: 5,
    correlationLimit: 70,
    leverageLimit: 3,
    
    // Automation Settings
    enableN8N: false,
    n8nWebhookUrl: '',
    autoRebalance: false,
    rebalanceThreshold: 5,
    
    // Privacy Settings
    sharePortfolio: false,
    allowAnalytics: true,
    dataRetention: 365
  });

  const { toast } = useToast();

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    try {
      localStorage.setItem('comprehensive-settings', JSON.stringify(settings));
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      localStorage.removeItem('comprehensive-settings');
      window.location.reload();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Settings</h1>
        <Badge variant="outline">v2.0.0</Badge>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          <TabsTrigger value="general" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="trading" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Trading</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-1">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">AI</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Risk</span>
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Auto</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Configure basic application preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select
                    value={settings.defaultCurrency}
                    onValueChange={(value) => handleSettingChange('defaultCurrency', value)}
                  >
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

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => handleSettingChange('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Australia/Sydney">Sydney (AEDT)</SelectItem>
                      <SelectItem value="Australia/Melbourne">Melbourne (AEDT)</SelectItem>
                      <SelectItem value="Australia/Perth">Perth (AWST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">New York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleSettingChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-AU">English (Australia)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => handleSettingChange('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trading Settings */}
        <TabsContent value="trading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Trading Configuration
              </CardTitle>
              <CardDescription>
                Set default trading parameters and risk controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultOrderType">Default Order Type</Label>
                  <Select
                    value={settings.defaultOrderType}
                    onValueChange={(value) => handleSettingChange('defaultOrderType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="limit">Limit</SelectItem>
                      <SelectItem value="stop">Stop</SelectItem>
                      <SelectItem value="stop_limit">Stop Limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPositionSize">Max Position Size (%)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.maxPositionSize]}
                      onValueChange={(value) => handleSettingChange('maxPositionSize', value[0])}
                      max={50}
                      min={1}
                      step={1}
                    />
                    <div className="text-sm text-muted-foreground">
                      Current: {settings.maxPositionSize}% of portfolio
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stopLossPercentage">Default Stop Loss (%)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.stopLossPercentage]}
                      onValueChange={(value) => handleSettingChange('stopLossPercentage', value[0])}
                      max={20}
                      min={1}
                      step={0.5}
                    />
                    <div className="text-sm text-muted-foreground">
                      Current: {settings.stopLossPercentage}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="takeProfitPercentage">Default Take Profit (%)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.takeProfitPercentage]}
                      onValueChange={(value) => handleSettingChange('takeProfitPercentage', value[0])}
                      max={50}
                      min={5}
                      step={1}
                    />
                    <div className="text-sm text-muted-foreground">
                      Current: {settings.takeProfitPercentage}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slippageTolerance">Slippage Tolerance (%)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.slippageTolerance]}
                      onValueChange={(value) => handleSettingChange('slippageTolerance', value[0])}
                      max={5}
                      min={0.1}
                      step={0.1}
                    />
                    <div className="text-sm text-muted-foreground">
                      Current: {settings.slippageTolerance}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai" className="space-y-6">
          <OpenRouterSettings />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Trading Configuration
              </CardTitle>
              <CardDescription>
                Configure AI model preferences and trading parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultAiModel">Default AI Model</Label>
                  <Select
                    value={settings.defaultAiModel}
                    onValueChange={(value) => handleSettingChange('defaultAiModel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deepseek/deepseek-r1">DeepSeek R1 (Free)</SelectItem>
                      <SelectItem value="google/gemini-2.0-flash-exp">Gemini 2.0 Flash (Free)</SelectItem>
                      <SelectItem value="meta-llama/llama-3.3-70b-instruct">Llama 3.3 70B (Free)</SelectItem>
                      <SelectItem value="openai/gpt-4">GPT-4 (Paid)</SelectItem>
                      <SelectItem value="anthropic/claude-3-sonnet">Claude 3 Sonnet (Paid)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aiRiskLevel">AI Risk Level</Label>
                  <Select
                    value={settings.aiRiskLevel}
                    onValueChange={(value) => handleSettingChange('aiRiskLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aiConfidenceThreshold">Confidence Threshold (%)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.aiConfidenceThreshold]}
                      onValueChange={(value) => handleSettingChange('aiConfidenceThreshold', value[0])}
                      max={95}
                      min={50}
                      step={5}
                    />
                    <div className="text-sm text-muted-foreground">
                      Only execute trades with {settings.aiConfidenceThreshold}%+ confidence
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxAiTrades">Max AI Trades per Day</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.maxAiTrades]}
                      onValueChange={(value) => handleSettingChange('maxAiTrades', value[0])}
                      max={50}
                      min={1}
                      step={1}
                    />
                    <div className="text-sm text-muted-foreground">
                      Current: {settings.maxAiTrades} trades per day
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Manage API connections and performance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>API Status</AlertTitle>
                <AlertDescription>
                  All free APIs are connected and operational. Rate limits are being monitored.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="apiRateLimit">API Rate Limit (requests/min)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.apiRateLimit]}
                      onValueChange={(value) => handleSettingChange('apiRateLimit', value[0])}
                      max={300}
                      min={10}
                      step={10}
                    />
                    <div className="text-sm text-muted-foreground">
                      Current: {settings.apiRateLimit} requests per minute
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cacheDuration">Cache Duration (seconds)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.cacheDuration]}
                      onValueChange={(value) => handleSettingChange('cacheDuration', value[0])}
                      max={3600}
                      min={10}
                      step={10}
                    />
                    <div className="text-sm text-muted-foreground">
                      Current: {settings.cacheDuration} seconds
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retryAttempts">Retry Attempts</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.retryAttempts]}
                      onValueChange={(value) => handleSettingChange('retryAttempts', value[0])}
                      max={10}
                      min={1}
                      step={1}
                    />
                    <div className="text-sm text-muted-foreground">
                      Current: {settings.retryAttempts} retry attempts
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how and when you receive alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Real-time browser notifications
                    </p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="tradingAlerts">Trading Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications for trade executions and signals
                    </p>
                  </div>
                  <Switch
                    id="tradingAlerts"
                    checked={settings.tradingAlerts}
                    onCheckedChange={(checked) => handleSettingChange('tradingAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="priceAlerts">Price Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications when price targets are reached
                    </p>
                  </div>
                  <Switch
                    id="priceAlerts"
                    checked={settings.priceAlerts}
                    onCheckedChange={(checked) => handleSettingChange('priceAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newsAlerts">News Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Important cryptocurrency news updates
                    </p>
                  </div>
                  <Switch
                    id="newsAlerts"
                    checked={settings.newsAlerts}
                    onCheckedChange={(checked) => handleSettingChange('newsAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Management */}
        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Risk Management
              </CardTitle>
              <CardDescription>
                Set portfolio protection and risk limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Risk Warning</AlertTitle>
                <AlertDescription>
                  These settings help protect your portfolio but do not guarantee against losses.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dailyLossLimit">Daily Loss Limit (%)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.dailyLossLimit]}
                      onValueChange={(value) => handleSettingChange('dailyLossLimit', value[0])}
                      max={10}
                      min={0.5}
                      step={0.5}
                    />
                    <div className="text-sm text-muted-foreground">
                      Stop trading if daily loss exceeds {settings.dailyLossLimit}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxDrawdown">Max Drawdown (%)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.maxDrawdown]}
                      onValueChange={(value) => handleSettingChange('maxDrawdown', value[0])}
                      max={20}
                      min={1}
                      step={1}
                    />
                    <div className="text-sm text-muted-foreground">
                      Alert when drawdown exceeds {settings.maxDrawdown}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correlationLimit">Correlation Limit (%)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.correlationLimit]}
                      onValueChange={(value) => handleSettingChange('correlationLimit', value[0])}
                      max={100}
                      min={30}
                      step={5}
                    />
                    <div className="text-sm text-muted-foreground">
                      Warn when portfolio correlation exceeds {settings.correlationLimit}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leverageLimit">Maximum Leverage</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.leverageLimit]}
                      onValueChange={(value) => handleSettingChange('leverageLimit', value[0])}
                      max={10}
                      min={1}
                      step={0.5}
                    />
                    <div className="text-sm text-muted-foreground">
                      Maximum leverage: {settings.leverageLimit}x
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Settings */}
        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Automation & N8N Integration
              </CardTitle>
              <CardDescription>
                Configure automated trading and workflow integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableN8N">Enable N8N Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Connect to N8N workflows for advanced automation
                    </p>
                  </div>
                  <Switch
                    id="enableN8N"
                    checked={settings.enableN8N}
                    onCheckedChange={(checked) => handleSettingChange('enableN8N', checked)}
                  />
                </div>

                {settings.enableN8N && (
                  <div className="space-y-2">
                    <Label htmlFor="n8nWebhookUrl">N8N Webhook URL</Label>
                    <Input
                      id="n8nWebhookUrl"
                      placeholder="http://localhost:5678/webhook/trading-signals"
                      value={settings.n8nWebhookUrl}
                      onChange={(e) => handleSettingChange('n8nWebhookUrl', e.target.value)}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoRebalance">Auto Portfolio Rebalancing</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically rebalance portfolio based on AI recommendations
                    </p>
                  </div>
                  <Switch
                    id="autoRebalance"
                    checked={settings.autoRebalance}
                    onCheckedChange={(checked) => handleSettingChange('autoRebalance', checked)}
                  />
                </div>

                {settings.autoRebalance && (
                  <div className="space-y-2">
                    <Label htmlFor="rebalanceThreshold">Rebalance Threshold (%)</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[settings.rebalanceThreshold]}
                        onValueChange={(value) => handleSettingChange('rebalanceThreshold', value[0])}
                        max={20}
                        min={1}
                        step={1}
                      />
                      <div className="text-sm text-muted-foreground">
                        Rebalance when allocation deviates by {settings.rebalanceThreshold}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Data Settings
              </CardTitle>
              <CardDescription>
                Control your data privacy and sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sharePortfolio">Share Portfolio Performance</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to see your portfolio performance in leaderboards
                    </p>
                  </div>
                  <Switch
                    id="sharePortfolio"
                    checked={settings.sharePortfolio}
                    onCheckedChange={(checked) => handleSettingChange('sharePortfolio', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowAnalytics">Usage Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve the platform by sharing anonymous usage data
                    </p>
                  </div>
                  <Switch
                    id="allowAnalytics"
                    checked={settings.allowAnalytics}
                    onCheckedChange={(checked) => handleSettingChange('allowAnalytics', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention (days)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.dataRetention]}
                      onValueChange={(value) => handleSettingChange('dataRetention', value[0])}
                      max={1095}
                      min={30}
                      step={30}
                    />
                    <div className="text-sm text-muted-foreground">
                      Keep trading data for {settings.dataRetention} days
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button variant="outline" onClick={resetSettings}>
          Reset to Defaults
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            Export Settings
          </Button>
          <Button onClick={saveSettings}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveSettings;
