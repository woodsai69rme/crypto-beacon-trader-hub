
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { 
  Bot, Brain, TrendingUp, ArrowUpDown, PlayCircle, StopCircle, 
  Cpu, LineChart, AlertCircle, Activity, BarChart3, Settings,
  History, FileText, PieChart, Maximize, Minimize, Zap, Check, X
} from "lucide-react";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { startPriceMonitoring } from "@/services/priceMonitoring";
import { AITradingStrategy, CoinOption } from "@/types/trading";
import { AVAILABLE_STRATEGIES } from "@/services/aiTradingService";
import AiTradingBotDetail from "./AiTradingBotDetail";

interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  type: 'signal' | 'trade' | 'alert' | 'system' | 'info';
  message: string;
  details?: string;
  coin?: string;
  value?: number;
  success?: boolean;
}

interface BotPerformanceData {
  time: string;
  value: number;
  benchmark: number;
}

interface BotSettings {
  riskLevel: number;
  maxPositionSize: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  trailingStopEnabled: boolean;
  trailingStopDistance: number;
  tradingHoursOnly: boolean;
  autoRebalance: boolean;
  rebalanceFrequency: 'daily' | 'weekly' | 'monthly';
  maxDrawdownPercent: number;
  useMarketSentiment: boolean;
  sentimentWeight: number;
}

const AiTradingDetailedDashboard: React.FC = () => {
  // Bot state management
  const [activeBot, setActiveBot] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [detachedView, setDetachedView] = useState<boolean>(false);
  const [dashboardSize, setDashboardSize] = useState<'default' | 'compact' | 'expanded'>('default');
  
  // Data state
  const [marketData, setMarketData] = useState<CoinOption[]>([]);
  const [tradingPairs, setTradingPairs] = useState<string[]>(["BTC/USD", "ETH/USD", "SOL/USD", "ADA/USD", "XRP/USD"]);
  const [selectedPair, setSelectedPair] = useState<string>("BTC/USD");
  const [lastSignal, setLastSignal] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1h");
  
  // Activity log
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [filteredLog, setFilteredLog] = useState<ActivityLogEntry[]>([]);
  const [logFilter, setLogFilter] = useState<string>('all');
  
  // Performance data
  const [performanceData, setPerformanceData] = useState<BotPerformanceData[]>([]);
  const [botStats, setBotStats] = useState({
    totalTrades: 0,
    winRate: 0,
    profitLoss: 0,
    drawdown: 0,
    lastTradeTime: null as Date | null,
    avgTradeLength: '0h 0m',
    avgProfitPerTrade: 0
  });
  
  // Bot settings
  const [botSettings, setBotSettings] = useState<BotSettings>({
    riskLevel: 5,
    maxPositionSize: 10,
    stopLossPercent: 3,
    takeProfitPercent: 5,
    trailingStopEnabled: true,
    trailingStopDistance: 1.5,
    tradingHoursOnly: false,
    autoRebalance: true,
    rebalanceFrequency: 'daily',
    maxDrawdownPercent: 15,
    useMarketSentiment: true,
    sentimentWeight: 30
  });

  // Initialize with demo data
  useEffect(() => {
    // Generate initial performance data
    const initialPerformanceData: BotPerformanceData[] = [];
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      initialPerformanceData.push({
        time: date.toLocaleDateString(),
        value: 100 + Math.random() * 20 - (i === 0 ? 0 : initialPerformanceData[initialPerformanceData.length - 1].value - 100),
        benchmark: 100 + Math.random() * 10 - 5
      });
    }
    setPerformanceData(initialPerformanceData);

    // Generate sample activity logs
    const initialActivityLog: ActivityLogEntry[] = [];
    for (let i = 20; i >= 0; i--) {
      const logDate = new Date(now);
      logDate.setMinutes(logDate.getMinutes() - i * 15);
      
      const types = ['signal', 'trade', 'alert', 'system', 'info'];
      const type = types[Math.floor(Math.random() * types.length)] as ActivityLogEntry['type'];
      let message = '';
      
      switch (type) {
        case 'signal':
          message = `${Math.random() > 0.5 ? 'BUY' : 'SELL'} signal for ${tradingPairs[Math.floor(Math.random() * tradingPairs.length)]}`;
          break;
        case 'trade':
          message = `${Math.random() > 0.5 ? 'Bought' : 'Sold'} ${(Math.random() * 0.5).toFixed(4)} ${tradingPairs[Math.floor(Math.random() * tradingPairs.length)].split('/')[0]}`;
          break;
        case 'alert':
          message = `Price alert triggered for ${tradingPairs[Math.floor(Math.random() * tradingPairs.length)]}`;
          break;
        case 'system':
          message = `System ${Math.random() > 0.3 ? 'started' : 'stopped'} AI Trading Bot`;
          break;
        case 'info':
          message = `Market analysis completed for ${tradingPairs[Math.floor(Math.random() * tradingPairs.length)]}`;
          break;
      }
      
      initialActivityLog.push({
        id: `log-${i}`,
        timestamp: logDate,
        type,
        message,
        coin: type !== 'system' ? tradingPairs[Math.floor(Math.random() * tradingPairs.length)].split('/')[0] : undefined,
        value: type === 'trade' ? Math.random() * 1000 : undefined,
        success: type === 'trade' ? Math.random() > 0.3 : undefined
      });
    }
    setActivityLog(initialActivityLog);
    setFilteredLog(initialActivityLog);
    
    // Set up coin monitoring
    const coinIds = ["bitcoin", "ethereum", "solana", "cardano", "ripple", "dogecoin"];
    
    const stopMonitoring = startPriceMonitoring(
      coinIds,
      (updatedCoins) => {
        setMarketData(updatedCoins);
        
        // Simulate AI bot generating trading signals if running
        if (isRunning && activeBot && Math.random() > 0.8) {
          generateTradingSignal(activeBot, selectedPair);
        }
      },
      3000 // Update every 3 seconds
    );
    
    return () => stopMonitoring();
  }, [isRunning, activeBot, selectedPair]);
  
  // Filter activity logs when the filter changes
  useEffect(() => {
    if (logFilter === 'all') {
      setFilteredLog(activityLog);
    } else {
      setFilteredLog(activityLog.filter(log => log.type === logFilter));
    }
  }, [logFilter, activityLog]);
  
  // Add new log entry
  const addLogEntry = (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: ActivityLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      ...entry
    };
    
    setActivityLog(prev => [newEntry, ...prev]);
  };

  // Start bot
  const startBot = () => {
    if (!activeBot) {
      toast({
        title: "Error",
        description: "Please select an AI trading bot first",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunning(true);
    
    const selectedBot = AVAILABLE_STRATEGIES.find(bot => bot.id === activeBot);
    
    toast({
      title: "AI Bot Started",
      description: `${selectedBot?.name} is now analyzing market data`
    });
    
    addLogEntry({
      type: 'system',
      message: `Started AI Trading Bot: ${selectedBot?.name}`,
    });
    
    // Simulate initial signal
    generateTradingSignal(activeBot, selectedPair);
  };
  
  // Stop bot
  const stopBot = () => {
    setIsRunning(false);
    
    const selectedBot = AVAILABLE_STRATEGIES.find(bot => bot.id === activeBot);
    
    toast({
      title: "AI Bot Stopped",
      description: `${selectedBot?.name} has been stopped`
    });
    
    addLogEntry({
      type: 'system',
      message: `Stopped AI Trading Bot: ${selectedBot?.name}`,
    });
  };
  
  // Generate trading signal
  const generateTradingSignal = (botId: string, pair: string) => {
    const signalTypes = ["BUY", "SELL", "HOLD"];
    const confidenceLevels = ["High", "Medium", "Low"];
    const randomSignal = signalTypes[Math.floor(Math.random() * signalTypes.length)];
    const randomConfidence = confidenceLevels[Math.floor(Math.random() * confidenceLevels.length)];
    
    const signal = `${randomSignal} ${pair} (${randomConfidence} confidence)`;
    setLastSignal(signal);
    
    addLogEntry({
      type: 'signal',
      message: `${randomSignal} signal generated for ${pair}`,
      details: `${randomConfidence} confidence level`,
      coin: pair.split('/')[0]
    });
    
    // Simulate a trade based on the signal (not for HOLD)
    if (randomSignal !== "HOLD" && Math.random() > 0.5) {
      setTimeout(() => {
        const amount = (Math.random() * 0.5).toFixed(4);
        const price = marketData.find(c => c.symbol === pair.split('/')[0])?.price || 0;
        const totalValue = parseFloat(amount) * price;
        const isSuccessful = Math.random() > 0.2;
        
        addLogEntry({
          type: 'trade',
          message: `${randomSignal === "BUY" ? "Bought" : "Sold"} ${amount} ${pair.split('/')[0]}`,
          details: `Price: $${price.toFixed(2)}, Total: $${totalValue.toFixed(2)}`,
          coin: pair.split('/')[0],
          value: totalValue,
          success: isSuccessful
        });
        
        // Update bot stats
        setBotStats(prev => ({
          ...prev,
          totalTrades: prev.totalTrades + 1,
          winRate: Math.round((prev.winRate * prev.totalTrades + (isSuccessful ? 1 : 0)) / (prev.totalTrades + 1) * 100) / 100,
          profitLoss: prev.profitLoss + (isSuccessful ? totalValue * 0.05 : -totalValue * 0.03),
          lastTradeTime: new Date(),
          avgProfitPerTrade: (prev.avgProfitPerTrade * prev.totalTrades + (isSuccessful ? totalValue * 0.05 : -totalValue * 0.03)) / (prev.totalTrades + 1)
        }));
        
        // Notify user
        if (randomSignal !== "HOLD") {
          toast({
            title: `${randomSignal} Order ${isSuccessful ? "Executed" : "Failed"}`,
            description: `${pair} - ${amount} at $${price.toFixed(2)}`,
            variant: isSuccessful ? "default" : "destructive"
          });
        }
        
        // Update performance data
        if (randomSignal !== "HOLD") {
          setPerformanceData(prev => {
            const lastEntry = prev[prev.length - 1];
            const newValue = lastEntry.value * (1 + (isSuccessful ? 0.01 : -0.005));
            return [
              ...prev,
              {
                time: new Date().toLocaleTimeString(),
                value: newValue,
                benchmark: lastEntry.benchmark * (1 + (Math.random() * 0.006 - 0.003))
              }
            ];
          });
        }
      }, Math.random() * 3000 + 1000);
    }
    
    // Sometimes generate an alert
    if (Math.random() > 0.8) {
      setTimeout(() => {
        const isTechnical = Math.random() > 0.5;
        const alertType = isTechnical ? 
          ['MA Crossover', 'RSI Oversold', 'RSI Overbought', 'MACD Signal', 'Volume Spike'][Math.floor(Math.random() * 5)] :
          ['Support Break', 'Resistance Break', 'Trend Change', 'Pattern Formation', 'Divergence Detected'][Math.floor(Math.random() * 5)];
          
        addLogEntry({
          type: 'alert',
          message: `${alertType} detected for ${pair}`,
          details: `Confidence: ${randomConfidence}`,
          coin: pair.split('/')[0]
        });
      }, Math.random() * 5000 + 3000);
    }
  };

  // Toggle detached view
  const toggleDetachedView = () => {
    setDetachedView(!detachedView);
    toast({
      title: detachedView ? "Dashboard Attached" : "Dashboard Detached",
      description: detachedView ? "The dashboard is now integrated with the main view" : "The dashboard is now in detached mode"
    });
  };

  // Toggle dashboard size
  const cycleDashboardSize = () => {
    const sizes: Array<'default' | 'compact' | 'expanded'> = ['default', 'compact', 'expanded'];
    const currentIndex = sizes.indexOf(dashboardSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setDashboardSize(sizes[nextIndex]);
    
    toast({
      title: "Dashboard Size Changed",
      description: `Size set to: ${sizes[nextIndex]}`
    });
  };

  // Handle setting changes
  const updateSetting = <K extends keyof BotSettings>(key: K, value: BotSettings[K]) => {
    setBotSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    addLogEntry({
      type: 'system',
      message: `Bot setting updated: ${key}`,
      details: `New value: ${value}`
    });
  };

  const getLogIcon = (type: ActivityLogEntry['type']) => {
    switch(type) {
      case 'signal': return <TrendingUp className="h-4 w-4" />;
      case 'trade': return <ArrowUpDown className="h-4 w-4" />;
      case 'alert': return <AlertCircle className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      case 'info': return <Brain className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };
  
  const getLogColor = (type: ActivityLogEntry['type'], success?: boolean) => {
    if (type === 'trade' && success !== undefined) {
      return success ? 'text-green-500' : 'text-red-500';
    }
    
    switch(type) {
      case 'signal': return 'text-blue-500';
      case 'alert': return 'text-amber-500';
      case 'system': return 'text-purple-500';
      case 'info': return 'text-cyan-500';
      default: return '';
    }
  };

  // Wrapper class based on display mode
  const dashboardWrapperClass = detachedView 
    ? "fixed top-20 right-5 z-50 shadow-xl border border-border rounded-lg bg-card w-auto transition-all duration-300 ease-in-out"
    : "w-full";
    
  const dashboardSizeClass = {
    compact: detachedView ? "max-w-md" : "",
    default: detachedView ? "w-[600px]" : "",
    expanded: detachedView ? "w-[900px]" : ""
  }[dashboardSize];

  return (
    <div className={`${dashboardWrapperClass} ${dashboardSizeClass}`}>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Trading Dashboard
              </CardTitle>
              <CardDescription>
                Advanced real-time monitoring and control for AI trading
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {isRunning && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 animate-pulse">
                  AI Active
                </Badge>
              )}
              <Button variant="outline" size="icon" onClick={toggleDetachedView}>
                {detachedView ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={cycleDashboardSize}>
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-4">
              <div className="text-sm font-medium">Select AI Bot</div>
              <div className="grid grid-cols-1 gap-2">
                {AVAILABLE_STRATEGIES.map(strategy => (
                  <Button
                    key={strategy.id}
                    variant={activeBot === strategy.id ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setActiveBot(strategy.id)}
                    disabled={isRunning}
                  >
                    <div className="mr-2">
                      {strategy.type === 'trend-following' && <TrendingUp className="h-4 w-4" />}
                      {strategy.type === 'mean-reversion' && <ArrowUpDown className="h-4 w-4" />}
                      {strategy.type === 'custom' && <Brain className="h-4 w-4" />}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">{strategy.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{strategy.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm font-medium">Trading Parameters</div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs mb-1">Trading Pair</div>
                  <Select value={selectedPair} onValueChange={setSelectedPair} disabled={isRunning}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tradingPairs.map(pair => (
                        <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <div className="text-xs mb-1">Timeframe</div>
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe} disabled={isRunning}>
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
                
                <div className="pt-4">
                  {isRunning ? (
                    <Button variant="destructive" className="w-full" onClick={stopBot}>
                      <StopCircle className="h-4 w-4 mr-2" />
                      Stop AI Bot
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={startBot} disabled={!activeBot}>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start AI Bot
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm font-medium">Market Data</div>
              <div className="rounded-md border overflow-hidden">
                <div className="bg-muted/50 p-2 text-xs font-medium grid grid-cols-3">
                  <div>Symbol</div>
                  <div className="text-right">Price</div>
                  <div className="text-right">Change</div>
                </div>
                <div className="max-h-[180px] overflow-y-auto">
                  {marketData.map(coin => {
                    const isUp = (coin.priceChange || 0) >= 0;
                    return (
                      <div key={coin.id} className="p-2 border-t grid grid-cols-3 text-xs">
                        <div>{coin.symbol}</div>
                        <div className="text-right">${coin.price?.toFixed(2) || "0.00"}</div>
                        <div className={`text-right ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                          {isUp ? '+' : ''}{coin.changePercent?.toFixed(2) || "0.00"}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="dashboard">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="settings">Bot Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="text-sm font-medium">Trading Stats</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 border rounded-md">
                      <div className="text-xs text-muted-foreground">Total Trades</div>
                      <div className="text-xl font-bold">{botStats.totalTrades}</div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                      <div className="text-xl font-bold">{(botStats.winRate * 100).toFixed(1)}%</div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-xs text-muted-foreground">Profit/Loss</div>
                      <div className={`text-xl font-bold ${botStats.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {botStats.profitLoss >= 0 ? '+' : ''}{botStats.profitLoss.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-xs text-muted-foreground">Last Trade</div>
                      <div className="text-xl font-bold">
                        {botStats.lastTradeTime ? botStats.lastTradeTime.toLocaleTimeString() : "N/A"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Recent Activity</div>
                    <ScrollArea className="h-[200px] border rounded-md p-2">
                      {activityLog.slice(0, 10).map(entry => (
                        <div key={entry.id} className="py-2 border-b last:border-0">
                          <div className="flex items-center gap-2">
                            <div className={`${getLogColor(entry.type, entry.success)}`}>
                              {getLogIcon(entry.type)}
                            </div>
                            <div className="text-xs font-medium">{entry.message}</div>
                            <div className="ml-auto text-xs text-muted-foreground">
                              {entry.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                          {entry.details && (
                            <div className="text-xs text-muted-foreground ml-6 mt-1">{entry.details}</div>
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-medium">Performance Chart</div>
                  <div className="border rounded-md p-3 h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData.slice(-20)}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="time" 
                          tick={{fontSize: 10}}
                          tickFormatter={(value) => value.toString().split(' ')[0]}
                        />
                        <YAxis tick={{fontSize: 10}} />
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <Tooltip formatter={(value: number) => [value.toFixed(2), ""]} />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          name="AI Bot" 
                          stroke="#10b981" 
                          fillOpacity={1}
                          fill="url(#colorValue)"
                          strokeWidth={2}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="benchmark" 
                          name="Market" 
                          stroke="#6366f1" 
                          fillOpacity={1}
                          fill="url(#colorBenchmark)"
                          strokeWidth={1}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Bot Information</div>
                    {activeBot && (
                      <ScrollArea className="border rounded-md p-3 h-[120px]">
                        <AiTradingBotDetail
                          botId={activeBot}
                          strategyId={activeBot}
                          strategyName={AVAILABLE_STRATEGIES.find(s => s.id === activeBot)?.name || ""}
                        />
                      </ScrollArea>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Activity Log</div>
                  <Select value={logFilter} onValueChange={setLogFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter logs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Activities</SelectItem>
                      <SelectItem value="signal">Signals</SelectItem>
                      <SelectItem value="trade">Trades</SelectItem>
                      <SelectItem value="alert">Alerts</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-muted/50 p-2 grid grid-cols-12 text-xs font-medium">
                    <div className="col-span-2">Time</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-5">Message</div>
                    <div className="col-span-2">Asset</div>
                    <div className="col-span-1">Status</div>
                  </div>
                  
                  <ScrollArea className="h-[400px]">
                    {filteredLog.map(entry => (
                      <div key={entry.id} className="border-t p-2 grid grid-cols-12 text-xs hover:bg-muted/20">
                        <div className="col-span-2 text-muted-foreground">
                          {entry.timestamp.toLocaleTimeString()}
                        </div>
                        <div className={`col-span-2 flex items-center gap-1 ${getLogColor(entry.type, entry.success)}`}>
                          {getLogIcon(entry.type)}
                          <span className="capitalize">{entry.type}</span>
                        </div>
                        <div className="col-span-5">
                          <div>{entry.message}</div>
                          {entry.details && (
                            <div className="text-muted-foreground text-xs mt-1">{entry.details}</div>
                          )}
                        </div>
                        <div className="col-span-2">{entry.coin || "-"}</div>
                        <div className="col-span-1">
                          {entry.success !== undefined ? (
                            entry.success ? 
                              <Check className="h-4 w-4 text-green-500" /> : 
                              <X className="h-4 w-4 text-red-500" />
                          ) : "-"}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div>Showing {filteredLog.length} entries</div>
                  <Button variant="outline" size="sm" onClick={() => setActivityLog([])}>
                    Clear Log
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="performance">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="text-sm font-medium">Performance Metrics</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 border rounded-md">
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                      <div className="text-xl font-bold">{(botStats.winRate * 100).toFixed(1)}%</div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-xs text-muted-foreground">Total P/L</div>
                      <div className={`text-xl font-bold ${botStats.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {botStats.profitLoss >= 0 ? '+' : ''}{botStats.profitLoss.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-xs text-muted-foreground">Avg Profit/Trade</div>
                      <div className={`text-xl font-bold ${botStats.avgProfitPerTrade >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {botStats.avgProfitPerTrade >= 0 ? '+' : ''}{botStats.avgProfitPerTrade.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-xs text-muted-foreground">Max Drawdown</div>
                      <div className="text-xl font-bold text-amber-500">
                        {botStats.drawdown}%
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Trade Distribution</div>
                    <div className="border rounded-md p-3 h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: 'Wins', value: Math.round(botStats.totalTrades * botStats.winRate) },
                            { name: 'Losses', value: botStats.totalTrades - Math.round(botStats.totalTrades * botStats.winRate) }
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" name="Count">
                            {[
                              <Cell key="cell-0" fill="#10b981" />,
                              <Cell key="cell-1" fill="#ef4444" />
                            ]}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-sm font-medium">Performance Over Time</div>
                  <div className="border rounded-md p-3 h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={performanceData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis 
                          dataKey="time" 
                          tick={{fontSize: 10}}
                          tickFormatter={(value) => value.toString().split(' ')[0]}
                        />
                        <YAxis tick={{fontSize: 10}} />
                        <Tooltip formatter={(value: number) => [value.toFixed(2), ""]} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name="AI Bot Performance"
                          stroke="#10b981"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="benchmark"
                          name="Market Benchmark"
                          stroke="#6366f1"
                          strokeWidth={1.5}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Daily Returns</div>
                    <div className="border rounded-md p-3 h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={performanceData.slice(-10).map((item, index, arr) => {
                            if (index === 0) return { ...item, dailyReturn: 0 };
                            return { 
                              ...item, 
                              dailyReturn: ((item.value - arr[index-1].value) / arr[index-1].value) * 100
                            };
                          })}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis 
                            dataKey="time" 
                            tick={{fontSize: 10}}
                            tickFormatter={(value) => value.toString().split(' ')[0]}
                          />
                          <YAxis tick={{fontSize: 10}} />
                          <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, "Daily Return"]} />
                          <Bar dataKey="dailyReturn" name="Daily Return">
                            {performanceData.slice(-10).map((entry, index, arr) => {
                              if (index === 0) return <Cell key={`cell-${index}`} fill="#6b7280" />;
                              const dailyReturn = ((entry.value - arr[index-1].value) / arr[index-1].value) * 100;
                              return (
                                <Cell 
                                  key={`cell-${index}`}
                                  fill={dailyReturn >= 0 ? "#10b981" : "#ef4444"} 
                                />
                              );
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Risk Management</h3>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label htmlFor="riskLevel" className="text-xs">Risk Level: {botSettings.riskLevel}/10</label>
                        <span className="text-xs text-muted-foreground">{
                          botSettings.riskLevel <= 3 ? "Conservative" : 
                          botSettings.riskLevel <= 7 ? "Moderate" : "Aggressive"
                        }</span>
                      </div>
                      <Slider 
                        id="riskLevel" 
                        min={1} 
                        max={10} 
                        step={1} 
                        value={[botSettings.riskLevel]} 
                        onValueChange={(value) => updateSetting('riskLevel', value[0])}
                        disabled={isRunning}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label htmlFor="maxPositionSize" className="text-xs">Max Position Size (%)</label>
                        <span className="text-xs">{botSettings.maxPositionSize}%</span>
                      </div>
                      <Slider 
                        id="maxPositionSize" 
                        min={1} 
                        max={50} 
                        step={1} 
                        value={[botSettings.maxPositionSize]} 
                        onValueChange={(value) => updateSetting('maxPositionSize', value[0])}
                        disabled={isRunning}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label htmlFor="stopLossPercent" className="text-xs">Stop Loss (%)</label>
                        <span className="text-xs">{botSettings.stopLossPercent}%</span>
                      </div>
                      <Slider 
                        id="stopLossPercent" 
                        min={0.5} 
                        max={15} 
                        step={0.5} 
                        value={[botSettings.stopLossPercent]} 
                        onValueChange={(value) => updateSetting('stopLossPercent', value[0])}
                        disabled={isRunning}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label htmlFor="takeProfitPercent" className="text-xs">Take Profit (%)</label>
                        <span className="text-xs">{botSettings.takeProfitPercent}%</span>
                      </div>
                      <Slider 
                        id="takeProfitPercent" 
                        min={0.5} 
                        max={30} 
                        step={0.5} 
                        value={[botSettings.takeProfitPercent]} 
                        onValueChange={(value) => updateSetting('takeProfitPercent', value[0])}
                        disabled={isRunning}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label htmlFor="maxDrawdownPercent" className="text-xs">Max Drawdown (%)</label>
                        <span className="text-xs">{botSettings.maxDrawdownPercent}%</span>
                      </div>
                      <Slider 
                        id="maxDrawdownPercent" 
                        min={5} 
                        max={50} 
                        step={1} 
                        value={[botSettings.maxDrawdownPercent]} 
                        onValueChange={(value) => updateSetting('maxDrawdownPercent', value[0])}
                        disabled={isRunning}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="trailingStopEnabled"
                        checked={botSettings.trailingStopEnabled}
                        onCheckedChange={(checked) => updateSetting('trailingStopEnabled', checked)}
                        disabled={isRunning}
                      />
                      <div>
                        <label htmlFor="trailingStopEnabled" className="text-xs">
                          Enable Trailing Stop Loss
                        </label>
                        {botSettings.trailingStopEnabled && (
                          <div className="mt-2">
                            <div className="flex justify-between items-center">
                              <label htmlFor="trailingStopDistance" className="text-xs">
                                Trailing Distance (%)
                              </label>
                              <span className="text-xs">{botSettings.trailingStopDistance}%</span>
                            </div>
                            <Slider 
                              id="trailingStopDistance" 
                              min={0.5} 
                              max={10} 
                              step={0.5} 
                              value={[botSettings.trailingStopDistance]} 
                              onValueChange={(value) => updateSetting('trailingStopDistance', value[0])}
                              disabled={isRunning}
                              className="mt-1"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Trading Schedule & Rebalancing</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="tradingHoursOnly"
                        checked={botSettings.tradingHoursOnly}
                        onCheckedChange={(checked) => updateSetting('tradingHoursOnly', checked)}
                        disabled={isRunning}
                      />
                      <label htmlFor="tradingHoursOnly" className="text-xs">
                        Trade only during market hours (9:30 AM - 4:00 PM ET)
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="autoRebalance"
                        checked={botSettings.autoRebalance}
                        onCheckedChange={(checked) => updateSetting('autoRebalance', checked)}
                        disabled={isRunning}
                      />
                      <div>
                        <label htmlFor="autoRebalance" className="text-xs">
                          Enable Auto-Rebalancing
                        </label>
                        {botSettings.autoRebalance && (
                          <div className="mt-2">
                            <label className="text-xs block mb-1">Rebalance Frequency</label>
                            <Select 
                              value={botSettings.rebalanceFrequency} 
                              onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                                updateSetting('rebalanceFrequency', value)
                              }
                              disabled={isRunning}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Advanced Options</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="useMarketSentiment"
                        checked={botSettings.useMarketSentiment}
                        onCheckedChange={(checked) => updateSetting('useMarketSentiment', checked)}
                        disabled={isRunning}
                      />
                      <div>
                        <label htmlFor="useMarketSentiment" className="text-xs">
                          Use Market Sentiment Analysis
                        </label>
                        {botSettings.useMarketSentiment && (
                          <div className="mt-2">
                            <div className="flex justify-between items-center">
                              <label htmlFor="sentimentWeight" className="text-xs">
                                Sentiment Weight (%)
                              </label>
                              <span className="text-xs">{botSettings.sentimentWeight}%</span>
                            </div>
                            <Slider 
                              id="sentimentWeight" 
                              min={10} 
                              max={90} 
                              step={5} 
                              value={[botSettings.sentimentWeight]} 
                              onValueChange={(value) => updateSetting('sentimentWeight', value[0])}
                              disabled={isRunning}
                              className="mt-1"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3 mt-4">
                      <h4 className="text-xs font-medium mb-2">Export/Import Settings</h4>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            const settingsStr = JSON.stringify(botSettings, null, 2);
                            navigator.clipboard.writeText(settingsStr);
                            toast({
                              title: "Settings Copied",
                              description: "Bot settings have been copied to clipboard"
                            });
                          }}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            toast({
                              title: "Import Settings",
                              description: "To import settings, paste JSON in settings field"
                            });
                          }}
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          Import
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t pt-4">
          {lastSignal ? (
            <div className="w-full">
              <div className="text-xs text-muted-foreground mb-1">Last Trading Signal:</div>
              <div className="font-medium">{lastSignal}</div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No trading signals generated yet. Start the AI bot to begin analysis.
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AiTradingDetailedDashboard;
