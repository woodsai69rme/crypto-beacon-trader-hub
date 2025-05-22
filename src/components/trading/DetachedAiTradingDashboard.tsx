
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { DetachableDashboardProps } from '@/types/trading';
import AdvancedAiTradingDashboard from './AdvancedAiTradingDashboard';

const DetachedAiTradingDashboard: React.FC<DetachableDashboardProps> = ({ 
  onClose,
  isDetached = true,
  children
}) => {
  if (!isDetached) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      <div className="container mx-auto p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">AI Trading Dashboard (Detached Mode)</h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children || (
            <>
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>AI Strategy Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] bg-muted rounded flex items-center justify-center">
                    <p>Performance metrics and charts will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Active Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Trend Following', 'Mean Reversion', 'Sentiment Analysis'].map(strategy => (
                      <div key={strategy} className="p-3 border rounded-md flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{strategy}</h4>
                          <p className="text-sm text-muted-foreground">Active</p>
                        </div>
                        <Button size="sm" variant="outline">Configure</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Market Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] bg-muted rounded flex items-center justify-center">
                    <p>AI market predictions will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Trading Signals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] bg-muted rounded flex items-center justify-center">
                    <p>AI-generated trading signals</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Strategy Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] bg-muted rounded flex items-center justify-center">
                    <p>Build and customize trading strategies</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Backtest Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] bg-muted rounded flex items-center justify-center">
                    <p>View historical strategy performance</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetachedAiTradingDashboard;
