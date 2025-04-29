
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Bot, Brain, AlertTriangle, TrendingUp, BarChart2, ArrowDown, ArrowUp, Check, X } from "lucide-react";
import { AITradingStrategy } from "@/types/trading";
import AiTradingBotDetail from "./AiTradingBotDetail";
import { toast } from "@/components/ui/use-toast";

const AI_STRATEGIES: AITradingStrategy[] = [
  {
    id: "strategy-1",
    name: "Trend Following",
    description: "Uses moving averages and momentum indicators to identify and follow market trends",
    riskLevel: "medium",
    timeframe: "4h",
    type: "trend-following",
    performance: 12.5,
    creator: "System",
    tags: ["Momentum", "Moving Averages", "Slow"],
    indicators: ["EMA", "RSI", "ATR"]
  },
  {
    id: "strategy-2",
    name: "Breakout Hunter",
    description: "Detects price breakouts from key support and resistance levels",
    riskLevel: "high",
    timeframe: "1h",
    type: "breakout",
    performance: 18.2,
    creator: "System",
    tags: ["Volatile", "Breakouts", "Support/Resistance"],
    indicators: ["Bollinger Bands", "Volume", "Price Action"]
  },
  {
    id: "strategy-3",
    name: "Mean Reversion",
    description: "Identifies overbought and oversold conditions for reversals",
    riskLevel: "low",
    timeframe: "1d",
    type: "mean-reversion",
    performance: 8.7,
    creator: "System",
    tags: ["Stable", "Oscillators", "Reversal"],
    indicators: ["RSI", "Stochastic", "MACD"]
  }
];

const MARKET_CONDITIONS = [
  { id: "bull", name: "Bull Market", description: "Market is in an uptrend across multiple timeframes" },
  { id: "bear", name: "Bear Market", description: "Market is in a downtrend across multiple timeframes" },
  { id: "sideways", name: "Sideways Market", description: "Market is consolidating in a range" },
  { id: "volatile", name: "Volatile Market", description: "Market is experiencing high volatility" }
];

const AiTradingBots: React.FC = () => {
  const [strategies, setStrategies] = useState<AITradingStrategy[]>(AI_STRATEGIES);
  const [activeStrategyId, setActiveStrategyId] = useState<string | null>(null);
  const [selectedMarketType, setSelectedMarketType] = useState<string>("bull");
  const [backtest, setBacktest] = useState({
    period: "6m",
    startingCapital: 10000,
    maxTradeSize: 20,
    slippage: 0.5,
    useStopLoss: true,
    useTakeProfit: true
  });
  const [activeTab, setActiveTab] = useState("manage");
  const [newStrategy, setNewStrategy] = useState<Partial<AITradingStrategy>>({
    name: "",
    description: "",
    riskLevel: "medium",
    timeframe: "1h",
    type: "trend-following"
  });

  // Get active strategy
  const activeStrategy = activeStrategyId 
    ? strategies.find(s => s.id === activeStrategyId)
    : null;

  // Filter strategies by market condition
  const filterStrategiesByMarket = (marketType: string) => {
    switch(marketType) {
      case "bull":
        return strategies.filter(s => 
          s.type === "trend-following" || s.type === "breakout"
        );
      case "bear":
        return strategies.filter(s => 
          s.type === "mean-reversion" || s.type === "sentiment"
        );
      case "sideways":
        return strategies.filter(s => 
          s.type === "mean-reversion" || s.type === "machine-learning"
        );
      case "volatile":
        return strategies.filter(s => 
          s.type === "breakout" || s.type === "hybrid"
        );
      default:
        return strategies;
    }
  };

  // Get filtered strategies by current market selection
  const filteredStrategies = filterStrategiesByMarket(selectedMarketType);

  const handleCreateStrategy = () => {
    if (!newStrategy.name || !newStrategy.description) {
      toast({
        title: "Validation Error",
        description: "Please provide a strategy name and description",
        variant: "destructive"
      });
      return;
    }
    
    const newStrategyData: AITradingStrategy = {
      id: `strategy-${Date.now()}`,
      name: newStrategy.name || "New Strategy",
      description: newStrategy.description || "",
      riskLevel: newStrategy.riskLevel || "medium",
      timeframe: newStrategy.timeframe || "1h",
      type: newStrategy.type || "trend-following",
      creator: "User",
      performance: 0,
      indicators: [],
      tags: []
    };
    
    setStrategies([...strategies, newStrategyData]);
    
    setNewStrategy({
      name: "",
      description: "",
      riskLevel: "medium",
      timeframe: "1h",
      type: "trend-following"
    });
    
    toast({
      title: "Strategy Created",
      description: "Your new AI trading strategy has been created"
    });
  };

  const handleRunBacktest = () => {
    toast({
      title: "Backtesting Started",
      description: `Running backtest on ${activeStrategy?.name} with ${backtest.period} data`,
    });
    
    // Simulate a delay for the backtest
    setTimeout(() => {
      toast({
        title: "Backtest Complete",
        description: "Results are now available in the Performance tab",
      });
    }, 3000);
  };

  const handleDeleteStrategy = (strategyId: string) => {
    setStrategies(strategies.filter(s => s.id !== strategyId));
    if (activeStrategyId === strategyId) {
      setActiveStrategyId(null);
    }
    
    toast({
      title: "Strategy Deleted",
      description: "AI trading strategy has been removed"
    });
  };

  const getRiskBadgeColor = (risk: string) => {
    switch(risk) {
      case "low":
        return "bg-green-500/10 text-green-500";
      case "medium":
        return "bg-amber-500/10 text-amber-500";
      case "high":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-blue-500/10 text-blue-500";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Trading Bots
            </CardTitle>
            <CardDescription>
              Automated trading strategies using artificial intelligence
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">Create Strategy</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New AI Strategy</DialogTitle>
                <DialogDescription>
                  Design a custom trading strategy powered by AI
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 my-4">
                <div className="space-y-2">
                  <Label htmlFor="strategy-name">Strategy Name</Label>
                  <Input 
                    id="strategy-name" 
                    value={newStrategy.name} 
                    onChange={(e) => setNewStrategy({...newStrategy, name: e.target.value})}
                    placeholder="e.g. Momentum Swing Trader"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="strategy-description">Description</Label>
                  <Input 
                    id="strategy-description" 
                    value={newStrategy.description} 
                    onChange={(e) => setNewStrategy({...newStrategy, description: e.target.value})}
                    placeholder="Describe what your strategy does"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="strategy-type">Type</Label>
                  <Select 
                    value={newStrategy.type} 
                    onValueChange={(value) => setNewStrategy({...newStrategy, type: value as AITradingStrategy["type"]})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select strategy type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trend-following">Trend Following</SelectItem>
                      <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                      <SelectItem value="breakout">Breakout</SelectItem>
                      <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                      <SelectItem value="machine-learning">Machine Learning</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="strategy-timeframe">Timeframe</Label>
                  <Select 
                    value={newStrategy.timeframe} 
                    onValueChange={(value) => setNewStrategy({...newStrategy, timeframe: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5m">5 Minutes</SelectItem>
                      <SelectItem value="15m">15 Minutes</SelectItem>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="4h">4 Hours</SelectItem>
                      <SelectItem value="1d">1 Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="strategy-risk">Risk Level</Label>
                  <Select 
                    value={newStrategy.riskLevel} 
                    onValueChange={(value) => setNewStrategy({...newStrategy, riskLevel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={handleCreateStrategy}>Create Strategy</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <Label className="mb-2 block">Optimize for Market Condition</Label>
          <Tabs defaultValue={selectedMarketType} onValueChange={setSelectedMarketType}>
            <TabsList className="grid grid-cols-4">
              {MARKET_CONDITIONS.map(condition => (
                <TabsTrigger key={condition.id} value={condition.id}>
                  {condition.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <p className="text-xs text-muted-foreground mt-2">
            {MARKET_CONDITIONS.find(c => c.id === selectedMarketType)?.description}
          </p>
        </div>
        
        <div className="space-y-3">
          {filteredStrategies.length > 0 ? (
            filteredStrategies.map(strategy => (
              <div 
                key={strategy.id}
                className={`p-4 border rounded-lg ${activeStrategyId === strategy.id ? 'border-primary' : 'border-border'} cursor-pointer`}
                onClick={() => setActiveStrategyId(activeStrategyId === strategy.id ? null : strategy.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium flex items-center">
                      {strategy.name}
                      <Badge className={`ml-2 ${getRiskBadgeColor(strategy.riskLevel)}`}>
                        {strategy.riskLevel.charAt(0).toUpperCase() + strategy.riskLevel.slice(1)} Risk
                      </Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">{strategy.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${(strategy.performance || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {(strategy.performance || 0) >= 0 ? '+' : ''}{strategy.performance || 0}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {strategy.timeframe} timeframe
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {strategy.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Brain className="h-3.5 w-3.5 mr-1" />
                    {strategy.type?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteStrategy(strategy.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 border border-dashed rounded-lg border-muted-foreground/20">
              <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No suitable strategies for this market condition.</p>
              <p className="text-sm text-muted-foreground mt-1">Create a new strategy or change market type.</p>
            </div>
          )}
        </div>
      </CardContent>
      
      {activeStrategy && (
        <CardFooter className="flex flex-col border-t pt-4">
          <div className="w-full">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="manage">Manage</TabsTrigger>
                <TabsTrigger value="backtest">Backtest</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manage" className="mt-4">
                <AiTradingBotDetail 
                  botId={`bot-${activeStrategy.id}`}
                  strategyId={activeStrategy.id}
                  strategyName={activeStrategy.name}
                />
              </TabsContent>
              
              <TabsContent value="backtest" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Backtest Period</Label>
                        <Select value={backtest.period} onValueChange={(value) => setBacktest({...backtest, period: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1m">1 Month</SelectItem>
                            <SelectItem value="3m">3 Months</SelectItem>
                            <SelectItem value="6m">6 Months</SelectItem>
                            <SelectItem value="1y">1 Year</SelectItem>
                            <SelectItem value="3y">3 Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Starting Capital</Label>
                        <div className="flex items-center">
                          <span className="mr-2">$</span>
                          <Input
                            type="number"
                            value={backtest.startingCapital}
                            onChange={(e) => setBacktest({...backtest, startingCapital: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Max Trade Size (%)</Label>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <Slider
                              value={[backtest.maxTradeSize]}
                              min={1}
                              max={100}
                              step={1}
                              onValueChange={(value) => setBacktest({...backtest, maxTradeSize: value[0]})}
                            />
                          </div>
                          <div className="w-12 text-center">{backtest.maxTradeSize}%</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="use-sl">Use Stop Loss</Label>
                        <Switch
                          id="use-sl"
                          checked={backtest.useStopLoss}
                          onCheckedChange={(checked) => setBacktest({...backtest, useStopLoss: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="use-tp">Use Take Profit</Label>
                        <Switch
                          id="use-tp"
                          checked={backtest.useTakeProfit}
                          onCheckedChange={(checked) => setBacktest({...backtest, useTakeProfit: checked})}
                        />
                      </div>
                      
                      <Button className="w-full" onClick={handleRunBacktest}>
                        Run Backtest
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="performance" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="text-sm text-muted-foreground">Performance</div>
                          <div className={`text-xl font-semibold ${(activeStrategy.performance || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {(activeStrategy.performance || 0) >= 0 ? '+' : ''}{activeStrategy.performance || 0}%
                          </div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="text-sm text-muted-foreground">Win Rate</div>
                          <div className="text-xl font-semibold">62%</div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="text-sm text-muted-foreground">Risk/Reward</div>
                          <div className="text-xl font-semibold">1.8</div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="text-sm text-muted-foreground">Max Drawdown</div>
                          <div className="text-xl font-semibold text-red-500">-14.2%</div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Recommended Markets</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">BTC/USD</Badge>
                          <Badge variant="outline" className="text-xs">ETH/USD</Badge>
                          <Badge variant="outline" className="text-xs">SOL/USD</Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Performance History</h3>
                        <div className="space-y-2">
                          {["Strategy run on 2023-05-15: +3.2%", "Strategy run on 2023-05-10: -1.1%", "Strategy run on 2023-05-05: +4.5%"].map((history, index) => (
                            <div key={index} className="text-xs flex justify-between p-2 border-b">
                              <span>{history.split(": ")[0]}</span>
                              <span className={history.includes("+") ? "text-green-500" : "text-red-500"}>
                                {history.split(": ")[1]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Strengths & Weaknesses</h3>
                        <div className="space-y-2">
                          <div className="flex items-center text-xs">
                            <Check className="h-3 w-3 text-green-500 mr-1" />
                            <span>Performs well in {activeStrategy.type === 'trend-following' ? 'trending' : 'volatile'} markets</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Check className="h-3 w-3 text-green-500 mr-1" />
                            <span>Consistent returns over {backtest.period} timeframe</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <X className="h-3 w-3 text-red-500 mr-1" />
                            <span>Underperforms in {activeStrategy.type === 'trend-following' ? 'sideways' : 'trending'} markets</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default AiTradingBots;
