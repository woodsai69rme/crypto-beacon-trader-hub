
import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle, Bot, Brain, TrendingUp, ArrowUpDown, PlayCircle, StopCircle, Cpu, LineChart, 
  Maximize2, Minimize2, X, RefreshCw, Settings, AlertCircle, XCircle, Info, Zap 
} from "lucide-react";
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
          label: `${coin.name} (${coin.symbol})`,
          value: coin.symbol
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

  if (!isDetached && !isMaximized) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Advanced AI Trading Dashboard
            </div>
          </CardTitle>
          <CardDescription>
            Comprehensive AI-powered trading platform with real-time monitoring and automated execution
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Trading Bot</label>
                  <Select value={activeBot} onValueChange={setActiveBot}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_BOTS.map(bot => (
                        <SelectItem key={bot.id} value={bot.id}>
                          <div className="flex items-center gap-2">
                            {bot.icon}
                            <span>{bot.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Trading Pair</label>
                  <Select value={selectedPair} onValueChange={setSelectedPair}>
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
                  <label className="text-sm font-medium mb-1 block">Timeframe</label>
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEFRAMES.map(tf => (
                        <SelectItem key={tf} value={tf}>{tf}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2">
                {!isRunning ? (
                  <Button onClick={startBot} className="flex-1 sm:flex-none">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Bot
                  </Button>
                ) : (
                  <Button onClick={stopBot} variant="destructive" className="flex-1 sm:flex-none">
                    <StopCircle className="w-4 h-4 mr-2" />
                    Stop Bot
                  </Button>
                )}
                
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm">Auto-Trade</span>
                  <Switch checked={autoTrade} onCheckedChange={toggleAutoTrade} />
                </div>
              </div>
              
              {isRunning && (
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Bot className="w-4 h-4 mr-2" />
                    Bot Status
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        Status: <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Running</Badge>
                      </div>
                      
                      <div className="text-sm">
                        Trades Executed: <span className="font-medium">{executedTrades}</span>
                      </div>
                      
                      {metrics && (
                        <div className="text-sm">
                          Win Rate: <span className="font-medium">{(metrics.winRate * 100).toFixed(1)}%</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div>
                        Market Trend: <span className={getMarketTrendClass(marketSummary.trend)}>{marketSummary.trend}</span>
                      </div>
                      
                      <div>
                        Sentiment: <span className={getSentimentClass(marketSummary.sentiment)}>
                          {getSentimentLabel(marketSummary.sentiment)}
                        </span>
                      </div>
                      
                      <div>
                        Volatility: <span>{marketSummary.volatility}</span>
                      </div>
                    </div>
                    
                    {metrics && (
                      <div className="space-y-1 text-sm">
                        <div>
                          Accuracy: <span className="font-medium">{(metrics.accuracy * 100).toFixed(1)}%</span>
                        </div>
                        
                        <div>
                          Return: <span className={metrics.profitability >= 0 ? "text-green-500" : "text-red-500"}>
                            {metrics.profitability >= 0 ? "+" : ""}{metrics.profitability.toFixed(2)}%
                          </span>
                        </div>
                        
                        <div>
                          Sharpe Ratio: <span>{metrics.sharpeRatio.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {showParameters && (
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Strategy Parameters
                    </h3>
                    
                    <Button variant="ghost" size="sm" onClick={resetParameters}>
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Reset
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {botParameters.map(param => (
                      <div key={param.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">{param.name}</label>
                          {param.type !== "toggle" && (
                            <span className="text-xs text-muted-foreground">
                              {typeof param.value === "number" ? param.value.toString() : param.value ? "On" : "Off"}
                              {param.id === "riskLevel" ? "" : param.id.includes("Profit") || param.id.includes("Loss") ? "%" : ""}
                            </span>
                          )}
                        </div>
                        
                        {param.type === "slider" && (
                          <Slider 
                            value={[param.value as number]} 
                            min={param.min} 
                            max={param.max} 
                            step={param.step}
                            onValueChange={(values) => handleParameterChange(param.id, values[0])}
                          />
                        )}
                        
                        {param.type === "number" && (
                          <div className="flex items-center">
                            <Input 
                              type="number"
                              value={param.value as number} 
                              min={param.min} 
                              max={param.max}
                              step={param.step}
                              onChange={(e) => handleParameterChange(param.id, parseFloat(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        )}
                        
                        {param.type === "toggle" && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {param.value ? "Enabled" : "Disabled"}
                            </span>
                            <Switch 
                              checked={param.value as boolean}
                              onCheckedChange={(checked) => handleParameterChange(param.id, checked)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="rounded-lg border border-border">
                <div className="px-4 py-3 border-b border-border font-medium flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Activity Log
                  </div>
                  
                  <Button variant="ghost" size="sm" onClick={clearActivityLog} className="h-7">
                    <XCircle className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                </div>
                
                <div className="p-0 max-h-[350px] overflow-y-auto">
                  {activityLog.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No activity yet. Start the bot to generate logs.
                    </div>
                  ) : (
                    <div className="space-y-0 divide-y divide-border/50">
                      {activityLog.map((entry) => (
                        <div key={entry.id} className="px-4 py-2 text-sm hover:bg-muted/20">
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground text-xs whitespace-nowrap">
                              {formatTimestamp(entry.timestamp)}
                            </span>
                            <span className={getLogEntryClass(entry.type)}>{entry.message}</span>
                          </div>
                        </div>
                      ))}
                      <div ref={activityEndRef} />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="rounded-lg border border-border">
                <div className="px-4 py-3 border-b border-border font-medium flex items-center">
                  <LineChart className="w-4 h-4 mr-2" />
                  Latest Trading Signals
                </div>
                
                <div className="p-0 max-h-[200px] overflow-y-auto">
                  {tradingSignals.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No signals generated yet.
                    </div>
                  ) : (
                    <div className="space-y-0 divide-y divide-border/50">
                      {tradingSignals.map((signal) => (
                        <div key={signal.id} className="px-4 py-2 text-sm hover:bg-muted/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{signal.symbol}</span>
                              <Badge 
                                variant={
                                  signal.action === 'buy' ? 'default' : 
                                  signal.action === 'sell' ? 'destructive' : 'outline'
                                }
                                className="text-xs"
                              >
                                {signal.action.toUpperCase()}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-xs whitespace-nowrap">
                                {formatTimestamp(signal.timestamp)}
                              </span>
                              <span className={`font-medium text-xs ${signal.executed ? 'text-green-500' : ''}`}>
                                {signal.executed ? 'Executed' : 'Pending'}
                              </span>
                              {!signal.executed && signal.action !== 'hold' && (
                                <Button 
                                  size="sm"
                                  variant="ghost" 
                                  className="h-6 px-2 text-xs"
                                  onClick={() => executeTrade(signal)}
                                >
                                  Execute
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-1 flex justify-between">
                            <span className="text-xs text-muted-foreground">{signal.reason}</span>
                            <div className="flex items-center gap-1 text-xs">
                              <span>${signal.price.toFixed(2)}</span>
                              <span className="text-muted-foreground">({(signal.confidence * 100).toFixed(0)}% confidence)</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    Settings
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium mb-1 block">Refresh Interval (sec)</label>
                      <Select value={refreshInterval.toString()} onValueChange={handleRefreshIntervalChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 seconds</SelectItem>
                          <SelectItem value="5">5 seconds</SelectItem>
                          <SelectItem value="10">10 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Parameters</span>
                        <Switch checked={showParameters} onCheckedChange={toggleParameters} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={() => {
            if (onClose) onClose();
          }}>Close</Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Detached or maximized view
  return (
    <div
      ref={dashboardRef}
      style={dashboardStyle}
      className="bg-background border border-border rounded-lg shadow-lg flex flex-col"
    >
      {/* Dashboard header - draggable in detached mode */}
      <div 
        className="p-4 border-b border-border flex justify-between items-center cursor-move"
        onMouseDown={handleHeaderMouseDown}
      >
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h2 className="font-medium">Advanced AI Trading Dashboard</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMaximize}>
            {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
            if (onClose) onClose();
          }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="dashboard" value={activePanel} onValueChange={setActivePanel} className="h-full flex flex-col">
          <div className="border-b border-border">
            <TabsList className="h-10 px-4 pt-2">
              <TabsTrigger value="dashboard" className="rounded-t-lg rounded-b-none">Dashboard</TabsTrigger>
              <TabsTrigger value="signals" className="rounded-t-lg rounded-b-none">Signals</TabsTrigger>
              <TabsTrigger value="settings" className="rounded-t-lg rounded-b-none">Settings</TabsTrigger>
              <TabsTrigger value="logs" className="rounded-t-lg rounded-b-none">Activity Logs</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="dashboard" className="mt-0 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Trading Bot</label>
                      <Select value={activeBot} onValueChange={setActiveBot}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AI_BOTS.map(bot => (
                            <SelectItem key={bot.id} value={bot.id}>
                              <div className="flex items-center gap-2">
                                {bot.icon}
                                <span>{bot.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Trading Pair</label>
                      <Select value={selectedPair} onValueChange={setSelectedPair}>
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
                      <label className="text-sm font-medium mb-1 block">Timeframe</label>
                      <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMEFRAMES.map(tf => (
                            <SelectItem key={tf} value={tf}>{tf}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {!isRunning ? (
                      <Button onClick={startBot} className="flex-1 sm:flex-none">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Start Bot
                      </Button>
                    ) : (
                      <Button onClick={stopBot} variant="destructive" className="flex-1 sm:flex-none">
                        <StopCircle className="w-4 h-4 mr-2" />
                        Stop Bot
                      </Button>
                    )}
                    
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-sm">Auto-Trade</span>
                      <Switch checked={autoTrade} onCheckedChange={toggleAutoTrade} />
                    </div>
                  </div>
                  
                  {isRunning && (
                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-medium mb-3 flex items-center">
                        <Bot className="w-4 h-4 mr-2" />
                        Bot Status
                      </h3>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            Status: <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Running</Badge>
                          </div>
                          
                          <div className="text-sm">
                            Trades Executed: <span className="font-medium">{executedTrades}</span>
                          </div>
                          
                          {metrics && (
                            <div className="text-sm">
                              Win Rate: <span className="font-medium">{(metrics.winRate * 100).toFixed(1)}%</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          <div>
                            Market Trend: <span className={getMarketTrendClass(marketSummary.trend)}>{marketSummary.trend}</span>
                          </div>
                          
                          <div>
                            Sentiment: <span className={getSentimentClass(marketSummary.sentiment)}>
                              {getSentimentLabel(marketSummary.sentiment)}
                            </span>
                          </div>
                          
                          <div>
                            Volatility: <span>{marketSummary.volatility}</span>
                          </div>
                        </div>
                        
                        {metrics && (
                          <div className="space-y-1 text-sm">
                            <div>
                              Accuracy: <span className="font-medium">{(metrics.accuracy * 100).toFixed(1)}%</span>
                            </div>
                            
                            <div>
                              Return: <span className={metrics.profitability >= 0 ? "text-green-500" : "text-red-500"}>
                                {metrics.profitability >= 0 ? "+" : ""}{metrics.profitability.toFixed(2)}%
                              </span>
                            </div>
                            
                            <div>
                              Sharpe Ratio: <span>{metrics.sharpeRatio.toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Latest Signal</h4>
                        {lastSignal ? (
                          <div className="border border-border rounded-lg p-3">
                            <div className="flex justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{lastSignal.symbol}</span>
                                <Badge 
                                  variant={
                                    lastSignal.action === 'buy' ? 'default' : 
                                    lastSignal.action === 'sell' ? 'destructive' : 'outline'
                                  }
                                >
                                  {lastSignal.action.toUpperCase()}
                                </Badge>
                              </div>
                              
                              <div className="text-sm">
                                {formatTimestamp(lastSignal.timestamp)}
                              </div>
                            </div>
                            
                            <div className="text-sm mt-1">
                              <div>Price: <span className="font-medium">${lastSignal.price.toFixed(2)}</span></div>
                              <div>Confidence: <span className="font-medium">{(lastSignal.confidence * 100).toFixed(0)}%</span></div>
                              <div className="text-muted-foreground mt-1">{lastSignal.reason}</div>
                            </div>
                            
                            {!lastSignal.executed && lastSignal.action !== 'hold' && (
                              <div className="mt-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => executeTrade(lastSignal)}
                                  className="w-full"
                                >
                                  Execute Trade
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground text-sm">
                            No signals generated yet
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="rounded-lg border border-border">
                    <div className="px-4 py-3 border-b border-border font-medium flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Activity Log
                      </div>
                      
                      <Button variant="ghost" size="sm" onClick={clearActivityLog} className="h-7">
                        <XCircle className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    </div>
                    
                    <div className="p-0 max-h-[300px] overflow-y-auto">
                      {activityLog.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                          No activity yet. Start the bot to generate logs.
                        </div>
                      ) : (
                        <div className="space-y-0 divide-y divide-border/50">
                          {activityLog.map((entry) => (
                            <div key={entry.id} className="px-4 py-2 text-sm hover:bg-muted/20">
                              <div className="flex items-start gap-2">
                                <span className="text-muted-foreground text-xs whitespace-nowrap">
                                  {formatTimestamp(entry.timestamp)}
                                </span>
                                <span className={getLogEntryClass(entry.type)}>{entry.message}</span>
                              </div>
                            </div>
                          ))}
                          <div ref={activityEndRef} />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {showParameters && (
                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          Strategy Parameters
                        </h3>
                        
                        <Button variant="ghost" size="sm" onClick={resetParameters}>
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Reset
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {botParameters.map(param => (
                          <div key={param.id} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium">{param.name}</label>
                              {param.type !== "toggle" && (
                                <span className="text-xs text-muted-foreground">
                                  {typeof param.value === "number" ? param.value.toString() : param.value ? "On" : "Off"}
                                  {param.id === "riskLevel" ? "" : param.id.includes("Profit") || param.id.includes("Loss") ? "%" : ""}
                                </span>
                              )}
                            </div>
                            
                            {param.type === "slider" && (
                              <Slider 
                                value={[param.value as number]} 
                                min={param.min} 
                                max={param.max} 
                                step={param.step}
                                onValueChange={(values) => handleParameterChange(param.id, values[0])}
                              />
                            )}
                            
                            {param.type === "number" && (
                              <div className="flex items-center">
                                <Input 
                                  type="number"
                                  value={param.value as number} 
                                  min={param.min} 
                                  max={param.max}
                                  step={param.step}
                                  onChange={(e) => handleParameterChange(param.id, parseFloat(e.target.value))}
                                  className="w-full"
                                />
                              </div>
                            )}
                            
                            {param.type === "toggle" && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {param.value ? "Enabled" : "Disabled"}
                                </span>
                                <Switch 
                                  checked={param.value as boolean}
                                  onCheckedChange={(checked) => handleParameterChange(param.id, checked)}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="signals" className="mt-0">
              <div className="rounded-lg border border-border mb-4">
                <div className="px-4 py-3 border-b border-border font-medium flex items-center justify-between">
                  <div className="flex items-center">
                    <LineChart className="w-4 h-4 mr-2" />
                    Trading Signals
                  </div>
                  
                  <Button variant="ghost" size="sm" onClick={generateTradingSignal} disabled={!isRunning}>
                    Generate Signal
                  </Button>
                </div>
                
                <div className="p-0 max-h-[500px] overflow-y-auto">
                  {tradingSignals.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No signals generated yet.
                    </div>
                  ) : (
                    <div className="space-y-0 divide-y divide-border/50">
                      {tradingSignals.map((signal) => (
                        <div key={signal.id} className="px-4 py-3 text-sm hover:bg-muted/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{signal.symbol}</span>
                              <Badge 
                                variant={
                                  signal.action === 'buy' ? 'default' : 
                                  signal.action === 'sell' ? 'destructive' : 'outline'
                                }
                                className="text-xs"
                              >
                                {signal.action.toUpperCase()}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-xs whitespace-nowrap">
                                {formatTimestamp(signal.timestamp)}
                              </span>
                              <span className={`font-medium text-xs ${signal.executed ? 'text-green-500' : ''}`}>
                                {signal.executed ? 'Executed' : 'Pending'}
                              </span>
                              {!signal.executed && signal.action !== 'hold' && (
                                <Button 
                                  size="sm"
                                  variant="ghost" 
                                  className="h-6 px-2 text-xs"
                                  onClick={() => executeTrade(signal)}
                                >
                                  Execute
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-1 flex justify-between">
                            <span className="text-xs text-muted-foreground">{signal.reason}</span>
                            <div className="flex items-center gap-1 text-xs">
                              <span>${signal.price.toFixed(2)}</span>
                              <span className="text-muted-foreground">({(signal.confidence * 100).toFixed(0)}% confidence)</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="text-base">Signal Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Signals:</span>
                        <span>{tradingSignals.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Buy Signals:</span>
                        <span>{tradingSignals.filter(s => s.action === 'buy').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Sell Signals:</span>
                        <span>{tradingSignals.filter(s => s.action === 'sell').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Hold Signals:</span>
                        <span>{tradingSignals.filter(s => s.action === 'hold').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Executed:</span>
                        <span>{tradingSignals.filter(s => s.executed).length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Signal Confidence Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[150px] flex items-center justify-center">
                      {/* This would be a chart in a real implementation */}
                      <div className="text-center text-muted-foreground">
                        Signal confidence visualization would appear here
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Trading Bot Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Refresh Interval (sec)</label>
                        <Select value={refreshInterval.toString()} onValueChange={handleRefreshIntervalChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 seconds</SelectItem>
                            <SelectItem value="5">5 seconds</SelectItem>
                            <SelectItem value="10">10 seconds</SelectItem>
                            <SelectItem value="30">30 seconds</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Show Strategy Parameters</span>
                        <Switch checked={showParameters} onCheckedChange={toggleParameters} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Automatic Trading</span>
                        <Switch checked={autoTrade} onCheckedChange={toggleAutoTrade} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Display Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isDetached && (
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Window Position</label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-muted-foreground">X Position</label>
                              <Input 
                                type="number" 
                                value={position.x} 
                                onChange={(e) => setPosition(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground">Y Position</label>
                              <Input 
                                type="number" 
                                value={position.y} 
                                onChange={(e) => setPosition(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Bot Selection</label>
                        <Select value={activeBot} onValueChange={setActiveBot}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {AI_BOTS.map(bot => (
                              <SelectItem key={bot.id} value={bot.id}>
                                <div className="flex items-center gap-2">
                                  {bot.icon}
                                  <span>{bot.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-base">Strategy Parameters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {botParameters.map(param => (
                        <div key={param.id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">{param.name}</label>
                            {param.type !== "toggle" && (
                              <span className="text-xs text-muted-foreground">
                                {typeof param.value === "number" ? param.value.toString() : param.value ? "On" : "Off"}
                                {param.id === "riskLevel" ? "" : param.id.includes("Profit") || param.id.includes("Loss") ? "%" : ""}
                              </span>
                            )}
                          </div>
                          
                          {param.type === "slider" && (
                            <Slider 
                              value={[param.value as number]} 
                              min={param.min} 
                              max={param.max} 
                              step={param.step}
                              onValueChange={(values) => handleParameterChange(param.id, values[0])}
                            />
                          )}
                          
                          {param.type === "number" && (
                            <div className="flex items-center">
                              <Input 
                                type="number"
                                value={param.value as number} 
                                min={param.min} 
                                max={param.max}
                                step={param.step}
                                onChange={(e) => handleParameterChange(param.id, parseFloat(e.target.value))}
                                className="w-full"
                              />
                            </div>
                          )}
                          
                          {param.type === "toggle" && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {param.value ? "Enabled" : "Disabled"}
                              </span>
                              <Switch 
                                checked={param.value as boolean}
                                onCheckedChange={(checked) => handleParameterChange(param.id, checked)}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <div className="pt-4">
                        <Button variant="outline" onClick={resetParameters} className="w-full">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reset to Default Values
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="logs" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Activity Log
                </h3>
                
                <Button variant="outline" size="sm" onClick={clearActivityLog}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Clear Log
                </Button>
              </div>
              
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="p-0 max-h-[600px] overflow-y-auto">
                  {activityLog.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No activity yet. Start the bot to generate logs.
                    </div>
                  ) : (
                    <div className="space-y-0 divide-y divide-border/50">
                      {activityLog.map((entry) => (
                        <div key={entry.id} className="px-4 py-2 text-sm hover:bg-muted/20">
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground text-xs whitespace-nowrap">
                              {formatTimestamp(entry.timestamp)}
                            </span>
                            <span className={getLogEntryClass(entry.type)}>{entry.message}</span>
                          </div>
                        </div>
                      ))}
                      <div ref={activityEndRef} />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Log Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Entries:</span>
                        <span>{activityLog.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Info Messages:</span>
                        <span>{activityLog.filter(entry => entry.type === 'info').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Success Messages:</span>
                        <span>{activityLog.filter(entry => entry.type === 'success').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Warning Messages:</span>
                        <span>{activityLog.filter(entry => entry.type === 'warning').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Error Messages:</span>
                        <span>{activityLog.filter(entry => entry.type === 'error').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Trade Actions:</span>
                        <span>{activityLog.filter(entry => entry.type === 'trade').length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Recent Activity Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activityLog.length > 0 ? (
                        <>
                          <div>
                            <div className="text-sm font-medium">Last Activity</div>
                            <div className="text-sm text-muted-foreground">{activityLog[0].message}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium">Trading Activity</div>
                            <div className="text-sm text-muted-foreground">
                              {activityLog.filter(log => log.type === 'trade').length} trade actions recorded
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium">Bot Status</div>
                            <div className="text-sm text-muted-foreground">
                              {isRunning ? (
                                <span className="text-green-500">Bot is currently active and running</span>
                              ) : (
                                <span className="text-amber-500">Bot is currently stopped</span>
                              )}
                            </div>
                          </div>
                          
                          {isRunning && metrics && (
                            <div>
                              <div className="text-sm font-medium">Performance Summary</div>
                              <div className="text-sm text-muted-foreground">
                                Win Rate: {(metrics.winRate * 100).toFixed(1)}% | 
                                Return: {metrics.profitability >= 0 ? "+" : ""}{metrics.profitability.toFixed(2)}% | 
                                Total Trades: {metrics.totalTrades}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center text-muted-foreground py-6">
                          No activity data available yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedAiTradingDashboard;
