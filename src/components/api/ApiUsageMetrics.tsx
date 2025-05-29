
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ApiUsageStats } from "@/types/trading";

interface ApiUsageMetricsProps {
  data: ApiUsageStats[];
  onRefresh: () => void;
}

const ApiUsageMetrics: React.FC<ApiUsageMetricsProps> = ({ data, onRefresh }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">API Usage Metrics</CardTitle>
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => {
            const usagePercentage = (item.currentUsage / item.maxUsage) * 100;
            
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.service || item.provider}</span>
                  <span className="text-muted-foreground">
                    {item.currentUsage} / {item.maxUsage} requests
                  </span>
                </div>
                
                <Progress 
                  value={usagePercentage} 
                  className={`h-2 ${usagePercentage > 80 ? 'bg-red-200' : 'bg-slate-200'}`}
                />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  {item.endpoint && <span>Endpoint: {item.endpoint}</span>}
                  {item.resetTime && <span>Resets: {item.resetTime}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiUsageMetrics;
