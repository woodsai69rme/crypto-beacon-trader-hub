
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiBotTradingProps } from "@/types/trading";
import { Bot, LineChart, TrendingUp, ArrowUpDown, PlayCircle, StopCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const AiTradingBotDetail: React.FC<AiBotTradingProps> = ({
  botId,
  strategyId,
  strategyName
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [botHealth, setBotHealth] = useState<number>(100);
  const [performance, setPerformance] = useState<{
    lastTrade: number | null;
    todayPnL: number;
    weekPnL: number;
  }>({
    lastTrade: null,
    todayPnL: 3.2,
    weekPnL: -1.4
  });
  
  const toggleBot = () => {
    if (isRunning) {
      setIsRunning(false);
      toast({
        title: "Bot Stopped",
        description: `${strategyName} AI trading bot has been stopped.`
      });
    } else {
      setIsRunning(true);
      toast({
        title: "Bot Started",
        description: `${strategyName} AI trading bot is now active.`
      });
      
      // Simulate a trade after 5 seconds
      setTimeout(() => {
        if (Math.random() > 0.5) {
          simulateTrade("buy");
        } else {
          simulateTrade("sell");
        }
      }, 5000);
    }
  };
  
  const simulateTrade = (type: "buy" | "sell") => {
    const price = type === "buy" ? 58432.15 : 58567.32;
    const amount = 0.05;
    const total = price * amount;
    
    setPerformance(prev => ({
      ...prev,
      lastTrade: type === "buy" ? price : -price
    }));
    
    toast({
      title: `${type === "buy" ? "Buy" : "Sell"} Order Executed`,
      description: `${amount} BTC at $${price.toLocaleString()} ($${total.toLocaleString()})`,
      variant: type === "buy" ? "default" : "destructive"
    });
  };
  
  return (
    <Card className="w-full bg-card shadow-lg border border-border">
      <CardHeader className="bg-card/50 border-b border-border">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Bot className="h-5 w-5" />
              {strategyName} Bot
            </CardTitle>
            <CardDescription className="text-muted-foreground">ID: {botId.substring(0, 8)}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant={botHealth > 80 ? "outline" : "destructive"} className="bg-primary/10">
              Health: {botHealth}%
            </Badge>
            {isRunning && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 animate-pulse">
                Active
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/5 p-4 rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div className="text-sm font-medium">Last Trade</div>
              {performance.lastTrade !== null ? (
                <Badge variant={performance.lastTrade > 0 ? "outline" : "destructive"}>
                  {performance.lastTrade > 0 ? "BUY" : "SELL"}
                </Badge>
              ) : (
                <Badge variant="outline" className="opacity-50">NONE</Badge>
              )}
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">
              {performance.lastTrade 
                ? `$${Math.abs(performance.lastTrade).toLocaleString()}`
                : "—"}
            </div>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div className="text-sm font-medium">Today's P&L</div>
              <TrendingUp className={`h-4 w-4 ${performance.todayPnL >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <div className={`mt-2 text-2xl font-bold ${performance.todayPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {performance.todayPnL >= 0 ? '+' : ''}{performance.todayPnL}%
            </div>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div className="text-sm font-medium">Week P&L</div>
              <ArrowUpDown className={`h-4 w-4 ${performance.weekPnL >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <div className={`mt-2 text-2xl font-bold ${performance.weekPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {performance.weekPnL >= 0 ? '+' : ''}{performance.weekPnL}%
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-sm font-medium mb-3 flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Performance Chart
          </div>
          <div className="h-[160px] flex items-center justify-center text-muted-foreground text-sm">
            Chart visualization would be displayed here
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground mb-1">Strategy</div>
            <div className="font-medium">{strategyName}</div>
            <div className="text-xs text-muted-foreground mt-2">ID: {strategyId.substring(0, 8)}</div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground mb-1">Parameters</div>
            <div className="font-medium">Default</div>
            <div className="text-xs text-muted-foreground mt-2">Configured for BTC/USD</div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-border pt-4 flex justify-between">
        <Button variant="outline">
          Configure
        </Button>
        
        <Button
          variant={isRunning ? "destructive" : "default"}
          onClick={toggleBot}
          className="min-w-[120px]"
        >
          {isRunning ? (
            <>
              <StopCircle className="mr-2 h-4 w-4" />
              Stop Bot
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Bot
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AiTradingBotDetail;
