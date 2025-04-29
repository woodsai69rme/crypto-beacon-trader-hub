
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { LineChart, Bot, TrendingUp, ArrowUpDown, PlayCircle, StopCircle, AlertCircle, Settings } from "lucide-react";
import { AiBotTradingProps } from '../trading/types';
import { toast } from "@/components/ui/use-toast";

const AiTradingBotDetail: React.FC<AiBotTradingProps> = ({ botId, strategyId, strategyName }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h");
  const [selectedPair, setSelectedPair] = useState("BTC/USD");
  const [runHistory, setRunHistory] = useState<any[]>([]);
  const [botPerformance, setBotPerformance] = useState({
    winRate: 67.5,
    totalTrades: 42,
    profitFactor: 1.85,
    sharpeRatio: 1.32
  });
  
  useEffect(() => {
    // Generate some mock run history
    const mockHistory = Array(5).fill(0).map((_, i) => ({
      id: `run-${i + 1}`,
      startTime: new Date(Date.now() - (i * 86400000)).toISOString(),
      duration: `${Math.floor(Math.random() * 12) + 1}h ${Math.floor(Math.random() * 60)}m`,
      trades: Math.floor(Math.random() * 20) + 1,
      profit: (Math.random() * 10) - 3,
      status: i === 0 && isRunning ? 'active' : 'completed'
    }));
    
    setRunHistory(mockHistory);
  }, [isRunning]);
  
  const handleStartBot = () => {
    setIsRunning(true);
    toast({
      title: "Bot Started",
      description: `${strategyName} is now analyzing the market`,
    });
  };
  
  const handleStopBot = () => {
    setIsRunning(false);
    toast({
      title: "Bot Stopped",
      description: `${strategyName} has been stopped`,
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              {strategyName}
            </CardTitle>
            <CardDescription>
              AI Trading Bot #{botId.substring(0, 6)}
            </CardDescription>
          </div>
          {isRunning ? (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 animate-pulse">
              Active
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-muted text-muted-foreground">
              Inactive
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="settings">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="history">Run History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4 pt-4">
            <div>
              <div className="text-sm font-medium mb-2">Trading Pair</div>
              <Select value={selectedPair} onValueChange={setSelectedPair}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC/USD">BTC/USD</SelectItem>
                  <SelectItem value="ETH/USD">ETH/USD</SelectItem>
                  <SelectItem value="SOL/USD">SOL/USD</SelectItem>
                  <SelectItem value="ADA/USD">ADA/USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Timeframe</div>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="1d">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Investment Amount per Trade</div>
              <div className="flex w-full items-center space-x-2">
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  defaultValue="100.00" 
                />
                <Select defaultValue="USD">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Risk Level</div>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Advanced Settings</div>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configure Parameters
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="pt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                  <div className="text-2xl font-bold">{botPerformance.winRate}%</div>
                  <Progress value={botPerformance.winRate} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Total Trades</div>
                  <div className="text-2xl font-bold">{botPerformance.totalTrades}</div>
                  <Progress value={botPerformance.totalTrades / 100 * 100} className="h-2" max={100} />
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Profit Factor</div>
                  <div className="text-2xl font-bold">{botPerformance.profitFactor}</div>
                  <Progress value={botPerformance.profitFactor / 3 * 100} className="h-2" max={100} />
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                  <div className="text-2xl font-bold">{botPerformance.sharpeRatio}</div>
                  <Progress value={botPerformance.sharpeRatio / 3 * 100} className="h-2" max={100} />
                </div>
              </div>
              
              <div className="h-64 border rounded-lg flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <LineChart className="h-10 w-10" />
                  <p>Performance chart will render here</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="pt-4">
            <div className="space-y-4">
              <div className="rounded-md border">
                <div className="bg-muted/50 p-2 grid grid-cols-5 text-xs font-medium">
                  <div>Run ID</div>
                  <div>Start Time</div>
                  <div>Duration</div>
                  <div>Trades</div>
                  <div>Profit/Loss</div>
                </div>
                <div className="divide-y">
                  {runHistory.map((run) => (
                    <div 
                      key={run.id} 
                      className={`p-2 grid grid-cols-5 text-sm ${
                        run.status === 'active' ? 'bg-green-500/5' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {run.status === 'active' && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
                        {run.id}
                      </div>
                      <div>{new Date(run.startTime).toLocaleString()}</div>
                      <div>{run.duration}</div>
                      <div>{run.trades}</div>
                      <div className={run.profit >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {run.profit >= 0 ? '+' : ''}{run.profit.toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        {isRunning ? (
          <>
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
              <span className="text-sm">Running since {new Date(runHistory[0]?.startTime).toLocaleString()}</span>
            </div>
            <Button variant="destructive" onClick={handleStopBot}>
              <StopCircle className="mr-2 h-4 w-4" />
              Stop Bot
            </Button>
          </>
        ) : (
          <>
            <div className="text-sm text-muted-foreground">
              Bot is currently not running
            </div>
            <Button onClick={handleStartBot}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Bot
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default AiTradingBotDetail;
