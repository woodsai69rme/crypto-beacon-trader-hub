
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, CheckCircle, Activity, Key, TrendingUp, Settings } from 'lucide-react';
import { enhancedApiService } from '@/services/api/enhancedApiService';

const ApiManagement: React.FC = () => {
  const [providers, setProviders] = useState(enhancedApiService.getProviders());
  const [usageStats, setUsageStats] = useState(enhancedApiService.getUsageStats());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      setProviders(enhancedApiService.getProviders());
      setUsageStats(enhancedApiService.getUsageStats());
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getRateLimitProgress = (provider: any) => {
    if (!provider.rateLimit) return 0;
    const used = Math.floor(Math.random() * provider.rateLimit.requestsPerMinute);
    return (used / provider.rateLimit.requestsPerMinute) * 100;
  };

  const getStatusColor = (isActive: boolean, enabled: boolean) => {
    if (!enabled) return 'bg-gray-500';
    return isActive ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">API Management</h2>
        <Button onClick={refreshData} disabled={isRefreshing}>
          <Activity className="h-4 w-4 mr-2" />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="usage">Usage Stats</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Providers</p>
                    <p className="text-2xl font-bold">{providers.filter(p => p.enabled).length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Calls Today</p>
                    <p className="text-2xl font-bold">{usageStats.reduce((sum, stat) => sum + stat.totalCalls, 0)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold">
                      {usageStats.length > 0 
                        ? Math.round((usageStats.reduce((sum, stat) => sum + stat.successfulCalls, 0) / 
                           usageStats.reduce((sum, stat) => sum + stat.totalCalls, 0)) * 100) || 0
                        : 0}%
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                    <p className="text-2xl font-bold">
                      {usageStats.length > 0 
                        ? Math.round(usageStats.reduce((sum, stat) => sum + stat.avgResponseTime, 0) / usageStats.length)
                        : 0}ms
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Real-Time API Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providers.slice(0, 3).map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(provider.isActive, provider.enabled)}`} />
                      <div>
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-sm text-muted-foreground">{provider.type}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Rate Limit:</span>
                        <Progress value={getRateLimitProgress(provider)} className="w-20" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {provider.rateLimit?.requestsPerMinute || 0} req/min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {providers.map((provider) => (
              <Card key={provider.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(provider.isActive, provider.enabled)}`} />
                      {provider.name}
                    </CardTitle>
                    <Badge variant={provider.type === 'free' ? 'secondary' : 'default'}>
                      {provider.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enabled</span>
                    <Switch checked={provider.enabled} />
                  </div>
                  
                  {provider.rateLimit && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Rate Limit Usage</span>
                        <span>{getRateLimitProgress(provider).toFixed(0)}%</span>
                      </div>
                      <Progress value={getRateLimitProgress(provider)} />
                      <p className="text-xs text-muted-foreground mt-1">
                        {provider.rateLimit.requestsPerMinute} requests/minute
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor={`${provider.id}-key`}>API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`${provider.id}-key`}
                        type="password"
                        placeholder="Enter API key"
                        value={provider.apiKey || ''}
                      />
                      <Button variant="outline" size="icon">
                        <Key className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Test Connection
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Docs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageStats.map((stat) => (
                  <div key={stat.provider} className="p-4 border rounded">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{stat.provider}</h4>
                      <Badge variant="outline">
                        {((stat.successfulCalls / Math.max(stat.totalCalls, 1)) * 100).toFixed(1)}% success
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Calls</p>
                        <p className="font-medium">{stat.totalCalls}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Successful</p>
                        <p className="font-medium text-green-600">{stat.successfulCalls}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Failed</p>
                        <p className="font-medium text-red-600">{stat.failedCalls}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Response</p>
                        <p className="font-medium">{stat.avgResponseTime.toFixed(0)}ms</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Global API Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-retry Failed Requests</p>
                  <p className="text-sm text-muted-foreground">Automatically retry failed API calls</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cache Responses</p>
                  <p className="text-sm text-muted-foreground">Cache API responses for better performance</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rate Limit Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when approaching rate limits</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cache-duration">Cache Duration (minutes)</Label>
                <Input id="cache-duration" type="number" defaultValue="5" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                <Input id="timeout" type="number" defaultValue="30" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiManagement;
