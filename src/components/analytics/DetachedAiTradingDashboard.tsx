
import React from 'react';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DetachableDashboardProps } from '@/types/trading';

const DetachedAiTradingDashboard: React.FC<DetachableDashboardProps> = ({
  initialCoinId,
  refreshInterval,
  onClose,
  darkMode = false,
  isDetached = true,
  children
}) => {
  if (!isDetached) {
    return <>{children}</>;
  }
  
  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      <div className="container mx-auto p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">AI Trading Dashboard</h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] bg-muted rounded flex items-center justify-center">
                Market overview chart
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] bg-muted rounded flex items-center justify-center">
                AI predictions chart
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Trading Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] bg-muted rounded flex items-center justify-center">
                Trading signals
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted rounded flex items-center justify-center">
                Performance chart
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Strategy Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted rounded flex items-center justify-center">
                Strategy configuration
              </div>
            </CardContent>
          </Card>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default DetachedAiTradingDashboard;
