
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ApiUsageStats } from '@/types/api';
import { RefreshCw } from 'lucide-react';

interface ApiUsageMetricsProps {
  apiUsage: ApiUsageStats[];
  onRefresh: () => void;
}

const ApiUsageMetrics: React.FC<ApiUsageMetricsProps> = ({ apiUsage, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<string>('usage');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  const getUsagePercentage = (current: number, max: number) => {
    return Math.min(Math.round((current / max) * 100), 100);
  };
  
  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  const formatDateTime = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleString();
    } catch (e) {
      return dateTimeStr;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>API Usage Metrics</CardTitle>
            <CardDescription>
              Monitor your API usage across different services
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 px-2"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="usage">Current Usage</TabsTrigger>
            <TabsTrigger value="history">Usage History</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoint Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="usage">
            <div className="space-y-6">
              {apiUsage.map((stat) => {
                const percentage = getUsagePercentage(stat.currentUsage, stat.maxUsage);
                return (
                  <div key={stat.service} className="space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-sm">{stat.service}</h3>
                        <p className="text-xs text-muted-foreground">
                          {stat.endpoint ? `Endpoint: ${stat.endpoint}` : 'All endpoints'}
                        </p>
                      </div>
                      <div className="text-right text-xs">
                        <p>{stat.currentUsage} / {stat.maxUsage}</p>
                        <p className="text-muted-foreground">
                          Resets: {formatDateTime(stat.resetTime)}
                        </p>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full ${getUsageColor(percentage)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              
              {apiUsage.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No API usage data available</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="text-center py-8 text-muted-foreground">
              <p>Usage history will be displayed here</p>
              <p className="text-xs mt-2">Feature coming soon</p>
            </div>
          </TabsContent>
          
          <TabsContent value="endpoints">
            <div className="text-center py-8 text-muted-foreground">
              <p>Endpoint analysis will be displayed here</p>
              <p className="text-xs mt-2">Feature coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiUsageMetrics;
