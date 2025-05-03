
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ApiUsageStats } from "@/types/trading";

const ApiManagementDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data for API usage
  const [apiUsage, setApiUsage] = useState<ApiUsageStats[]>([
    {
      serviceId: "coingecko-1",
      serviceName: "CoinGecko",
      totalRequests: 5243,
      periodRequests: 243,
      requestsLimit: 10000,
      averageResponseTime: 247,
      errorRate: 0.5,
      lastRequested: "2023-05-01T12:34:56Z",
      id: "1",
      currentUsage: 243,
      maxUsage: 10000
    },
    {
      serviceId: "binance-1",
      serviceName: "Binance",
      totalRequests: 8754,
      periodRequests: 754,
      requestsLimit: 20000,
      averageResponseTime: 124,
      errorRate: 0.2,
      lastRequested: "2023-05-01T13:45:12Z",
      id: "2",
      currentUsage: 754,
      maxUsage: 20000
    },
    {
      serviceId: "kraken-1",
      serviceName: "Kraken",
      totalRequests: 2134,
      periodRequests: 134,
      requestsLimit: 5000,
      averageResponseTime: 189,
      errorRate: 1.2,
      lastRequested: "2023-05-01T11:22:33Z",
      id: "3",
      currentUsage: 134,
      maxUsage: 5000
    }
  ]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Management</CardTitle>
        <CardDescription>
          Monitor and manage your API usage across different services
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apiUsage.map((api) => (
                <Card key={api.serviceId}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">{api.serviceName}</h4>
                        <span className="text-xs text-muted-foreground">
                          {api.currentUsage} / {api.maxUsage}
                        </span>
                      </div>
                      <Progress value={(api.currentUsage / api.maxUsage) * 100} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Avg. Response: {api.averageResponseTime}ms</span>
                        <span>Error Rate: {api.errorRate}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="usage">
            <div className="rounded-md border mt-4">
              <div className="p-4">
                <h3 className="text-lg font-medium">API Usage Statistics</h3>
                <p className="text-sm text-muted-foreground">Detailed breakdown of your API consumption</p>
              </div>
              
              {/* Simplified for now */}
              <div className="p-4">
                <p className="text-sm text-muted-foreground">
                  View comprehensive API usage metrics, request patterns, and cost analysis.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="rounded-md border mt-4">
              <div className="p-4">
                <h3 className="text-lg font-medium">API Configuration</h3>
                <p className="text-sm text-muted-foreground">Manage API keys and preferences</p>
              </div>
              
              {/* Simplified for now */}
              <div className="p-4">
                <p className="text-sm text-muted-foreground">
                  Configure API integration settings, rate limiting, and authentication preferences.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiManagementDashboard;
