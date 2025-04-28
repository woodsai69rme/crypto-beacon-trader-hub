
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiKeyManager from './ApiKeyManager';
import ApiUsageMetrics from './ApiUsageMetrics';
import RealTimeApiUsage from './RealTimeApiUsage';
import EndpointTester from './EndpointTester';
import { Database, Key, BarChart4, Terminal } from 'lucide-react';

const ApiManagementDashboard = () => {
  const [selectedService, setSelectedService] = useState<string>("CoinGecko");
  
  // Handle service selection
  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
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
            <ApiUsageMetrics selectedService={selectedService} onServiceSelect={handleServiceSelect} />
          </TabsContent>
          
          <TabsContent value="realtime">
            <RealTimeApiUsage selectedService={selectedService} onServiceSelect={handleServiceSelect} />
          </TabsContent>
          
          <TabsContent value="testing">
            <EndpointTester selectedService={selectedService} onServiceSelect={handleServiceSelect} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiManagementDashboard;
