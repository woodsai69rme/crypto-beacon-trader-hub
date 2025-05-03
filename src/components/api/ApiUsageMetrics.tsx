
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ApiUsageStats } from "@/types/trading";

interface ApiUsageMetricsProps {
  apiUsage: ApiUsageStats[];
  onRefresh: () => void;
}

const ApiUsageMetrics: React.FC<ApiUsageMetricsProps> = ({ apiUsage, onRefresh }) => {
  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>API Usage Metrics</CardTitle>
            <CardDescription>Monitor your API usage across different services</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {apiUsage.map((api) => (
            <div key={api.service} className="space-y-2">
              <div className="flex justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">{api.service}</div>
                  <div className="text-xs text-muted-foreground">
                    {api.endpoint ? api.endpoint : 'All endpoints'}
                  </div>
                </div>
                <div className="text-xs text-right">
                  <div>{api.currentUsage} / {api.maxUsage}</div>
                  <div className="text-muted-foreground">Resets at {formatTime(api.resetTime)}</div>
                </div>
              </div>
              
              <Progress value={(api.currentUsage / api.maxUsage) * 100} />
            </div>
          ))}
          
          {apiUsage.length === 0 && (
            <div className="py-6 text-center text-muted-foreground">
              No API usage data available
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="text-xs text-muted-foreground">
          API usage is updated in real-time as requests are made.
        </div>
      </CardFooter>
    </Card>
  );
};

export default ApiUsageMetrics;
