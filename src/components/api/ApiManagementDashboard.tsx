
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiKeyManager from "./ApiKeyManager";
import ApiUsageMetrics from "./ApiUsageMetrics";
import ApiStatusIndicator from "./ApiStatusIndicator";
import ApiRateLimits from "./ApiRateLimits";
import ApiProviderSettings from "./ApiProviderSettings";
import RealTimeApiUsage from "./RealTimeApiUsage";
import { toast } from "@/components/ui/use-toast";
import { CoinOption } from "@/types/trading";
import { startPriceMonitoring } from "@/services/priceMonitoring";

const ApiManagementDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("realtime");
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [coinPrices, setCoinPrices] = useState<CoinOption[]>([]);
  const [selectedApiService, setSelectedApiService] = useState<string>("coingecko");
  
  // Start price monitoring when component mounts
  useEffect(() => {
    if (!isMonitoring) {
      const coinIds = ["bitcoin", "ethereum", "solana", "cardano", "ripple", "dogecoin"];
      
      const stopMonitoring = startPriceMonitoring(
        coinIds,
        (updatedCoins) => {
          setCoinPrices(updatedCoins);
        },
        5000 // Update every 5 seconds
      );
      
      setIsMonitoring(true);
      
      // Notify user
      toast({
        title: "Real-time Price Monitoring Started",
        description: "Cryptocurrency prices will update every 5 seconds"
      });
      
      // Clean up price monitoring when component unmounts
      return () => {
        stopMonitoring();
        setIsMonitoring(false);
      };
    }
  }, [isMonitoring]);

  const handleApiServiceSelect = (service: string) => {
    setSelectedApiService(service);
    toast({
      title: `${service.charAt(0).toUpperCase() + service.slice(1)} API Selected`,
      description: "Detailed API usage metrics loaded for this service"
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API & Data Management</CardTitle>
        <CardDescription>
          Manage your API keys, monitor usage, and configure data providers
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 mb-6">
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="limits">Rate Limits</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="realtime">
            <RealTimeApiUsage 
              selectedService={selectedApiService} 
              onServiceSelect={handleApiServiceSelect} 
            />
          </TabsContent>
          
          <TabsContent value="keys">
            <ApiKeyManager />
          </TabsContent>
          
          <TabsContent value="usage">
            <ApiUsageMetrics coinPrices={coinPrices} />
          </TabsContent>
          
          <TabsContent value="status">
            <ApiStatusIndicator />
          </TabsContent>
          
          <TabsContent value="limits">
            <ApiRateLimits />
          </TabsContent>
          
          <TabsContent value="providers">
            <ApiProviderSettings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiManagementDashboard;
