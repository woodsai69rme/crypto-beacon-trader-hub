
import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Bot, Brain, TrendingUp, ArrowUpDown, PlayCircle, StopCircle, Cpu, LineChart, Maximize2, Minimize2, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { startPriceMonitoring } from "@/services/priceMonitoring";
import { CoinOption } from "@/types/trading";
import AiTradingVisualizer from "./AiTradingVisualizer";
import { Resizable } from "react-resizable";

interface DetachedAiTradingDashboardProps {
  onClose: () => void;
  initialPosition?: { x: number, y: number };
}

const DetachedAiTradingDashboard: React.FC<DetachedAiTradingDashboardProps> = ({ 
  onClose,
  initialPosition = { x: 20, y: 100 }
}) => {
  const [activeBot, setActiveBot] = useState<string | null>("trend-bot");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1h");
  const [marketData, setMarketData] = useState<CoinOption[]>([]);
  const [tradingPairs, setTradingPairs] = useState<string[]>(["BTC/USD", "ETH/USD", "SOL/USD"]);
  const [selectedPair, setSelectedPair] = useState<string>("BTC/USD");
  const [lastSignal, setLastSignal] = useState<string | null>(null);
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState({ width: 600, height: 500 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [activityLog, setActivityLog] = useState<{ timestamp: string, message: string, type?: string }[]>([]);
  
  const dashboardRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number, y: number } | null>(null);
  
  const AI_BOTS = [
    {
      id: "trend-bot",
      name: "Trend Analyzer",
      description: "Analyzes market trends and momentum indicators",
      icon: <TrendingUp className="h-5 w-5" />,
      strategy: "trend-following",
    },
    {
      id: "pattern-bot",
      name: "Pattern Recognition",
      description: "Identifies technical patterns and chart formations",
      icon: <LineChart className="h-5 w-5" />,
      strategy: "pattern-recognition",
    },
    {
      id: "sentiment-bot",
      name: "Sentiment Analyzer",
      description: "Analyzes market sentiment from news and social media",
      icon: <Brain className="h-5 w-5" />,
      strategy: "sentiment-analysis",
    },
    {
      id: "quantum-bot", 
      name: "Quantum AI",
      description: "Advanced ML strategies with multi-timeframe analysis",
      icon: <Cpu className="h-5 w-5" />,
      strategy: "quantum-ml",
    }
  ];

  useEffect(() => {
    // Start price monitoring to get real-time market data
    const coinIds = ["bitcoin", "ethereum", "solana", "cardano", "ripple", "dogecoin"];
    
    const stopMonitoring = startPriceMonitoring(
      coinIds,
      (updatedCoins) => {
        setMarketData(updatedCoins);
        
        // Simulate AI bot generating trading signals
        if (isRunning && activeBot && Math.random() > 0.8) {
          generateTradingSignal(activeBot, selectedPair);
        }
      },
      3000 // Update every 3 seconds
    );
    
    // Set up drag handlers
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
    
    // Add a random activity log entry every 5-10 seconds
    const activityInterval = setInterval(() => {
      if (isRunning && activeBot) {
        addActivityLog();
      }
    }, 5000 + Math.random() * 5000);
    
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      stopMonitoring();
      document.removeEventListener('mouseup', handleMouseUp);
      clearInterval(activityInterval);
    };
  }, [isRunning, activeBot, selectedPair, isMaximized]);
  
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
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
  
  const handleResize = (e: React.SyntheticEvent, { size }: { size: { width: number, height: number } }) => {
    setSize({ width: size.width, height: size.height });
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
    
    addActivityLog(`${selectedBot?.name} started. Initializing market data analysis...`, 'system');
  };
  
  const stopBot = () => {
    setIsRunning(false);
    
    const selectedBot = AI_BOTS.find(bot => bot.id === activeBot);
    
    toast({
      title: "AI Bot Stopped",
      description: `${selectedBot?.name} has been stopped`
    });
    
    addActivityLog(`${selectedBot?.name} stopped by user.`, 'system');
  };
  
  const generateTradingSignal = (botId: string, pair: string) => {
    const signalTypes = ["BUY", "SELL", "HOLD"];
    const confidenceLevels = ["High", "Medium", "Low"];
    const randomSignal = signalTypes[Math.floor(Math.random() * signalTypes.length)];
    const randomConfidence = confidenceLevels[Math.floor(Math.random() * confidenceLevels.length)];
    
    const signal = `${randomSignal} ${pair} (${randomConfidence} confidence)`;
    setLastSignal(signal);
    
    if (randomSignal !== "HOLD") {
      toast({
        title: `${randomSignal} Signal Generated`,
        description: `${pair} - ${randomConfidence} confidence level`
      });
      
      addActivityLog(`Generated ${randomSignal} signal for ${pair} with ${randomConfidence} confidence.`, randomSignal.toLowerCase());
    }
  };
  
  const toggleMaximize = () => {
    setIsMaximized(prev => !prev);
  };
  
  const addActivityLog = (message?: string, type?: string) => {
    if (!message) {
      const activities = [
        "Analyzing price patterns...",
        "Calculating moving averages...",
        "Evaluating support/resistance levels...",
        "Checking volume profile...",
        "Running sentiment analysis...",
        "Processing historical data...",
        "Detecting divergence patterns...",
        "Evaluating trend strength...",
        "Checking indicator correlations...",
        "Scanning for breakout opportunities..."
      ];
      message = activities[Math.floor(Math.random() * activities.length)];
    }
    
    setActivityLog(prev => [
      {
        timestamp: new Date().toLocaleTimeString(),
        message,
        type
      },
      ...prev.slice(0, 49) // Keep only the last 50 entries
    ]);
  };

  const dashboardStyle: React.CSSProperties = isMaximized
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
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: 1000,
      };

  return (
    <div 
      ref={dashboardRef}
      className="shadow-xl rounded-lg overflow-hidden resize-handle"
      style={dashboardStyle}
    >
      <Card className="w-full h-full flex flex-col border-2">
        <CardHeader 
          className="bg-card/50 border-b border-border py-2 cursor-move flex flex-row items-center justify-between"
          onMouseDown={handleHeaderMouseDown}
        >
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5" />
              Real-Time AI Trading Dashboard
              {isRunning && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 animate-pulse ml-2">
                  Live
                </Badge>
              )}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggleMaximize} className="h-8 w-8">
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-4">
              <div className="text-sm font-medium">Select AI Bot</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
                {AI_BOTS.map(bot => (
                  <Button
                    key={bot.id}
                    variant={activeBot === bot.id ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setActiveBot(bot.id)}
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
                
                <div>
                  <div className="text-xs mb-1">Risk Level</div>
                  <div className="pt-2">
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      disabled={isRunning}
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>Conservative</span>
                      <span>Balanced</span>
                      <span>Aggressive</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs">Auto-Execute Trades</span>
                  <Switch disabled={isRunning} />
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
                        <div className="text-right">${coin.price.toFixed(2)}</div>
                        <div className={`text-right ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                          {isUp ? '+' : ''}{coin.changePercent?.toFixed(2)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="visualization" className="mt-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="visualization">Trading Visualization</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="visualization">
              <div className="border rounded-lg p-4">
                <AiTradingVisualizer 
                  botId={activeBot || ''} 
                  tradingPair={selectedPair}
                  timeframe={selectedTimeframe}
                  isRunning={isRunning}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Real-Time Activity Log</h3>
                <div className="h-[300px] overflow-y-auto border rounded-lg p-2 bg-muted/20">
                  {activityLog.length > 0 ? (
                    <div className="space-y-2">
                      {activityLog.map((entry, idx) => (
                        <div key={idx} className="text-xs border-b pb-1 last:border-0">
                          <span className="text-muted-foreground">{entry.timestamp}</span>
                          <span className={`ml-2 ${
                            entry.type === 'buy' ? 'text-green-500' : 
                            entry.type === 'sell' ? 'text-red-500' :
                            entry.type === 'system' ? 'text-amber-500' :
                            ''
                          }`}>
                            {entry.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-sm text-muted-foreground py-4">
                      No activity recorded yet. Start the AI bot to begin.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t pt-2 pb-2">
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

export default DetachedAiTradingDashboard;
