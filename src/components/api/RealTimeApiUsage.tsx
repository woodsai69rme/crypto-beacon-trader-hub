
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ApiUsageStats } from '@/types/trading';
import { CircleAlert, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface RealTimeApiUsageProps {
  selectedService?: string;
  onServiceSelect?: (service: string) => void;
}

const RealTimeApiUsage: React.FC<RealTimeApiUsageProps> = ({ 
  selectedService, 
  onServiceSelect 
}) => {
  const [apiStats, setApiStats] = useState<ApiUsageStats[]>([
    {
      service: "CoinGecko",
      currentUsage: 42,
      maxUsage: 50,
      resetTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      endpoint: "/coins/markets"
    },
    {
      service: "CoinGecko",
      currentUsage: 15,
      maxUsage: 30,
      resetTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      endpoint: "/coins/{id}"
    },
    {
      service: "TradingView",
      currentUsage: 85,
      maxUsage: 100,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endpoint: "/chart"
    },
    {
      service: "CryptoCompare",
      currentUsage: 9500,
      maxUsage: 10000,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endpoint: "/price/multi"
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const refreshUsage = () => {
    setIsLoading(true);
    
    // Simulate API call to refresh usage data
    setTimeout(() => {
      // Randomly update the usage stats
      setApiStats(prev => prev.map(stat => ({
        ...stat,
        currentUsage: Math.min(stat.maxUsage, Math.floor(Math.random() * stat.maxUsage))
      })));
      
      setIsLoading(false);
      
      toast({
        title: "API Usage Refreshed",
        description: "Real-time API usage statistics have been updated"
      });
    }, 1000);
  };

  // Filter by selected service if provided
  const filteredStats = selectedService
    ? apiStats.filter(stat => stat.service === selectedService)
    : apiStats;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Real-Time API Usage</CardTitle>
            <CardDescription>Monitor your API rate limits and usage</CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={refreshUsage}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredStats.map((stat, index) => {
            const usagePercent = (stat.currentUsage / stat.maxUsage) * 100;
            const timeToReset = new Date(stat.resetTime || "").getTime() - Date.now();
            const hoursToReset = Math.floor(timeToReset / (1000 * 60 * 60));
            const minutesToReset = Math.floor((timeToReset % (1000 * 60 * 60)) / (1000 * 60));
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{stat.service}</span>
                    <span className="text-sm text-muted-foreground ml-2">{stat.endpoint}</span>
                  </div>
                  
                  {usagePercent > 80 && (
                    <Badge variant="destructive" className="flex items-center">
                      <CircleAlert className="h-3 w-3 mr-1" />
                      Critical
                    </Badge>
                  )}
                  
                  {usagePercent > 60 && usagePercent <= 80 && (
                    <Badge variant="warning" className="bg-yellow-500 text-white">Warning</Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{stat.currentUsage} of {stat.maxUsage} requests</span>
                    <span>Resets in {hoursToReset}h {minutesToReset}m</span>
                  </div>
                  
                  <Progress
                    value={usagePercent}
                    className={`${
                      usagePercent > 80 ? 'bg-red-200' : 
                      usagePercent > 60 ? 'bg-yellow-200' : 
                      'bg-muted'
                    }`}
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(usagePercent)}% Used</span>
                    <span>{Math.round(100 - usagePercent)}% Available</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredStats.length === 0 && (
            <div className="text-center p-6 text-muted-foreground">
              No API usage data available for this service
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeApiUsage;
