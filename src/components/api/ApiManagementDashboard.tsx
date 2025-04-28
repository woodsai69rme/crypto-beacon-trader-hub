
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiKeyManager from './ApiKeyManager';
import ApiUsageMetrics from './ApiUsageMetrics';
import RealTimeApiUsage from './RealTimeApiUsage';
import EndpointTester from './EndpointTester';
import { Database, Key, BarChart4, Terminal } from 'lucide-react';
import { ApiUsageStats } from '@/types/trading';

const ApiManagementDashboard = () => {
  const [selectedService, setSelectedService] = useState<string>("CoinGecko");
  const [apiUsage, setApiUsage] = useState<ApiUsageStats[]>([
    {
      service: "CoinGecko",
      currentUsage: 45,
      maxUsage: 100,
      resetTime: "2023-04-27T00:00:00Z",
      endpoint: "/coins/markets"
    },
    {
      service: "Binance",
      currentUsage: 120,
      maxUsage: 1200,
      resetTime: "2023-04-26T12:00:00Z",
      endpoint: "/api/v3/ticker"
    }
  ]);
  
  // Handle service selection
  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
  };

  const handleRefreshUsage = () => {
    // In a real implementation, this would fetch updated API usage from the backend
    console.log("Refreshing API usage metrics");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">API Management Dashboard</CardTitle>
        <CardDescription>
          Manage API keys, monitor usage, and test endpoints for all connected services
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="keys">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="keys">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="usage">
              <BarChart4 className="h-4 w-4 mr-2" />
              Usage Metrics
            </TabsTrigger>
            <TabsTrigger value="realtime">
              <Database className="h-4 w-4 mr-2" />
              Real-Time Usage
            </TabsTrigger>
            <TabsTrigger value="testing">
              <Terminal className="h-4 w-4 mr-2" />
              Endpoint Testing
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="keys">
            <ApiKeyManager />
          </TabsContent>
          
          <TabsContent value="usage">
            <ApiUsageMetrics 
              apiUsage={apiUsage} 
              onRefresh={handleRefreshUsage}
            />
          </TabsContent>
          
          <TabsContent value="realtime">
            <RealTimeApiUsage 
              selectedService={selectedService} 
              onServiceSelect={handleServiceSelect} 
            />
          </TabsContent>
          
          <TabsContent value="testing">
            <EndpointTester 
              selectedService={selectedService} 
              onServiceSelect={handleServiceSelect} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiManagementDashboard;
