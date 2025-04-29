
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AiBotTradingProps } from '@/types/trading';
import { Bot, Play, Pause, Settings, TrendingUp, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';

const AiTradingBotDetail: React.FC<AiBotTradingProps> = ({ botId, strategyId, strategyName }) => {
  const [isActive, setIsActive] = useState(false);
  const [performance, setPerformance] = useState(0);
  const [tradeCount, setTradeCount] = useState(0);
  const [lastTrade, setLastTrade] = useState<string | null>(null);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  
  // Simulate bot activation
  const handleToggleBot = () => {
    if (isActive) {
      toast({
        title: "Bot Deactivated",
        description: `${strategyName} trading bot has been stopped`
      });
    } else {
      toast({
        title: "Bot Activated",
        description: `${strategyName} trading bot is now running`
      });
      
      // Simulate initial trade
      setTimeout(() => {
        setTradeCount(prev => prev + 1);
        setLastTrade(new Date().toISOString());
        setPerformance(2.8);
      }, 2000);
    }
    
    setIsActive(!isActive);
  };
  
  // Simulate system resource usage changes
  React.useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setCpuUsage(Math.random() * 15 + 5); // 5-20%
        setMemoryUsage(Math.random() * 200 + 100); // 100-300 MB
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isActive]);
  
  // Get status badge
  const getStatusBadge = () => {
    if (!isActive) {
      return <Badge variant="outline" className="bg-muted/20">Inactive</Badge>;
    }
    return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Active</Badge>;
  };
  
  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              {strategyName}
            </CardTitle>
            <CardDescription>AI Trading Bot {botId}</CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/20 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Performance</div>
            <div className={`text-lg font-bold ${performance > 0 ? 'text-green-500' : performance < 0 ? 'text-red-500' : ''}`}>
              {performance > 0 ? '+' : ''}{performance}%
            </div>
          </div>
          
          <div className="bg-muted/20 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Trades Executed</div>
            <div className="text-lg font-bold">{tradeCount}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>CPU Usage</span>
            <span>{cpuUsage.toFixed(1)}%</span>
          </div>
          <Progress value={cpuUsage} />
          
          <div className="flex justify-between text-sm mt-2">
            <span>Memory Usage</span>
            <span>{memoryUsage.toFixed(0)} MB</span>
          </div>
          <Progress value={memoryUsage/5} />
        </div>
        
        {lastTrade && (
          <div className="text-xs text-muted-foreground">
            Last trade: {new Date(lastTrade).toLocaleString()}
          </div>
        )}
        
        <div className="pt-2 flex gap-2">
          <Button 
            variant={isActive ? "destructive" : "default"} 
            className="flex-1"
            onClick={handleToggleBot}
          >
            {isActive ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {isActive ? "Stop Bot" : "Start Bot"}
          </Button>
          
          <Button variant="outline" className="px-3">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        {isActive && (
          <div className="flex items-center p-2 bg-amber-500/10 border border-amber-500/20 rounded-md gap-2 mt-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <span className="text-xs">
              Bot is running in simulation mode. No real trades will be executed.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiTradingBotDetail;
