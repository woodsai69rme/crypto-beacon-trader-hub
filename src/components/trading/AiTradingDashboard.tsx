
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Brain, TrendingUp, ArrowUpDown, PlayCircle, StopCircle, Cpu, LineChart } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { startPriceMonitoring } from "@/services/priceMonitoring";
import { CoinOption } from "@/types/trading";
import AiTradingBotMetrics from "./AiTradingBotMetrics";
import AiTradingStrategySelector from "./AiTradingStrategySelector";
import AiTradingVisualizer from "./AiTradingVisualizer";

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

const AiTradingDashboard: React.FC = () => {
  const [activeBot, setActiveBot] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1h");
  const [marketData, setMarketData] = useState<CoinOption[]>([]);
  const [tradingPairs, setTradingPairs] = useState<string[]>(["BTC/USD", "ETH/USD", "SOL/USD"]);
  const [selectedPair, setSelectedPair] = useState<string>("BTC/USD");
  const [lastSignal, setLastSignal] = useState<string | null>(null);
  
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
    
    return () => stopMonitoring();
  }, [isRunning, activeBot, selectedPair]);
  
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
  };
  
  const stopBot = () => {
    setIsRunning(false);
    
    const selectedBot = AI_BOTS.find(bot => bot.id === activeBot);
    
    toast({
      title: "AI Bot Stopped",
      description: `${selectedBot?.name} has been stopped`
    });
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
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Trading Dashboard
            </CardTitle>
            <CardDescription>
              Advanced AI-powered trading analysis and execution
            </CardDescription>
          </div>
          {isRunning && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 animate-pulse">
              AI Active
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-4">
            <div className="text-sm font-medium">Select AI Bot</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
              {AI_BOTS.map(bot => (
                <Button
                  key={bot.id}
                  variant={activeBot === bot.id ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setActiveBot(bot.id)}
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
                <Select value={selectedPair} onValueChange={setSelectedPair}>
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
        
        <Tabs defaultValue="visualization">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="visualization">Trading Visualization</TabsTrigger>
            <TabsTrigger value="metrics">Bot Metrics</TabsTrigger>
            <TabsTrigger value="strategy">Strategy Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualization">
            <AiTradingVisualizer 
              botId={activeBot || ''} 
              tradingPair={selectedPair}
              timeframe={selectedTimeframe}
              isRunning={isRunning}
            />
          </TabsContent>
          
          <TabsContent value="metrics">
            <AiTradingBotMetrics 
              botId={activeBot || ''}
              isRunning={isRunning}
            />
          </TabsContent>
          
          <TabsContent value="strategy">
            <AiTradingStrategySelector
              botId={activeBot || ''}
              onSelectStrategy={() => {}}
            />
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
  );
};

export default AiTradingDashboard;
