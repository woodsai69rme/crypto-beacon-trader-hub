
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import ApiUsageMetrics from "./ApiUsageMetrics";
import ServiceSelector from "./ServiceSelector";

// Updated imports to match the component definition
import type { ApiUsageMetricsData } from "./ApiUsageMetrics";

const AiMarketAnalysis = () => {
  const [selectedService, setSelectedService] = useState<string>("coingecko");
  const [apiUsageData, setApiUsageData] = useState<ApiUsageMetricsData[]>([
    {
      service: "CoinGecko",
      currentUsage: 87,
      maxUsage: 100,
      resetTime: "Today, 23:59:59",
      endpoint: "api.coingecko.com/v3/*"
    },
    {
      service: "Binance",
      currentUsage: 342,
      maxUsage: 1200,
      resetTime: "Tomorrow, 12:00:00",
      endpoint: "api.binance.com/api/v3/*"
    },
    {
      service: "CoinMarketCap",
      currentUsage: 23,
      maxUsage: 30,
      resetTime: "Today, 23:59:59",
      endpoint: "pro-api.coinmarketcap.com/v1/*"
    },
    {
      service: "Kraken",
      currentUsage: 45,
      maxUsage: 150,
      resetTime: "Hourly",
      endpoint: "api.kraken.com/0/*"
    }
  ]);
  
  const handleRefreshApiUsage = () => {
    // In a real app, we'd fetch fresh data from the server
    // For this demo, we'll simulate a refresh by slightly modifying the usage
    setApiUsageData(prev => 
      prev.map(item => ({
        ...item,
        currentUsage: Math.min(
          Math.floor(item.currentUsage + Math.random() * 5), 
          item.maxUsage
        )
      }))
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Market Analysis</CardTitle>
        <CardDescription>
          Advanced market analysis powered by artificial intelligence
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">Market Insights</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    AI-powered market analysis provides deep insights into cryptocurrency trends, 
                    sentiment analysis, and correlation data to help inform your trading decisions.
                  </p>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Current Market Sentiment</h3>
                    <div className="flex items-center">
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">65% Bullish</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <ApiUsageMetrics 
              data={apiUsageData}
              onRefresh={handleRefreshApiUsage}
            />
            
            <ServiceSelector 
              selectedService={selectedService}
              onServiceSelect={setSelectedService}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiMarketAnalysis;
