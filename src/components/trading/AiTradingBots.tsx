
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, CheckCircle, PlayCircle, Pause, Settings, BarChartHorizontal, TrendingUp, Brain, ArrowUpDown, ChevronRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { AITradingStrategy } from "@/types/trading";
import AiTradingDetailedDashboard from "./AiTradingDetailedDashboard";

const AiTradingBots: React.FC = () => {
  const [strategies, setStrategies] = useState<AITradingStrategy[]>([
    {
      id: "trend-following-ai",
      name: "AI Trend Following",
      description: "Uses machine learning to identify and follow market trends",
      type: "trend-following",
      timeframe: "1d",
      parameters: {
        riskLevel: "medium",
        backtestResults: {
          winRate: 0.68,
          profitFactor: 1.85,
          sharpeRatio: 1.42,
          drawdown: 15,
          returns: 45
        }
      },
      performance: {
        winRate: 0.68,
        profitFactor: 1.85,
        trades: 124,
        profitLoss: 18.5,
        drawdown: 12.3
      }
    },
    {
      id: "mean-reversion-ai",
      name: "AI Mean Reversion",
      description: "Identifies overbought and oversold conditions using AI",
      type: "mean-reversion",
      timeframe: "4h",
      parameters: {
        riskLevel: "medium",
        backtestResults: {
          winRate: 0.72,
          profitFactor: 1.95,
          sharpeRatio: 1.65,
          drawdown: 12,
          returns: 52
        }
      },
      performance: {
        winRate: 0.72,
        profitFactor: 1.95,
        trades: 95,
        profitLoss: 24.5,
        drawdown: 8.7
      }
    },
    {
      id: "sentiment-analysis",
      name: "AI Sentiment Trading",
      description: "Analyzes market sentiment using NLP",
      type: "custom",
      timeframe: "1d",
      parameters: {
        strategyType: "sentiment",
        riskLevel: "high",
        backtestResults: {
          winRate: 0.65,
          profitFactor: 2.1,
          sharpeRatio: 1.38,
          drawdown: 22,
          returns: 75
        }
      },
      performance: {
        winRate: 0.65,
        profitFactor: 2.1,
        trades: 78,
        profitLoss: 32.8,
        drawdown: 18.2
      }
    }
  ]);
  
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [runningBots, setRunningBots] = useState<string[]>([]);
  const [isAddingStrategy, setIsAddingStrategy] = useState(false);
  const [newStrategy, setNewStrategy] = useState<Partial<AITradingStrategy>>({
    name: "",
    description: "",
    type: "trend-following",
    timeframe: "1d",
    parameters: {
      riskLevel: "medium"
    }
  });
  const [showDetailedDashboard, setShowDetailedDashboard] = useState(false);
  
  const handleDeleteStrategy = (id: string) => {
    setStrategies(strategies.filter(strategy => strategy.id !== id));
    toast({
      title: "Strategy Deleted",
      description: "The AI trading strategy has been removed."
    });
  };
  
  const handleStartBot = (id: string) => {
    if (runningBots.includes(id)) {
      setRunningBots(runningBots.filter(botId => botId !== id));
      toast({
        title: "Bot Stopped",
        description: `${strategies.find(s => s.id === id)?.name} has been stopped`
      });
    } else {
      setRunningBots([...runningBots, id]);
      setSelectedBotId(id);
      toast({
        title: "Bot Started",
        description: `${strategies.find(s => s.id === id)?.name} is now running`
      });
    }
  };
  
  const handleAddStrategy = () => {
    if (!newStrategy.name) {
      toast({
        title: "Error",
        description: "Strategy name is required",
        variant: "destructive"
      });
      return;
    }
    
    const newStrategyWithId: AITradingStrategy = {
      id: `strategy-${Date.now()}`,
      name: newStrategy.name,
      description: newStrategy.description || "",
      type: newStrategy.type || "trend-following",
      timeframe: newStrategy.timeframe || "1d",
      parameters: newStrategy.parameters || { riskLevel: "medium" },
      creator: "user",
      tags: ["custom"]
    };
    
    setStrategies([...strategies, newStrategyWithId]);
    setIsAddingStrategy(false);
    setNewStrategy({
      name: "",
      description: "",
      type: "trend-following",
      timeframe: "1d",
      parameters: {
        riskLevel: "medium"
      }
    });
    
    toast({
      title: "Strategy Added",
      description: "Your custom AI trading strategy has been created."
    });
  };
  
  const renderStrategyTypeIcon = (type: string) => {
    switch (type) {
      case "trend-following":
        return <TrendingUp className="h-4 w-4" />;
      case "mean-reversion":
        return <ArrowUpDown className="h-4 w-4" />;
      case "breakout":
        return <BarChartHorizontal className="h-4 w-4" />;
      case "sentiment":
      case "custom":
      default:
        return <Brain className="h-4 w-4" />;
    }
  };
  
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-500/20 text-green-600 border-green-500/20";
      case "medium":
        return "bg-amber-500/20 text-amber-600 border-amber-500/20";
      case "high":
        return "bg-red-500/20 text-red-600 border-red-500/20";
      default:
        return "bg-blue-500/20 text-blue-600 border-blue-500/20";
    }
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-xl">AI Trading Bots</CardTitle>
              <CardDescription>
                Create and manage automated trading strategies
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowDetailedDashboard(!showDetailedDashboard)}>
                {showDetailedDashboard ? "Hide Detailed Dashboard" : "Show Detailed Dashboard"}
              </Button>
              <Button onClick={() => setIsAddingStrategy(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Strategy
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {showDetailedDashboard && (
          <div className="px-6 pb-4">
            <AiTradingDetailedDashboard />
          </div>
        )}
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.map(strategy => (
              <Card key={strategy.id} className="border overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded-md">
                        {renderStrategyTypeIcon(strategy.type)}
                      </div>
                      <div>
                        <CardTitle className="text-base">{strategy.name}</CardTitle>
                        <CardDescription className="text-xs truncate max-w-[200px]">
                          {strategy.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getRiskColor((strategy.parameters?.riskLevel as string) || "medium")}
                    >
                      {strategy.parameters?.riskLevel || "medium"} risk
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                      <div className="font-bold text-sm">
                        {strategy.performance?.winRate ? `${(strategy.performance.winRate * 100).toFixed(1)}%` : 'N/A'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">P/L</div>
                      <div className="font-bold text-sm text-green-500">
                        {strategy.performance?.profitLoss ? `+${strategy.performance.profitLoss.toFixed(1)}%` : 'N/A'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Timeframe</div>
                      <div className="font-bold text-sm">
                        {strategy.timeframe}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-xs text-muted-foreground mb-1">Strategy Type</div>
                    <div className="text-sm flex items-center gap-1">
                      {renderStrategyTypeIcon(strategy.type)}
                      <span className="capitalize">{strategy.type.replace("-", " ")}</span>
                    </div>
                  </div>
                  
                  {strategy.tags && strategy.tags.length > 0 && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1">
                        {strategy.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="bg-muted/20 p-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs" 
                    onClick={() => setSelectedBotId(strategy.id)}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Settings
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleDeleteStrategy(strategy.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                    
                    <Button
                      size="sm"
                      className="text-xs"
                      variant={runningBots.includes(strategy.id) ? "destructive" : "default"}
                      onClick={() => handleStartBot(strategy.id)}
                    >
                      {runningBots.includes(strategy.id) ? (
                        <>
                          <Pause className="h-3 w-3 mr-1" />
                          Stop
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-3 w-3 mr-1" />
                          Start
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="border-t p-4">
          <div className="w-full flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {strategies.length} strategies available
            </div>
            
            <div className="text-sm">
              {runningBots.length} bots running
            </div>
          </div>
        </CardFooter>
      </Card>
      
      <Dialog open={isAddingStrategy} onOpenChange={setIsAddingStrategy}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create AI Trading Strategy</DialogTitle>
            <DialogDescription>
              Set up a new AI-powered trading strategy
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Strategy Name</Label>
              <Input
                id="name"
                placeholder="e.g., Dual MA Crossover with ML"
                value={newStrategy.name}
                onChange={(e) => setNewStrategy({ ...newStrategy, name: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Describe how this strategy works"
                value={newStrategy.description || ""}
                onChange={(e) => setNewStrategy({ ...newStrategy, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Strategy Type</Label>
                <Select
                  value={newStrategy.type}
                  onValueChange={(value) => setNewStrategy({ ...newStrategy, type: value as AITradingStrategy["type"] })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trend-following">Trend Following</SelectItem>
                    <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                    <SelectItem value="breakout">Breakout</SelectItem>
                    <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select
                  value={newStrategy.timeframe}
                  onValueChange={(value) => setNewStrategy({ ...newStrategy, timeframe: value })}
                >
                  <SelectTrigger id="timeframe">
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
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="risk">Risk Level</Label>
              <Select
                value={(newStrategy.parameters?.riskLevel as string) || "medium"}
                onValueChange={(value) => setNewStrategy({ 
                  ...newStrategy, 
                  parameters: { ...newStrategy.parameters, riskLevel: value } 
                })}
              >
                <SelectTrigger id="risk">
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
            <Button variant="outline" onClick={() => setIsAddingStrategy(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStrategy}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Create Strategy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!selectedBotId} onOpenChange={(open) => !open && setSelectedBotId(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Bot Settings: {strategies.find(s => s.id === selectedBotId)?.name}
            </DialogTitle>
            <DialogDescription>
              Configure your AI trading bot parameters
            </DialogDescription>
          </DialogHeader>
          
          {selectedBotId && (
            <Tabs defaultValue="general">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <div className="space-y-4 py-4">
                  <div className="grid gap-2">
                    <Label>Strategy Name</Label>
                    <Input value={strategies.find(s => s.id === selectedBotId)?.name} readOnly />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Strategy Type</Label>
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/20">
                      {renderStrategyTypeIcon(strategies.find(s => s.id === selectedBotId)?.type || "")}
                      <span className="capitalize">
                        {(strategies.find(s => s.id === selectedBotId)?.type || "").replace("-", " ")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Risk Level</Label>
                    <Select defaultValue={(strategies.find(s => s.id === selectedBotId)?.parameters?.riskLevel as string) || "medium"}>
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
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-restart" />
                    <Label htmlFor="auto-restart">Auto restart on errors</Label>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="parameters">
                <ScrollArea className="h-[300px] py-4">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Maximum Position Size (%)</Label>
                      <Input type="number" defaultValue={25} />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Stop Loss (%)</Label>
                      <Input type="number" defaultValue={5} />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Take Profit (%)</Label>
                      <Input type="number" defaultValue={15} />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="trailing-stop" defaultChecked />
                      <Label htmlFor="trailing-stop">Enable Trailing Stop</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-adjust" defaultChecked />
                      <Label htmlFor="auto-adjust">Auto-adjust parameters based on market conditions</Label>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="grid gap-2">
                      <Label>Trading Hours</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">24/7 Trading</SelectItem>
                          <SelectItem value="market">Market Hours Only</SelectItem>
                          <SelectItem value="custom">Custom Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Maximum Daily Trades</Label>
                      <Input type="number" defaultValue={10} />
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="advanced">
                <ScrollArea className="h-[300px] py-4">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>AI Model Type</Label>
                      <Select defaultValue="transformer">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transformer">Transformer Model</SelectItem>
                          <SelectItem value="lstm">LSTM</SelectItem>
                          <SelectItem value="cnn">CNN</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Feature Importance</Label>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Price Action</span>
                          <span className="text-sm font-medium">70%</span>
                        </div>
                        <div className="bg-muted h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full w-[70%]" />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Volume</span>
                          <span className="text-sm font-medium">20%</span>
                        </div>
                        <div className="bg-muted h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full w-[20%]" />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Sentiment</span>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                        <div className="bg-muted h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full w-[10%]" />
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="grid gap-2">
                      <Label>Custom API Endpoint</Label>
                      <Input placeholder="https://api.example.com/model" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Update Frequency (seconds)</Label>
                      <Input type="number" defaultValue={60} />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="log-debug" />
                      <Label htmlFor="log-debug">Enable debug logging</Label>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBotId(null)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setSelectedBotId(null);
              toast({
                title: "Settings Saved",
                description: "Your bot settings have been updated"
              });
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AiTradingBots;
