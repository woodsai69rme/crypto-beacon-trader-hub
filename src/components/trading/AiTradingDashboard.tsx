import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AITradingStrategy } from "@/types/trading";
import { Bot, Play, Pause, AlertTriangle, TrendingUp, BarChart2, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AiTradingDashboard = () => {
  const [activeBot, setActiveBot] = useState<string | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<AITradingStrategy | null>(null);
  const [botName, setBotName] = useState("");
  const [selectedModel, setSelectedModel] = useState("default");
  const [paperTrading, setPaperTrading] = useState(true);
  const [riskLevel, setRiskLevel] = useState(30);
  const [initialCapital, setInitialCapital] = useState(10000);
  const [maxDrawdown, setMaxDrawdown] = useState(15);
  const [autoRebalance, setAutoRebalance] = useState(false);
  const [performance, setPerformance] = useState({ 
    profit: 0, 
    trades: 0, 
    winRate: 0, 
    drawdown: 0 
  });
  
  // Dummy strategy presets
  const strategyPresets: AITradingStrategy[] = [
    {
      id: "trend-1",
      name: "Trend Follower",
      description: "Follows market momentum using moving averages",
      type: "trend-following",
      timeframe: "1d",
      riskLevel: "medium",
      parameters: {
        lookbackPeriod: 14,
        stopLoss: 5,
        takeProfit: 15,
        capitalAllocation: 25
      }
    },
    {
      id: "mean-1",
      name: "Mean Reversion",
      description: "Trades price reversals to the mean",
      type: "mean-reversion",
      timeframe: "4h",
      riskLevel: "high",
      parameters: {
        lookbackPeriod: 20,
        stopLoss: 3,
        takeProfit: 10,
        capitalAllocation: 15
      }
    },
    {
      id: "breakout-1",
      name: "Breakout Hunter",
      description: "Catches high momentum breakouts from consolidation",
      type: "breakout",
      timeframe: "1h",
      riskLevel: "high",
      parameters: {
        lookbackPeriod: 24,
        stopLoss: 7,
        takeProfit: 20,
        capitalAllocation: 10
      }
    }
  ];
  
  useEffect(() => {
    // Simulate performance updates
    const intervalId = setInterval(() => {
      setPerformance(prev => ({
        profit: prev.profit + (Math.random() * 100 - 50),
        trades: prev.trades + 1,
        winRate: Math.min(100, prev.winRate + Math.random() * 5 - 2),
        drawdown: Math.max(0, prev.drawdown - Math.random() * 3)
      }));
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleStartBot = () => {
    if (!selectedStrategy) {
      toast({
        title: "Strategy Required",
        description: "Please select a trading strategy before starting the bot",
        variant: "destructive"
      });
      return;
    }
    
    if (!botName) {
      toast({
        title: "Bot Name Required",
        description: "Please give your bot a name",
        variant: "destructive"
      });
      return;
    }
    
    // Start the bot logic would go here
    setIsRunning(true);
    setIsConfiguring(false);
    toast({
      title: "Bot Started",
      description: `${botName} is now running with ${selectedStrategy.name} strategy`,
    });
  };
  
  const handleStopBot = () => {
    setIsRunning(false);
    toast({
      title: "Bot Stopped",
      description: `${botName} has been stopped`,
    });
  };
  
  const handleDeleteBot = () => {
    setActiveBot(null);
    setIsRunning(false);
    setIsConfiguring(false);
    toast({
      title: "Bot Deleted",
      description: `${botName} has been deleted`,
    });
    setBotName("");
  };
  
  const handleConfigureNew = () => {
    setIsConfiguring(true);
    setActiveBot(null);
    setIsRunning(false);
    setBotName("");
    setSelectedStrategy(null);
    setRiskLevel(30);
    setInitialCapital(10000);
    setMaxDrawdown(15);
    setAutoRebalance(false);
    toast({
      title: "Configure New Bot",
      description: "Please set up your new trading bot",
    });
  };
  
  const handleSaveConfig = () => {
    if (!selectedStrategy) {
      toast({
        title: "Strategy Required",
        description: "Please select a trading strategy",
        variant: "destructive"
      });
      return;
    }
    
    if (!botName) {
      toast({
        title: "Bot Name Required",
        description: "Please name your bot",
        variant: "destructive"
      });
      return;
    }
    
    // Save configuration logic would go here
    toast({
      title: "Configuration Saved",
      description: `${botName} has been configured with ${selectedStrategy.name}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Trading Bots</CardTitle>
        <CardDescription>Manage and monitor your automated trading bots</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue={activeBot ? "monitor" : "configure"} className="w-full">
          <TabsList>
            {!isConfiguring && (
              <TabsTrigger value="configure" onClick={() => handleConfigureNew()}>
                <Settings className="h-4 w-4 mr-2" />
                Configure New
              </TabsTrigger>
            )}
            {activeBot && (
              <TabsTrigger value="monitor">
                <BarChart2 className="h-4 w-4 mr-2" />
                Monitor Bot
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="configure" className="space-y-4">
            <h3 className="text-lg font-semibold">Bot Configuration</h3>
            
            <div className="space-y-2">
              <Label htmlFor="bot-name">Bot Name</Label>
              <Input 
                type="text" 
                id="bot-name" 
                placeholder="Enter bot name" 
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="strategy">Trading Strategy</Label>
              <Select 
                id="strategy"
                onValueChange={(value) => {
                  const strategy = strategyPresets.find(s => s.id === value);
                  setSelectedStrategy(strategy || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a strategy" />
                </SelectTrigger>
                <SelectContent>
                  {strategyPresets.map((strategy) => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <Select id="model" defaultValue={selectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select AI Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Model</SelectItem>
                  <SelectItem value="advanced">Advanced Model</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Risk Level</Label>
              <Slider
                defaultValue={[riskLevel]}
                max={100}
                step={10}
                onValueChange={(value) => setRiskLevel(value[0])}
              />
              <p className="text-sm text-muted-foreground">
                Adjust the risk tolerance of the bot.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Initial Capital</Label>
              <Input 
                type="number" 
                placeholder="Enter initial capital" 
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Max Drawdown (%)</Label>
              <Slider
                defaultValue={[maxDrawdown]}
                max={50}
                step={5}
                onValueChange={(value) => setMaxDrawdown(value[0])}
              />
              <p className="text-sm text-muted-foreground">
                Maximum percentage drawdown before the bot stops trading.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="paper-trading" checked={paperTrading} onCheckedChange={setPaperTrading} />
              <Label htmlFor="paper-trading">Paper Trading</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="auto-rebalance" checked={autoRebalance} onCheckedChange={setAutoRebalance} />
              <Label htmlFor="auto-rebalance">Auto Rebalance</Label>
            </div>
            
            <Button onClick={handleSaveConfig}>Save Configuration</Button>
          </TabsContent>
          
          <TabsContent value="monitor" className="space-y-4">
            <h3 className="text-lg font-semibold">Bot Monitoring</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                  <CardDescription>Real-time performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Profit</span>
                    <span>${performance.profit.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Trades</span>
                    <span>{performance.trades}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Win Rate</span>
                    <span>{performance.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Drawdown</span>
                    <span>{performance.drawdown.toFixed(2)}%</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Risk Metrics</CardTitle>
                  <CardDescription>Risk assessment and management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Risk Level</span>
                    <span>
                      <Badge variant="secondary">{riskLevel}</Badge>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Max Drawdown</span>
                    <span>{maxDrawdown}%</span>
                  </div>
                  <Progress value={performance.drawdown} max={maxDrawdown} />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Strategy Details</h4>
              <p className="text-sm text-muted-foreground">
                {selectedStrategy?.description}
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{selectedStrategy?.type}</Badge>
                <Badge variant="outline">{selectedStrategy?.timeframe}</Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {isRunning ? (
          <Button variant="destructive" onClick={handleStopBot}>
            <Pause className="h-4 w-4 mr-2" />
            Stop Bot
          </Button>
        ) : (
          <Button onClick={handleStartBot}>
            <Play className="h-4 w-4 mr-2" />
            Start Bot
          </Button>
        )}
        <Button variant="outline" onClick={handleDeleteBot}>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Delete Bot
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AiTradingDashboard;
