
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ApiProviderManagement from './ApiProviderManagement';
import ApiUsageMetrics from './ApiUsageMetrics';
import RealTimeApiUsage from './RealTimeApiUsage';
import { ApiUsageStats } from '@/types/trading';

const ApiManagementDashboard: React.FC = () => {
  const [selectedApiService, setSelectedApiService] = useState("CoinGecko");
  
  // Mock API usage data
  const [apiUsageStats, setApiUsageStats] = useState<ApiUsageStats[]>([
    {
      id: "1",
      service: "CoinGecko",
      currentUsage: 45,
      maxUsage: 100,
      resetTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      endpoint: "coins/markets",
      costPerCall: 0.001
    },
    {
      id: "2",
      service: "CryptoCompare",
      currentUsage: 320,
      maxUsage: 500,
      resetTime: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
      endpoint: "price/multi",
      costPerCall: 0.0005
    },
    {
      id: "3",
      service: "CoinMarketCap",
      currentUsage: 180,
      maxUsage: 300,
      resetTime: new Date(Date.now() + 43200000).toISOString(), // 12 hours from now
      endpoint: "cryptocurrency/listings/latest",
      costPerCall: 0.002
    }
  ]);
  
  const handleRefreshApiUsage = () => {
    // In a real application, this would fetch updated API usage stats
    // For the demo, we'll just simulate an update
    setApiUsageStats(stats => 
      stats.map(stat => ({
        ...stat,
        currentUsage: Math.min(stat.currentUsage + Math.floor(Math.random() * 5), stat.maxUsage)
      }))
    );
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Management Dashboard</CardTitle>
          <CardDescription>
            Manage your API connections, monitor usage, and optimize your API consumption
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="usage" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="usage" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ApiUsageMetrics 
                  apiUsage={apiUsageStats} 
                  onRefresh={handleRefreshApiUsage}
                />
                
                <RealTimeApiUsage
                  selectedService={selectedApiService}
                  onServiceSelect={setSelectedApiService}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="providers">
              <ApiProviderManagement />
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>API Settings</CardTitle>
                  <CardDescription>Configure API request parameters and defaults</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    API settings management interface will be implemented here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiManagementDashboard;
