
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiBotTradingProps } from '@/types/trading';

const AiTradingBotDetail: React.FC<AiBotTradingProps> = ({ 
  botId, 
  strategyId, 
  strategyName 
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">AI Trading Bot: {botId}</CardTitle>
            <CardDescription>
              Strategy: {strategyName} ({strategyId})
            </CardDescription>
          </div>
          <Badge>Active</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Performance</div>
            <div className="text-2xl font-bold text-green-500">+12.8%</div>
            <div className="text-xs text-muted-foreground">Past 30 days</div>
          </div>
          
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Trades</div>
            <div className="text-2xl font-bold">24</div>
            <div className="text-xs text-muted-foreground">Total executed</div>
          </div>
          
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
            <div className="text-2xl font-bold">68%</div>
            <div className="text-xs text-muted-foreground">16/24 profitable trades</div>
          </div>
        </div>
        
        <div className="bg-muted/20 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-3">Strategy Details</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-3 text-sm">
              <div className="text-muted-foreground">Type:</div>
              <div className="col-span-2">Trend Following + ML</div>
            </div>
            
            <div className="grid grid-cols-3 text-sm">
              <div className="text-muted-foreground">Risk Level:</div>
              <div className="col-span-2">Medium</div>
            </div>
            
            <div className="grid grid-cols-3 text-sm">
              <div className="text-muted-foreground">Timeframe:</div>
              <div className="col-span-2">4h</div>
            </div>
            
            <div className="grid grid-cols-3 text-sm">
              <div className="text-muted-foreground">Assets:</div>
              <div className="col-span-2">BTC, ETH, SOL</div>
            </div>
            
            <div className="grid grid-cols-3 text-sm">
              <div className="text-muted-foreground">Max Allocation:</div>
              <div className="col-span-2">25% per position</div>
            </div>
            
            <div className="grid grid-cols-3 text-sm">
              <div className="text-muted-foreground">Stop Loss:</div>
              <div className="col-span-2">5% (trailing 2%)</div>
            </div>
            
            <div className="grid grid-cols-3 text-sm">
              <div className="text-muted-foreground">Take Profit:</div>
              <div className="col-span-2">Multiple targets (8%, 15%, 25%)</div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline">View Trade History</Button>
        <Button>Edit Bot Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default AiTradingBotDetail;
