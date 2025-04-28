
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/ThemeContext";
import FibonacciAnalysis from "./FibonacciAnalysis";
import TradingViewChart from "./TradingViewChart";
import HyblockLiquidityMap from "./HyblockLiquidityMap";
import QuantitativeAnalysis from "./QuantitativeAnalysis";
import ApiUsageMetrics from "../api/ApiUsageMetrics";
import RealTimeApiUsage from "../api/RealTimeApiUsage";

const AiMarketAnalysis = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>("fibonacci");
  const [selectedService, setSelectedService] = useState<string>("CoinGecko");
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Market Analysis</CardTitle>
        <CardDescription>
          Advanced market analysis tools powered by artificial intelligence
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 mb-6">
            <TabsTrigger value="fibonacci">Fibonacci</TabsTrigger>
            <TabsTrigger value="liquidity">Liquidity Map</TabsTrigger>
            <TabsTrigger value="tradingview">TradingView</TabsTrigger>
            <TabsTrigger value="quantitative">Quantitative</TabsTrigger>
            <TabsTrigger value="metrics">API Metrics</TabsTrigger>
            <TabsTrigger value="realtime">Real-Time API</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fibonacci">
            <FibonacciAnalysis />
          </TabsContent>
          
          <TabsContent value="liquidity">
            <HyblockLiquidityMap />
          </TabsContent>
          
          <TabsContent value="tradingview">
            <TradingViewChart
              symbol="BTCUSD"
              interval="240"
              theme={theme === "dark" ? "dark" : "light"}
            />
          </TabsContent>
          
          <TabsContent value="quantitative">
            <QuantitativeAnalysis />
          </TabsContent>
          
          <TabsContent value="metrics">
            <ApiUsageMetrics 
              apiUsage={[
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
              ]} 
              onRefresh={() => console.log("Refreshing API usage metrics")}
            />
          </TabsContent>
          
          <TabsContent value="realtime">
            <RealTimeApiUsage 
              selectedService={selectedService} 
              onServiceSelect={(service) => setSelectedService(service)} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AiMarketAnalysis;
