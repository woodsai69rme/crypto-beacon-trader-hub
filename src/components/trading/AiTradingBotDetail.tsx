
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, PlayCircle, StopCircle, Settings, LineChart, History } from "lucide-react";
import { AiBotTradingProps } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";
import { AVAILABLE_STRATEGIES } from "@/services/aiTradingService";

const AiTradingBotDetail: React.FC<AiBotTradingProps> = ({ botId, strategyId, strategyName }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastActivity, setLastActivity] = useState<string | null>(null);
  const [lastTrade, setLastTrade] = useState<{type: 'buy' | 'sell', asset: string, amount: number, price: number} | null>(null);
  const [botPerformance, setBotPerformance] = useState({
    tradesExecuted: 0,
    winRate: 0,
    profit: 0,
    drawdown: 0
  });

  // Find the strategy from available strategies
  const strategy = AVAILABLE_STRATEGIES.find(s => s.id === strategyId) || {
    id: strategyId,
    name: strategyName || "Custom Strategy",
    description: "A custom trading strategy",
    type: "custom" as const,
    timeframe: "1d",
    parameters: {
      riskLevel: "medium"
    }
  };

  useEffect(() => {
    // Simulate bot activity
    if (isRunning) {
      const interval = setInterval(() => {
        // Simulate bot analyzing market
        const actions = [
          "Analyzing market trends...",
          "Evaluating support levels...",
          "Checking resistance levels...",
          "Calculating moving averages...",
          "Analyzing RSI indicator...",
          "Evaluating MACD crossover...",
          "Checking trading volume...",
          "Analyzing price action..."
        ];
        
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        setLastActivity(randomAction);
        
        // Occasionally generate a trade (10% chance)
        if (Math.random() < 0.1) {
          generateTrade();
        }
        
        // Update performance metrics
        updatePerformance();
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isRunning]);
  
  const startBot = () => {
    setIsRunning(true);
    toast({
      title: "Bot Started",
      description: `${botId} is now actively trading with ${strategy.name} strategy`
    });
  };
  
  const stopBot = () => {
    setIsRunning(false);
    toast({
      title: "Bot Stopped",
      description: `${botId} has been deactivated`
    });
  };
  
  const generateTrade = () => {
    const tradeType = Math.random() > 0.5 ? 'buy' : 'sell';
    const assets = ["BTC", "ETH", "SOL", "ADA", "DOT"];
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const amount = parseFloat((Math.random() * 0.5).toFixed(4));
    const price = parseFloat((asset === "BTC" ? 60000 + (Math.random() * 5000) : 
                              asset === "ETH" ? 3000 + (Math.random() * 500) :
                              asset === "SOL" ? 100 + (Math.random() * 50) :
                              asset === "ADA" ? 0.5 + (Math.random() * 0.2) : 
                              20 + (Math.random() * 5)).toFixed(2));
    
    setLastTrade({ type: tradeType, asset, amount, price });
    setBotPerformance(prev => ({
      ...prev,
      tradesExecuted: prev.tradesExecuted + 1
    }));
    
    toast({
      title: `${tradeType.toUpperCase()} Signal Generated`,
      description: `${amount} ${asset} at $${price.toFixed(2)}`,
      variant: tradeType === 'buy' ? "default" : "destructive"
    });
  };
  
  const updatePerformance = () => {
    setBotPerformance(prev => {
      const newWinRate = Math.min(0.8, prev.winRate + (Math.random() * 0.02 - 0.01));
      const profitChange = Math.random() * 2 - 0.5; // Between -0.5% and +1.5%
      const newProfit = prev.profit + profitChange;
      const newDrawdown = Math.max(0, Math.min(30, prev.drawdown + (Math.random() * 0.5 - 0.3)));
      
      return {
        ...prev,
        winRate: parseFloat(newWinRate.toFixed(2)),
        profit: parseFloat(newProfit.toFixed(2)),
        drawdown: parseFloat(newDrawdown.toFixed(2))
      };
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {botId} Details
            </CardTitle>
            <CardDescription>
              {strategy.name} - {strategy.description}
            </CardDescription>
          </div>
          <Badge variant={isRunning ? "default" : "outline"} className={isRunning ? "bg-green-500/10 text-green-500" : ""}>
            {isRunning ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card/60 p-3 rounded-lg border">
            <div className="text-xs text-muted-foreground">Trades Executed</div>
            <div className="font-medium text-lg">{botPerformance.tradesExecuted}</div>
          </div>
          <div className="bg-card/60 p-3 rounded-lg border">
            <div className="text-xs text-muted-foreground">Win Rate</div>
            <div className="font-medium text-lg">{botPerformance.winRate * 100}%</div>
          </div>
          <div className="bg-card/60 p-3 rounded-lg border">
            <div className="text-xs text-muted-foreground">Profit</div>
            <div className={`font-medium text-lg ${botPerformance.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {botPerformance.profit >= 0 ? '+' : ''}{botPerformance.profit}%
            </div>
          </div>
          <div className="bg-card/60 p-3 rounded-lg border">
            <div className="text-xs text-muted-foreground">Max Drawdown</div>
            <div className="font-medium text-lg text-amber-500">-{botPerformance.drawdown}%</div>
          </div>
        </div>
        
        <Tabs defaultValue="activity">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Recent Activity</h3>
              {lastActivity ? (
                <div className="text-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span>{lastActivity}</span>
                    <span className="text-xs text-muted-foreground">{new Date().toLocaleTimeString()}</span>
                  </div>
                  {lastTrade && (
                    <div className={`mt-2 p-2 rounded-md ${lastTrade.type === 'buy' ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                      <div className="flex justify-between font-medium">
                        <span className={lastTrade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                          {lastTrade.type.toUpperCase()}
                        </span>
                        <span>{lastTrade.amount} {lastTrade.asset}</span>
                        <span>${lastTrade.price.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No recent activity. Start the bot to begin trading.
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Strategy Parameters</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{strategy.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timeframe:</span>
                    <span>{strategy.timeframe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Level:</span>
                    <span className="capitalize">{strategy.parameters.riskLevel || "Medium"}</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Trading Limits</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Position Size:</span>
                    <span>10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stop Loss:</span>
                    <span>5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Take Profit:</span>
                    <span>15%</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Bot Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Trade Size</div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value="10" 
                        className="w-full" 
                        readOnly
                      />
                      <span className="text-sm">10%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Risk Level</div>
                    <select className="w-full border rounded-md p-2 bg-background">
                      <option value="low">Low</option>
                      <option value="medium" selected>Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Stop Loss</div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        value="5" 
                        className="w-full" 
                        readOnly
                      />
                      <span className="text-sm">5%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Take Profit</div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        value="15" 
                        className="w-full" 
                        readOnly
                      />
                      <span className="text-sm">15%</span>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4" disabled>
                  <Settings className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="performance">
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Performance Metrics</h3>
              
              <div className="h-60 border rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <LineChart className="h-10 w-10 mx-auto mb-2" />
                  <div>Performance chart will appear here</div>
                  <div className="text-xs">Historical data will be displayed as trading continues</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-2 border rounded-lg">
                  <div className="text-xs text-muted-foreground">Win Rate</div>
                  <div className="font-medium">{(botPerformance.winRate * 100).toFixed(1)}%</div>
                </div>
                <div className="p-2 border rounded-lg">
                  <div className="text-xs text-muted-foreground">Profit Factor</div>
                  <div className="font-medium">1.42</div>
                </div>
                <div className="p-2 border rounded-lg">
                  <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                  <div className="font-medium">1.18</div>
                </div>
                <div className="p-2 border rounded-lg">
                  <div className="text-xs text-muted-foreground">Avg Trade</div>
                  <div className="font-medium">+0.52%</div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <History className="h-4 w-4 mr-2" />
                View Full Performance History
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-end space-x-2">
        {isRunning ? (
          <Button variant="destructive" onClick={stopBot}>
            <StopCircle className="h-4 w-4 mr-2" />
            Stop Bot
          </Button>
        ) : (
          <Button onClick={startBot}>
            <PlayCircle className="h-4 w-4 mr-2" />
            Start Bot
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AiTradingBotDetail;
