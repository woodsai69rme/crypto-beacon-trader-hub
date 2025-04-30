
import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { CheckCircle, Bot, Brain, TrendingUp, ArrowUpDown, PlayCircle, StopCircle, Cpu, LineChart, 
         Maximize2, Minimize2, X, RefreshCw, Settings, AlertCircle, XCircle, Info, Zap } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { startPriceMonitoring } from "@/services/priceMonitoring";
import { CoinOption } from '@/components/trading/types';
import { useTheme } from '@/contexts/ThemeContext';

interface AdvancedAiTradingDashboardProps {
  onClose?: () => void;
  initialPosition?: { x: number, y: number };
  isDetached?: boolean;
}

interface BotMetrics {
  accuracy: number;
  profitability: number;
  totalTrades: number;
  winRate: number;
  averageReturn: number;
  drawdown: number;
  sharpeRatio: number;
}

interface TradingSignal {
  id: string;
  timestamp: Date;
  symbol: string;
  action: 'buy' | 'sell' | 'hold';
  price: number;
  confidence: number;
  reason: string;
  executed: boolean;
}

interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'trade';
  symbol?: string;
}

interface StrategyParameter {
  id: string;
  name: string;
  value: number | boolean;
  type: 'slider' | 'toggle' | 'number';
  min?: number;
  max?: number;
  step?: number;
}

const AI_BOTS = [
  {
    id: "trend-bot",
    name: "Trend Analyzer Pro",
    description: "Analyzes market trends and momentum indicators with enhanced precision",
    icon: <TrendingUp className="h-5 w-5" />,
    strategy: "trend-following",
  },
  {
    id: "pattern-bot",
    name: "Pattern Recognition ML",
    description: "Identifies technical patterns and chart formations using machine learning",
    icon: <LineChart className="h-5 w-5" />,
    strategy: "pattern-recognition",
  },
  {
    id: "sentiment-bot",
    name: "Sentiment Analyzer NLP",
    description: "Analyzes market sentiment from news and social media using NLP",
    icon: <Brain className="h-5 w-5" />,
    strategy: "sentiment-analysis",
  },
  {
    id: "quantum-bot", 
    name: "Quantum AI Trader",
    description: "Advanced ML strategies with multi-timeframe analysis and reinforcement learning",
    icon: <Cpu className="h-5 w-5" />,
    strategy: "quantum-ml",
  }
];

const TRADING_PAIRS = ["BTC/USD", "ETH/USD", "SOL/USD", "ADA/USD", "XRP/USD", "DOT/USD", "DOGE/USD", "AVAX/USD"];
const TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w"];

const DEFAULT_STRATEGY_PARAMETERS: StrategyParameter[] = [
  {
    id: "riskLevel",
    name: "Risk Level",
    value: 50,
    type: "slider",
    min: 0,
    max: 100,
    step: 1
  },
  {
    id: "takeProfit",
    name: "Take Profit (%)",
    value: 2.5,
    type: "number",
    min: 0.1,
    max: 50,
    step: 0.1
  },
  {
    id: "stopLoss",
    name: "Stop Loss (%)",
    value: 1.5,
    type: "number",
    min: 0.1,
    max: 20,
    step: 0.1
  },
  {
    id: "useVolume",
    name: "Consider Volume",
    value: true,
    type: "toggle"
  },
  {
    id: "useMarketSentiment",
    name: "Use Market Sentiment",
    value: true,
    type: "toggle"
  }
];

const AdvancedAiTradingDashboard: React.FC<AdvancedAiTradingDashboardProps> = ({ 
  onClose,
  initialPosition = { x: 20, y: 100 },
  isDetached = false
}) => {
  const { theme, colorScheme } = useTheme();
  const [activeBot, setActiveBot] = useState<string>("trend-bot");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1h");
  const [marketData, setMarketData] = useState<CoinOption[]>([]);
  const [selectedPair, setSelectedPair] = useState<string>("BTC/USD");
  const [lastSignal, setLastSignal] = useState<TradingSignal | null>(null);
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState({ width: isDetached ? 900 : "100%", height: isDetached ? 700 : "auto" });
  const [isMaximized, setIsMaximized] = useState(false);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [tradingSignals, setTradingSignals] = useState<TradingSignal[]>([]);
  const [botParameters, setBotParameters] = useState<StrategyParameter[]>(DEFAULT_STRATEGY_PARAMETERS);
  const [metrics, setMetrics] = useState<BotMetrics | null>(null);
  const [showParameters, setShowParameters] = useState<boolean>(true);
  const [executedTrades, setExecutedTrades] = useState<number>(0);
  const [autoTrade, setAutoTrade] = useState<boolean>(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(5);
  const [activePanel, setActivePanel] = useState<string>("dashboard");
  const [marketSummary, setMarketSummary] = useState<{
    trend: 'bullish' | 'bearish' | 'neutral';
    volatility: 'high' | 'medium' | 'low';
    volume: number;
    sentiment: number;
  }>({
    trend: 'neutral',
    volatility: 'medium',
    volume: 0,
    sentiment: 0
  });
  
  const dashboardRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number, y: number } | null>(null);
  const activityEndRef = useRef<HTMLDivElement>(null);
  
  // Function to scroll to the bottom of the activity log
  const scrollToBottom = () => {
    if (activityEndRef.current) {
      activityEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Add auto-scroll to bottom when new log entries are added
  useEffect(() => {
    if (activityLog.length > 0) {
      scrollToBottom();
    }
  }, [activityLog.length]);

  useEffect(() => {
    // Start price monitoring to get real-time market data
    const coinIds = ["bitcoin", "ethereum", "solana", "cardano", "ripple", "dogecoin", "polkadot", "avalanche"];
    
    const stopMonitoring = startPriceMonitoring(
      coinIds,
      (updatedCoins) => {
        const enhancedCoins = updatedCoins.map(coin => ({
          ...coin,
          label: `${coin.name} (${coin.symbol})`
        }));
        setMarketData(enhancedCoins);
        
        // Simulate AI bot generating trading signals
        if (isRunning && activeBot && Math.random() > 0.85) {
          generateTradingSignal();
        }
      },
      3000 // Update every 3 seconds
    );
    
    // Initial activity log entry
    addActivityLog({
      message: "AI Trading Dashboard initialized and ready",
      type: "info"
    });
    
    // Set up drag handlers if in detached mode
    if (isDetached) {
      const handleMouseMove = (e: MouseEvent) => {
        if (dragStartRef.current && !isMaximized) {
          const deltaX = e.clientX - dragStartRef.current.x;
          const deltaY = e.clientY - dragStartRef.current.y;
          
          setPosition(prev => ({
            x: prev.x + deltaX,
            y: prev.y + deltaY
          }));
          
          dragStartRef.current = { x: e.clientX, y: e.clientY };
        }
      };
      
      const handleMouseUp = () => {
        dragStartRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        stopMonitoring();
        document.removeEventListener('mouseup', handleMouseUp);
      };
    } else {
      return () => {
        stopMonitoring();
      };
    }
  }, [isRunning, activeBot, selectedPair, isDetached, isMaximized]);
  
  // Generate market metrics periodically
  useEffect(() => {
    if (!isRunning) return;
    
    const updateMarketMetricsInterval = setInterval(() => {
      // Simulate market analysis updates
      const trends = ['bullish', 'bearish', 'neutral'] as const;
      const volatilities = ['high', 'medium', 'low'] as const;
      
      setMarketSummary({
        trend: trends[Math.floor(Math.random() * trends.length)],
        volatility: volatilities[Math.floor(Math.random() * volatilities.length)],
        volume: Math.floor(1000000 + Math.random() * 9000000),
        sentiment: Math.random() * 100
      });
      
      addActivityLog({
        message: `Market analysis updated for ${selectedPair}`,
        type: "info",
        symbol: selectedPair.split('/')[0]
      });
    }, refreshInterval * 1000);
    
    return () => clearInterval(updateMarketMetricsInterval);
  }, [isRunning, refreshInterval, selectedPair]);
  
  // Update bot metrics periodically
  useEffect(() => {
    if (!isRunning) return;
    
    let tradeCount = 0;
    const wins = Math.floor(Math.random() * 20) + 30; // 30-50 wins
    
    const updateBotsMetricsInterval = setInterval(() => {
      tradeCount += 1;
      const totalTrades = tradeCount + wins;
      const winRate = wins / totalTrades;
      
      // Update bot metrics
      setMetrics({
        accuracy: 0.5 + Math.random() * 0.4,
        profitability: (Math.random() * 15) - 5, // -5% to +10%
        totalTrades: totalTrades,
        winRate: winRate,
        averageReturn: (Math.random() * 2) - 0.5, // -0.5% to +1.5%
        drawdown: Math.random() * 10,
        sharpeRatio: 0.5 + Math.random() * 1.5
      });
      
      addActivityLog({
        message: `Bot metrics updated - Win rate: ${(winRate * 100).toFixed(1)}%`,
        type: "info"
      });
    }, (refreshInterval * 2000));
    
    return () => clearInterval(updateBotsMetricsInterval);
  }, [isRunning, refreshInterval]);
  
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (!isDetached) return;
    
    e.preventDefault();
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (dragStartRef.current && !isMaximized && isDetached) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };
  
  const handleMouseUp = () => {
    dragStartRef.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
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
    
    const selectedBot = AI_BOTS.find(bot => bot.id === activeBot);
    
    toast({
      title: "AI Bot Started",
      description: `${selectedBot?.name} is now analyzing market data`
    });
    
    addActivityLog({
      message: `${selectedBot?.name} started on ${selectedPair} (${selectedTimeframe})`,
      type: "success",
      symbol: selectedPair.split('/')[0]
    });
    
    // Generate initial metrics
    setMetrics({
      accuracy: 0.65 + Math.random() * 0.2,
      profitability: Math.random() * 8,
      totalTrades: Math.floor(Math.random() * 50) + 20,
      winRate: 0.5 + Math.random() * 0.3,
      averageReturn: Math.random() * 1.2,
      drawdown: Math.random() * 8,
      sharpeRatio: 1 + Math.random()
    });
    
    // Set market summary
    setMarketSummary({
      trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
      volatility: 'medium',
      volume: Math.floor(1000000 + Math.random() * 9000000),
      sentiment: 50 + Math.random() * 30
    });
  };
  
  const stopBot = () => {
    setIsRunning(false);
    
    const selectedBot = AI_BOTS.find(bot => bot.id === activeBot);
    
    toast({
      title: "AI Bot Stopped",
      description: `${selectedBot?.name} has been stopped`
    });
    
    addActivityLog({
      message: `${selectedBot?.name} stopped by user`,
      type: "warning"
    });
  };
  
  const generateTradingSignal = () => {
    if (!isRunning) return;
    
    const signalTypes: Array<'buy' | 'sell' | 'hold'> = ["buy", "sell", "hold"];
    const confidenceLevels = [0.65, 0.75, 0.85, 0.95];
    const randomSignal = signalTypes[Math.floor(Math.random() * signalTypes.length)];
    const randomConfidence = confidenceLevels[Math.floor(Math.random() * confidenceLevels.length)];
    
    const pairSymbol = selectedPair.split('/')[0];
    const selectedCoin = marketData.find(coin => coin.symbol === pairSymbol);
    const currentPrice = selectedCoin ? selectedCoin.price : 1000 + Math.random() * 50000;
    
    const reasons = [
      "RSI indicates oversold condition",
      "MACD bullish crossover detected",
      "Price broke resistance level",
      "Volume spike with price increase",
      "Bollinger band squeeze",
      "Moving average convergence",
      "Support level holding strong",
      "Bearish divergence pattern",
      "Double top pattern identified",
      "Market sentiment analysis"
    ];
    
    const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
    
    const newSignal: TradingSignal = {
      id: `signal-${Date.now()}`,
      timestamp: new Date(),
      symbol: pairSymbol,
      action: randomSignal,
      price: currentPrice,
      confidence: randomConfidence,
      reason: randomReason,
      executed: false
    };
    
    setLastSignal(newSignal);
    setTradingSignals(prev => [newSignal, ...prev].slice(0, 20));
    
    addActivityLog({
      message: `Generated ${randomSignal.toUpperCase()} signal for ${pairSymbol} at $${currentPrice.toFixed(2)} - ${randomReason}`,
      type: randomSignal === 'buy' ? 'success' : randomSignal === 'sell' ? 'error' : 'info',
      symbol: pairSymbol
    });
    
    // Execute trade if auto-trade is enabled and it's not a hold signal
    if (autoTrade && randomSignal !== 'hold') {
      executeTrade(newSignal);
    }
    
    if (randomSignal !== "hold") {
      toast({
        title: `${randomSignal.toUpperCase()} Signal Generated`,
        description: `${pairSymbol} - ${(randomConfidence * 100).toFixed(0)}% confidence`,
        variant: randomSignal === 'buy' ? 'default' : 'destructive'
      });
    }
  };
  
  const executeTrade = (signal: TradingSignal) => {
    if (!signal || signal.executed) return;
    
    // Mark as executing
    const updatedSignal = { ...signal, executed: true };
    
    // Update the signals list
    setTradingSignals(prev => prev.map(s => 
      s.id === signal.id ? updatedSignal : s
    ));
    
    // Add to executed trades count
    setExecutedTrades(prev => prev + 1);
    
    addActivityLog({
      message: `EXECUTED ${signal.action.toUpperCase()} order for ${signal.symbol} at $${signal.price.toFixed(2)}`,
      type: 'trade',
      symbol: signal.symbol
    });
    
    toast({
      title: 'Trade Executed',
      description: `${signal.action.toUpperCase()} ${signal.symbol} at $${signal.price.toFixed(2)}`,
      variant: signal.action === 'buy' ? 'default' : 'destructive'
    });
  };
  
  const toggleMaximize = () => {
    setIsMaximized(prev => !prev);
    
    if (!isMaximized) {
      addActivityLog({
        message: "Dashboard maximized",
        type: "info"
      });
    } else {
      addActivityLog({
        message: "Dashboard restored to normal size",
        type: "info"
      });
    }
  };
  
  const addActivityLog = ({ message, type, symbol }: { message: string, type: ActivityLogEntry['type'], symbol?: string }) => {
    const newEntry: ActivityLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      message,
      type,
      symbol
    };
    
    setActivityLog(prev => [newEntry, ...prev.slice(0, 999)]);
  };
  
  const handleParameterChange = (parameterId: string, newValue: number | boolean) => {
    setBotParameters(prev => prev.map(param => 
      param.id === parameterId ? { ...param, value: newValue } : param
    ));
    
    addActivityLog({
      message: `Strategy parameter updated: ${parameterId} set to ${newValue}`,
      type: "info"
    });
  };
  
  const clearActivityLog = () => {
    setActivityLog([]);
    addActivityLog({
      message: "Activity log cleared",
      type: "info"
    });
    toast({
      title: "Log Cleared",
      description: "Activity log has been cleared"
    });
  };
  
  const resetParameters = () => {
    setBotParameters(DEFAULT_STRATEGY_PARAMETERS);
    addActivityLog({
      message: "Strategy parameters reset to defaults",
      type: "info"
    });
    toast({
      title: "Parameters Reset",
      description: "Strategy parameters have been reset to default values"
    });
  };
  
  const toggleAutoTrade = () => {
    setAutoTrade(prev => !prev);
    addActivityLog({
      message: `Auto-trading ${!autoTrade ? 'enabled' : 'disabled'}`,
      type: !autoTrade ? 'success' : 'warning'
    });
    toast({
      title: !autoTrade ? "Auto-Trading Enabled" : "Auto-Trading Disabled",
      description: !autoTrade ? "Bot will automatically execute trades based on signals" : "Automatic trade execution disabled"
    });
  };

  const toggleParameters = () => {
    setShowParameters(prev => !prev);
  };
  
  const handleRefreshIntervalChange = (value: string) => {
    const interval = parseInt(value, 10);
    setRefreshInterval(interval);
    addActivityLog({
      message: `Refresh interval updated to ${interval} seconds`,
      type: "info"
    });
  };
  
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLogEntryClass = (type: ActivityLogEntry['type']): string => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-amber-500';
      case 'trade':
        return 'text-blue-500 font-medium';
      default:
        return 'text-muted-foreground';
    }
  };
  
  const getMarketTrendClass = (trend: string): string => {
    switch (trend) {
      case 'bullish':
        return 'text-green-500';
      case 'bearish':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  const getSentimentLabel = (sentiment: number): string => {
    if (sentiment < 30) return 'Bearish';
    if (sentiment < 50) return 'Slightly Bearish';
    if (sentiment < 70) return 'Neutral';
    if (sentiment < 85) return 'Slightly Bullish';
    return 'Bullish';
  };
  
  const getSentimentClass = (sentiment: number): string => {
    if (sentiment < 30) return 'text-red-500';
    if (sentiment < 50) return 'text-amber-500';
    if (sentiment < 70) return 'text-blue-500';
    if (sentiment < 85) return 'text-emerald-500';
    return 'text-green-500';
  };

  // Dashboard style based on detached mode and maximized state
  const dashboardStyle: React.CSSProperties = isDetached 
    ? (isMaximized
      ? {
          position: 'fixed',
          top: '10px',
          left: '10px',
          right: '10px',
          bottom: '10px',
          width: 'auto',
          height: 'auto',
          zIndex: 1000,
        }
      : {
          position: 'fixed',
          top: `${position.y}px`,
          left: `${position.x}px`,
          width: typeof size.width === 'number' ? `${size.width}px` : size.width,
          height: typeof size.height === 'number' ? `${size.height}px` : size.height,
          zIndex: 1000,
        })
    : {};

  // Get the correct bot object based on active bot ID
  const selectedBotObj = AI_BOTS.find(bot => bot.id === activeBot);

  return (
    <div 
      ref={dashboardRef}
      className="shadow-xl rounded-lg overflow-hidden"
      style={dashboardStyle}
    >
      <Card className="w-full h-full flex flex-col border-2">
        <CardHeader 
          className={`bg-card/50 border-b border-border py-2 cursor-move flex flex-row items-center justify-between ${isDetached ? 'cursor-move' : ''}`}
          onMouseDown={isDetached ? handleHeaderMouseDown : undefined}
        >
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Advanced AI Trading Dashboard
                {isRunning && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 animate-pulse ml-2">
                    Live
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-xs">
                {activeBot && selectedBotObj ? `Active Bot: ${selectedBotObj.name}` : 'Select a bot to start'}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {isDetached && (
              <>
                <Button variant="ghost" size="icon" onClick={toggleMaximize} className="h-8 w-8">
                  {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow p-4 overflow-auto">
          <Tabs defaultValue="dashboard" value={activePanel} onValueChange={setActivePanel}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="signals">Signals & Trades</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bot Selection Panel */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Select AI Bot</div>
                    {isRunning && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Running
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {AI_BOTS.map(bot => (
                      <Button
                        key={bot.id}
                        variant={activeBot === bot.id ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => {
                          setActiveBot(bot.id);
                          addActivityLog({
                            message: `Switched to ${bot.name} bot`,
                            type: "info"
                          });
                        }}
                        disabled={isRunning}
                      >
                        <div className="mr-2">{bot.icon}</div>
                        <div className="text-left">
                          <div className="font-medium">{bot.name}</div>
                          <div className="text-xs text-muted-foreground">{bot.description}</div>
                        </div>
                      </Button>
                    ))}
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

                {/* Trading Parameters */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Trading Parameters</div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-2 text-xs"
                      onClick={toggleParameters}
                    >
                      {showParameters ? 'Hide Params' : 'Show Params'}
                    </Button>
                  </div>
                  
                  {showParameters ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs mb-1">Trading Pair</div>
                          <Select value={selectedPair} onValueChange={setSelectedPair} disabled={isRunning}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TRADING_PAIRS.map(pair => (
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
                              {TIMEFRAMES.map(timeframe => (
                                <SelectItem key={timeframe} value={timeframe}>{timeframe}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4 pt-2">
                        {botParameters.map(param => (
                          <div key={param.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="text-xs">{param.name}</div>
                              {param.type === 'toggle' ? (
                                <Switch
                                  checked={param.value as boolean}
                                  onCheckedChange={(checked) => handleParameterChange(param.id, checked)}
                                  disabled={isRunning}
                                />
                              ) : param.type === 'slider' ? (
                                <div className="text-xs font-medium">{param.value}</div>
                              ) : (
                                <Input
                                  type="number"
                                  value={param.value as number}
                                  onChange={(e) => handleParameterChange(param.id, parseFloat(e.target.value))}
                                  className="w-16 h-7 text-xs"
                                  min={param.min}
                                  max={param.max}
                                  step={param.step}
                                  disabled={isRunning}
                                />
                              )}
                            </div>
                            
                            {param.type === 'slider' && (
                              <Slider
                                value={[param.value as number]}
                                max={param.max}
                                min={param.min}
                                step={param.step}
                                onValueChange={([value]) => handleParameterChange(param.id, value)}
                                disabled={isRunning}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Auto-Trade Toggle */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <div className="font-medium">Auto-Trade</div>
                          <div className="text-xs text-muted-foreground">Execute trades automatically</div>
                        </div>
                        <Switch
                          checked={autoTrade}
                          onCheckedChange={toggleAutoTrade}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      Parameter configuration hidden.
                      <br />
                      Click "Show Params" to view and edit.
                    </div>
                  )}
                </div>
                
                {/* Market Data & Metrics */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Market & Bot Metrics</div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => {
                        addActivityLog({
                          message: "Manual metrics refresh triggered",
                          type: "info"
                        });
                        
                        // Simulate metrics refresh
                        if (metrics) {
                          setMetrics({
                            ...metrics,
                            accuracy: Math.min(0.95, metrics.accuracy + (Math.random() * 0.05)),
                          });
                        }
                      }}
                      disabled={!isRunning}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  
                  {isRunning && metrics ? (
                    <div className="space-y-3 divide-y">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
                        <div>
                          <div className="text-xs text-muted-foreground">Accuracy</div>
                          <div className="font-medium">{(metrics.accuracy * 100).toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Win Rate</div>
                          <div className="font-medium">{(metrics.winRate * 100).toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Profit/Loss</div>
                          <div className={`font-medium ${metrics.profitability >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {metrics.profitability >= 0 ? '+' : ''}{metrics.profitability.toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Total Trades</div>
                          <div className="font-medium">{metrics.totalTrades}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-3">
                        <div>
                          <div className="text-xs text-muted-foreground">Market Trend</div>
                          <div className={`font-medium ${getMarketTrendClass(marketSummary.trend)}`}>
                            {marketSummary.trend.charAt(0).toUpperCase() + marketSummary.trend.slice(1)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Volatility</div>
                          <div className="font-medium">
                            {marketSummary.volatility.charAt(0).toUpperCase() + marketSummary.volatility.slice(1)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">24h Volume</div>
                          <div className="font-medium">${(marketSummary.volume / 1000000).toFixed(2)}M</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Sentiment</div>
                          <div className={`font-medium ${getSentimentClass(marketSummary.sentiment)}`}>
                            {getSentimentLabel(marketSummary.sentiment)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Advanced Metrics */}
                      <div className="pt-3">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs text-muted-foreground">Bot Performance</div>
                          <div className="text-xs text-muted-foreground">
                            {selectedBotObj?.name || "AI Bot"}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="border rounded-md p-2 text-center">
                            <div className="text-xs text-muted-foreground">Sharpe</div>
                            <div className="font-medium text-sm">{metrics.sharpeRatio.toFixed(2)}</div>
                          </div>
                          <div className="border rounded-md p-2 text-center">
                            <div className="text-xs text-muted-foreground">Avg Ret</div>
                            <div className={`font-medium text-sm ${metrics.averageReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {metrics.averageReturn >= 0 ? '+' : ''}{metrics.averageReturn.toFixed(2)}%
                            </div>
                          </div>
                          <div className="border rounded-md p-2 text-center">
                            <div className="text-xs text-muted-foreground">Drawdown</div>
                            <div className="font-medium text-sm text-amber-500">
                              {metrics.drawdown.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-md p-6 flex flex-col items-center justify-center space-y-2 text-center text-muted-foreground h-[calc(100%-2rem)]">
                      <LineChart className="h-6 w-6 mb-2 opacity-50" />
                      <div>No active trading session</div>
                      <div className="text-xs">Start the AI bot to view metrics</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Signal Visualization & Market Status */}
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Latest Trading Signals</h3>
                  <Badge variant={isRunning ? "outline" : "secondary"} className={isRunning ? "bg-green-500/10 text-green-500" : ""}>
                    {isRunning ? "Analyzing Market" : "Idle"}
                  </Badge>
                </div>
                
                {lastSignal ? (
                  <div className="space-y-4">
                    <div className={`rounded-md border p-3 ${
                      lastSignal.action === 'buy' ? 'bg-green-500/10 border-green-500/30' : 
                      lastSignal.action === 'sell' ? 'bg-red-500/10 border-red-500/30' : 
                      'bg-blue-500/10 border-blue-500/30'
                    }`}>
                      <div className="flex justify-between">
                        <div className="font-medium">
                          {lastSignal.action.toUpperCase()} {lastSignal.symbol}
                        </div>
                        <div className="text-sm">
                          {(lastSignal.confidence * 100).toFixed(0)}% Confidence
                        </div>
                      </div>
                      <div className="text-sm mt-1">
                        {lastSignal.reason}
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <div>Price: ${lastSignal.price.toFixed(2)}</div>
                        <div>{formatTimestamp(lastSignal.timestamp)}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-md p-3 bg-muted/20">
                        <h4 className="text-sm font-medium mb-2">Signal Distribution (Last 24h)</h4>
                        <div className="flex gap-1">
                          <div className="bg-green-500 h-4 rounded-l-sm" style={{ width: '40%' }}></div>
                          <div className="bg-blue-500 h-4" style={{ width: '30%' }}></div>
                          <div className="bg-red-500 h-4 rounded-r-sm" style={{ width: '30%' }}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <div>Buy: 40%</div>
                          <div>Hold: 30%</div>
                          <div>Sell: 30%</div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3 bg-muted/20">
                        <h4 className="text-sm font-medium mb-2">Performance Overview</h4>
                        <div className="grid grid-cols-2 gap-y-2">
                          <div className="text-xs text-muted-foreground">Executed Trades</div>
                          <div className="text-xs text-right">{executedTrades}</div>
                          <div className="text-xs text-muted-foreground">Success Rate</div>
                          <div className="text-xs text-right text-green-500">
                            {executedTrades > 0 ? '68%' : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <div className="mb-2 opacity-50">
                      <ArrowUpDown className="h-8 w-8 mx-auto" />
                    </div>
                    <p>No signals generated yet</p>
                    <p className="text-xs mt-1">Start the AI bot to begin analysis</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="signals" className="space-y-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Trading Signals & Executed Trades</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10">
                    Total: {tradingSignals.length}
                  </Badge>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">
                    Executed: {executedTrades}
                  </Badge>
                </div>
              </div>
              
              {tradingSignals.length > 0 ? (
                <div className="space-y-3">
                  {tradingSignals.map((signal) => (
                    <div key={signal.id} className={`border rounded-md p-3 ${
                      signal.action === 'buy' ? 'bg-green-500/5 hover:bg-green-500/10' : 
                      signal.action === 'sell' ? 'bg-red-500/5 hover:bg-red-500/10' : 
                      'bg-blue-500/5 hover:bg-blue-500/10'
                    } transition-colors`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`font-medium ${
                            signal.action === 'buy' ? 'text-green-500' : 
                            signal.action === 'sell' ? 'text-red-500' : 
                            'text-blue-500'
                          }`}>
                            {signal.action.toUpperCase()} {signal.symbol}
                          </div>
                          {signal.executed && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 text-xs">
                              Executed
                            </Badge>
                          )}
                        </div>
                        {!signal.executed && signal.action !== 'hold' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 text-xs"
                            onClick={() => executeTrade(signal)}
                          >
                            Execute
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground">Price</div>
                          <div>${signal.price.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Confidence</div>
                          <div>{(signal.confidence * 100).toFixed(0)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Time</div>
                          <div>{formatTimestamp(signal.timestamp)}</div>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <div className="text-xs text-muted-foreground">Reason</div>
                          <div className="truncate">{signal.reason}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12 border rounded-md">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No trading signals have been generated</p>
                  <p className="text-xs mt-1">Start the AI bot to generate trading signals</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="activity" className="mt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium flex items-center gap-2">
                  Activity Log
                  <Badge variant="outline" className="bg-primary/10">{activityLog.length}</Badge>
                </h3>
                <Button variant="outline" size="sm" onClick={clearActivityLog} className="h-8">
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Clear
                </Button>
              </div>
              
              <div className="border rounded-md p-3 h-[400px] overflow-y-auto">
                {activityLog.length > 0 ? (
                  <div className="space-y-2 flex flex-col-reverse">
                    <div ref={activityEndRef} />
                    {activityLog.map((entry) => (
                      <div key={entry.id} className="text-sm border-b pb-2 last:border-0">
                        <div className="flex items-start gap-2">
                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimestamp(entry.timestamp)}
                          </div>
                          <div className={getLogEntryClass(entry.type)}>
                            {entry.message}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Info className="h-8 w-8 mb-2 opacity-50" />
                    <p>No activity recorded yet</p>
                  </div>
                )}
              </div>
              
              <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                <div>Bot: {selectedBotObj?.name || "None selected"}</div>
                <div>
                  {isRunning ? (
                    <span className="flex items-center gap-1 text-green-500">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      System active
                    </span>
                  ) : (
                    <span>System idle</span>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Trading Settings</h3>
                  
                  <div className="space-y-4 border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Auto-Trading</div>
                        <div className="text-xs text-muted-foreground">Execute trades automatically</div>
                      </div>
                      <Switch
                        checked={autoTrade}
                        onCheckedChange={toggleAutoTrade}
                      />
                    </div>
                    
                    <div className="space-y-2 border-t pt-4">
                      <div className="flex justify-between">
                        <div className="text-sm">Refresh Interval (seconds)</div>
                        <div className="font-medium">{refreshInterval}s</div>
                      </div>
                      <Select value={refreshInterval.toString()} onValueChange={handleRefreshIntervalChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 second</SelectItem>
                          <SelectItem value="2">2 seconds</SelectItem>
                          <SelectItem value="5">5 seconds</SelectItem>
                          <SelectItem value="10">10 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-end pt-2">
                      <Button variant="outline" size="sm" onClick={resetParameters}>
                        Reset to Defaults
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h4 className="text-sm font-medium mb-3">Advanced Bot Settings</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">Use Machine Learning</div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">Consider Market Sentiment</div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">Enable Risk Management</div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">Debug Mode</div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Dashboard Settings</h3>
                  
                  <div className="border rounded-md p-4 space-y-4">
                    <h4 className="text-sm font-medium">Display Options</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">Show Market Metrics</div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">Show Trading Signals</div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">Show Performance Graphs</div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">Detailed Activity Log</div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-3">Notification Settings</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="text-sm">Signal Alerts</div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">Trade Confirmations</div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">Error Notifications</div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h4 className="text-sm font-medium mb-3">Bot Management</h4>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start" disabled={isRunning}>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure Bot Parameters
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start" disabled={isRunning}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retrain ML Models
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start" disabled={isRunning}>
                        <Zap className="h-4 w-4 mr-2" />
                        Optimize Strategy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t p-2 flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {isRunning ? (
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                {selectedBotObj?.name || "AI Bot"} monitoring {selectedPair} ({selectedTimeframe})
              </div>
            ) : (
              "System ready - Start an AI bot to begin trading analysis"
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {lastSignal && (
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  lastSignal.action === 'buy' ? 'bg-green-500/10 text-green-500' : 
                  lastSignal.action === 'sell' ? 'bg-red-500/10 text-red-500' : 
                  'bg-blue-500/10 text-blue-500'
                }`}
              >
                Last: {lastSignal.action.toUpperCase()} {lastSignal.symbol}
              </Badge>
            )}
            
            {isRunning && (
              <div className="text-xs flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                Active
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdvancedAiTradingDashboard;
