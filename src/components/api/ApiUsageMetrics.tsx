
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiUsageStats, CoinOption } from "@/types/trading";

interface ApiUsageMetricsProps {
  apiUsage: ApiUsageStats[];
  onRefresh: () => void;
}

const ApiUsageMetrics: React.FC<ApiUsageMetricsProps> = ({ apiUsage, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string>(apiUsage[0]?.service || "");
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };
  
  const getProgressColor = (current: number, max: number) => {
    const percent = (current / max) * 100;
    if (percent > 90) return "destructive";
    if (percent > 75) return "warning";
    return "default";
  };
  
  const selectedServiceData = apiUsage.find(item => item.service === selectedService);
  const usagePercent = selectedServiceData 
    ? (selectedServiceData.currentUsage / selectedServiceData.maxUsage) * 100
    : 0;
    
  // Sample coin data for visualization
  const sampleCoins: CoinOption[] = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 92500.32,
      priceChange: 1200.45,
      changePercent: 1.3,
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      volume: 28000000000
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: 3200.45,
      priceChange: -120.32,
      changePercent: -2.1,
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      volume: 15000000000
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-medium text-lg">API Usage Metrics</h3>
          <p className="text-sm text-muted-foreground">
            Monitor your API usage across different providers
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">API Rate Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select API Service</label>
                <Select 
                  value={selectedService} 
                  onValueChange={setSelectedService}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select API service" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiUsage.map(item => (
                      <SelectItem key={item.service} value={item.service}>
                        {item.service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedServiceData && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Usage</span>
                      <span>
                        {selectedServiceData.currentUsage} / {selectedServiceData.maxUsage} requests
                      </span>
                    </div>
                    <Progress 
                      value={usagePercent} 
                      className="h-2 mt-1"
                      variant={getProgressColor(selectedServiceData.currentUsage, selectedServiceData.maxUsage)}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div>Endpoint: {selectedServiceData.endpoint || "All endpoints"}</div>
                    {selectedServiceData.resetTime && (
                      <div>
                        Reset: {new Date(selectedServiceData.resetTime).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-start gap-2 p-2 text-xs rounded bg-muted">
                      <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        {selectedServiceData.service === "CoinGecko" ? (
                          <span>
                            CoinGecko API has a rate limit of 10-50 requests per minute for free tier.
                            Consider upgrading to Pro plan for higher limits.
                          </span>
                        ) : selectedServiceData.service === "Binance" ? (
                          <span>
                            Binance API has weight-based rate limits that vary by endpoint.
                            Current weight usage is moderate.
                          </span>
                        ) : (
                          <span>
                            Monitor your API usage to avoid hitting rate limits which could
                            disrupt data updates and trading signals.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">API Service Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiUsage.map(item => (
                <div key={item.service} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{item.service}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.endpoint || "All endpoints"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={(item.currentUsage / item.maxUsage > 0.9) ? "destructive" : "outline"}
                      className="rounded-full px-2"
                    >
                      {(item.currentUsage / item.maxUsage > 0.9) 
                        ? "High Usage" 
                        : (item.currentUsage / item.maxUsage > 0.7)
                          ? "Moderate"
                          : "Healthy"
                      }
                    </Badge>
                    <div className="w-16 h-2">
                      <Progress 
                        value={(item.currentUsage / item.maxUsage) * 100} 
                        className="h-2"
                        variant={getProgressColor(item.currentUsage, item.maxUsage)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border rounded-md mt-6">
              <div className="bg-muted/50 p-2 text-sm font-medium">
                Recent API Responses
              </div>
              <div className="p-2 space-y-2">
                {sampleCoins.map(coin => (
                  <div key={coin.id} className="flex justify-between items-center p-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${coin.price.toFixed(2)}</div>
                      <div className={`text-xs ${coin.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {coin.changePercent >= 0 ? '+' : ''}{coin.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiUsageMetrics;
