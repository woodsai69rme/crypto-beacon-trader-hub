
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ApiProviderManagement from "./ApiProviderManagement";
import ApiUsageMetrics from "./ApiUsageMetrics";
import RealTimeApiUsage from "./RealTimeApiUsage";
import { ApiUsageStats } from "@/types/trading";

const ApiManagementDashboard = () => {
  // Mock API usage data
  const [usageStats, setUsageStats] = useState<ApiUsageStats[]>([
    {
      id: "1",
      name: "CoinGecko API",
      service: "Market Data",
      currentUsage: 4230,
      maxUsage: 10000,
      usagePercent: 42.3,
      limit: 10000,
      resetTime: "2023-08-31T00:00:00Z"
    },
    {
      id: "2",
      name: "Hyblock API",
      service: "Liquidity Data",
      currentUsage: 175,
      maxUsage: 1000,
      usagePercent: 17.5,
      limit: 1000,
      resetTime: "2023-08-31T00:00:00Z"
    },
    {
      id: "3",
      name: "Alchemy API",
      service: "Blockchain Data",
      currentUsage: 56000,
      maxUsage: 100000,
      usagePercent: 56,
      limit: 100000,
      resetTime: "2023-08-31T00:00:00Z"
    }
  ]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="providers">
          <TabsList className="mb-4">
            <TabsTrigger value="providers">API Providers</TabsTrigger>
            <TabsTrigger value="usage">Usage Metrics</TabsTrigger>
            <TabsTrigger value="realtime">Real-time Usage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="providers">
            <ApiProviderManagement />
          </TabsContent>
          
          <TabsContent value="usage">
            <ApiUsageMetrics usageStats={usageStats} />
          </TabsContent>
          
          <TabsContent value="realtime">
            <RealTimeApiUsage usageStats={usageStats} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiManagementDashboard;
