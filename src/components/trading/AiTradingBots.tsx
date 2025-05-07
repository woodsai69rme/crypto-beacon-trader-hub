
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bot, Brain, TrendingUp, Activity, BarChart2, Play, Pause, Maximize2 } from "lucide-react";
import { AITradingStrategy } from "@/types/trading";
import ModelTrainingPanel from "./ModelTrainingPanel";
import ModelConfigPanel from "./ModelConfigPanel";
import LiveAnalyticsDashboard from "../analytics/LiveAnalyticsDashboard";

// Mock strategies
const strategies: AITradingStrategy[] = [
  {
    id: 'ai-trend-following-btc',
    name: 'AI Trend Following BTC',
    description: 'AI-powered trend following for Bitcoin',
    type: 'trend-following',
    timeframe: '4h',
    parameters: {
      lookbackPeriod: 14,
      stopLoss: 2.5,
      takeProfit: 5,
      capitalAllocation: 10
    }
  },
  {
    id: 'ai-mean-reversion-eth',
    name: 'AI Mean Reversion ETH',
    description: 'AI-powered mean reversion for Ethereum',
    type: 'mean-reversion',
    timeframe: '1h',
    parameters: {
      lookbackPeriod: 24,
      stopLoss: 3,
      takeProfit: 4,
      capitalAllocation: 15
    }
  },
  {
    id: 'ai-momentum-sol',
    name: 'AI Momentum SOL',
    description: 'AI-powered momentum strategy for Solana',
    type: 'momentum',
    timeframe: '1d',
    parameters: {
      lookbackPeriod: 7,
      stopLoss: 5,
      takeProfit: 10,
      capitalAllocation: 8
    }
  },
];

interface BotConfig {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    allTime: number;
  };
  trades: number;
  winRate: number;
}

const bots: BotConfig[] = [
  {
    id: 'bot-1',
    name: 'BTC Momentum Bot',
    status: 'running',
    performance: {
      daily: 1.2,
      weekly: 4.5,
      monthly: 12.3,
      allTime: 28.7
    },
    trades: 156,
    winRate: 67.3
  },
  {
    id: 'bot-2',
    name: 'ETH Swing Trader',
    status: 'stopped',
    performance: {
      daily: 0,
      weekly: 2.1,
      monthly: 8.9,
      allTime: 15.2
    },
    trades: 94,
    winRate: 61.8
  },
  {
    id: 'bot-3',
    name: 'SOL Breakout Bot',
    status: 'error',
    performance: {
      daily: -0.8,
      weekly: 3.2,
      monthly: 9.5,
      allTime: 22.1
    },
    trades: 127,
    winRate: 64.5
  },
];

const AiTradingBots: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('lstm-attention');
  const [timeframe, setTimeframe] = useState<string>('1h');
  const [activeServerId, setActiveServerId] = useState<string>('local-server-1');
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [activeBotTab, setActiveBotTab] = useState<string>("existing");
  
  const startTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        return prev + 5;
      });
    }, 500);
  };
  
  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Trading Bots
            </CardTitle>
            <CardDescription>
              Deploy AI-powered trading bots with custom strategies
            </CardDescription>
          </div>
          <div className="flex items-center mt-2 sm:mt-0">
            <Button variant="outline" size="sm" onClick={toggleAnalytics} className="gap-2">
              <BarChart2 className="h-4 w-4" />
              {showAnalytics ? "Hide Analytics" : "Show Analytics"}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {showAnalytics && (
          <div className="mb-6">
            <LiveAnalyticsDashboard />
          </div>
        )}
      
        <Tabs defaultValue={activeBotTab} onValueChange={setActiveBotTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="existing">Active Bots</TabsTrigger>
            <TabsTrigger value="create">Create Bot</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="existing" className="m-0 space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bot</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Win Rate</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bots.map((bot) => (
                    <TableRow key={bot.id}>
                      <TableCell className="font-medium">{bot.name}</TableCell>
                      <TableCell>
                        {bot.status === 'running' && (
                          <Badge className="bg-green-500">Running</Badge>
                        )}
                        {bot.status === 'stopped' && (
                          <Badge variant="outline">Stopped</Badge>
                        )}
                        {bot.status === 'error' && (
                          <Badge variant="destructive">Error</Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{bot.winRate}%</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={bot.performance.daily >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {bot.performance.daily >= 0 ? '+' : ''}{bot.performance.daily}%
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({bot.performance.allTime >= 0 ? '+' : ''}{bot.performance.allTime}% all-time)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {bot.status === 'running' ? (
                          <Button variant="ghost" size="sm">
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  <Bot className="h-4 w-4 mr-2" />
                  Deploy New Bot
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="create" className="m-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Bot Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                          <Label htmlFor="bot-name">Bot Name</Label>
                          <input 
                            id="bot-name"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter bot name"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label>Trading Pair</Label>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">BTC/USD</Button>
                            <Button variant="outline" className="flex-1">ETH/USD</Button>
                            <Button variant="outline" className="flex-1">SOL/USD</Button>
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label>Capital Allocation</Label>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">5%</Button>
                            <Button variant="outline" className="flex-1">10%</Button>
                            <Button variant="outline" className="flex-1">25%</Button>
                            <Button variant="outline" className="flex-1">50%</Button>
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label>Risk Level</Label>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">Low</Button>
                            <Button variant="outline" className="flex-1">Medium</Button>
                            <Button variant="outline" className="flex-1">High</Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch id="auto-compound" />
                          <Label htmlFor="auto-compound">Auto-compound profits</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch id="notification" defaultChecked />
                          <Label htmlFor="notification">Receive trade notifications</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <ModelConfigPanel
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                    timeframe={timeframe}
                    setTimeframe={setTimeframe}
                    activeServerId={activeServerId}
                    isTraining={isTraining}
                    trainingProgress={trainingProgress}
                    startTraining={startTraining}
                  />
                </div>
              </div>
              
              <Button className="w-full">
                <Bot className="h-4 w-4 mr-2" />
                Deploy AI Trading Bot
              </Button>
            </TabsContent>
            
            <TabsContent value="strategies" className="m-0">
              <div className="space-y-4">
                {strategies.map(strategy => (
                  <Card key={strategy.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium flex items-center">
                            <Brain className="h-4 w-4 mr-2" />
                            {strategy.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {strategy.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{strategy.type}</Badge>
                            <Badge variant="outline">{strategy.timeframe}</Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Backtest
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {Object.entries(strategy.parameters).map(([key, value]) => (
                          <div key={key} className="border rounded p-2">
                            <div className="text-xs text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            <div className="font-medium">{value}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    <Brain className="h-4 w-4 mr-2" />
                    Create New Strategy
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-4 pb-0">
        <div className="flex items-center w-full justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Activity className="h-4 w-4 mr-1" />
            <span>3 active bots</span>
          </div>
          <div>Last trade: 5 minutes ago</div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AiTradingBots;
