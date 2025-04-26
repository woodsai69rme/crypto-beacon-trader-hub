
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Play, Pause, Settings, Info, ChartLine, BarChart } from "lucide-react";

interface BotStrategy {
  id: string;
  name: string;
  description: string;
  risk: "low" | "medium" | "high";
  performance: number;
  active: boolean;
  exchange: string;
  pair: string;
  timeframe: string;
  settings: {
    takeProfit: number;
    stopLoss: number;
    tradeSize: number;
    maxTrades: number;
  };
}

const AiTradingBots = () => {
  const [strategies, setStrategies] = useState<BotStrategy[]>([
    {
      id: "bot1",
      name: "Momentum AI",
      description: "AI-powered momentum trading strategy that identifies and capitalizes on market trends",
      risk: "medium",
      performance: 12.4,
      active: false,
      exchange: "binance",
      pair: "BTC/USDT",
      timeframe: "1h",
      settings: {
        takeProfit: 2.5,
        stopLoss: 1.5,
        tradeSize: 10,
        maxTrades: 5,
      }
    },
    {
      id: "bot2",
      name: "Volatility Harvester",
      description: "Captures profits from short-term price volatility using machine learning predictions",
      risk: "high",
      performance: 18.7,
      active: false,
      exchange: "coinbase",
      pair: "ETH/USD",
      timeframe: "4h",
      settings: {
        takeProfit: 3.5,
        stopLoss: 2.5,
        tradeSize: 15,
        maxTrades: 3,
      }
    },
    {
      id: "bot3",
      name: "Conservative DCA",
      description: "AI-optimized dollar cost averaging with smart entry points",
      risk: "low",
      performance: 7.2,
      active: true,
      exchange: "kraken",
      pair: "SOL/USD",
      timeframe: "1d",
      settings: {
        takeProfit: 5.0,
        stopLoss: 3.0,
        tradeSize: 5,
        maxTrades: 10,
      }
    }
  ]);
  
  const [editingStrategy, setEditingStrategy] = useState<BotStrategy | null>(null);
  const [currentTab, setCurrentTab] = useState("active");
  
  const handleToggleActive = (id: string) => {
    setStrategies(strategies.map(strategy => {
      if (strategy.id === id) {
        const newStatus = !strategy.active;
        
        toast({
          title: `Strategy ${newStatus ? "Activated" : "Deactivated"}`,
          description: `${strategy.name} has been ${newStatus ? "activated" : "paused"}`,
        });
        
        return { ...strategy, active: newStatus };
      }
      return strategy;
    }));
  };
  
  const handleEditStrategy = (strategy: BotStrategy) => {
    setEditingStrategy({...strategy});
  };
  
  const handleSaveStrategy = () => {
    if (editingStrategy) {
      setStrategies(strategies.map(s => 
        s.id === editingStrategy.id ? editingStrategy : s
      ));
      
      toast({
        title: "Strategy Updated",
        description: `${editingStrategy.name} settings have been updated`,
      });
      
      setEditingStrategy(null);
    }
  };
  
  const handleBacktest = (id: string) => {
    const strategy = strategies.find(s => s.id === id);
    
    if (strategy) {
      toast({
        title: "Backtesting Started",
        description: `Backtesting ${strategy.name} on ${strategy.pair}, this may take a few minutes`,
      });
      
      // In a real application, this would call an API to run a backtest
      setTimeout(() => {
        toast({
          title: "Backtesting Complete",
          description: `${strategy.name} showed 14.2% profit in backtest period`,
        });
      }, 3000);
    }
  };
  
  const getRiskColor = (risk: "low" | "medium" | "high") => {
    switch (risk) {
      case "low": return "bg-green-500/10 text-green-500";
      case "medium": return "bg-yellow-500/10 text-yellow-500";
      case "high": return "bg-red-500/10 text-red-500";
      default: return "";
    }
  };
  
  const filteredStrategies = strategies.filter(s => 
    currentTab === "active" ? s.active : 
    currentTab === "inactive" ? !s.active : 
    true
  );
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>AI Trading Bots</CardTitle>
            <CardDescription>Automated trading strategies powered by AI</CardDescription>
          </div>
          <Button>
            Create New Strategy
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        
          <TabsContent value={currentTab}>
            {filteredStrategies.length > 0 ? (
              <div className="space-y-4">
                {filteredStrategies.map((strategy) => (
                  <Card key={strategy.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{strategy.name}</CardTitle>
                          <Badge variant="outline" className={getRiskColor(strategy.risk)}>
                            {strategy.risk.toUpperCase()} RISK
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={strategy.performance >= 0 ? "text-green-500" : "text-red-500"}>
                            {strategy.performance >= 0 ? "+" : ""}{strategy.performance}%
                          </span>
                          <Switch 
                            checked={strategy.active} 
                            onCheckedChange={() => handleToggleActive(strategy.id)} 
                          />
                        </div>
                      </div>
                      <CardDescription>{strategy.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Exchange</div>
                          <div className="font-medium">{strategy.exchange.toUpperCase()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Trading Pair</div>
                          <div className="font-medium">{strategy.pair}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Timeframe</div>
                          <div className="font-medium">{strategy.timeframe}</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 flex justify-end gap-2 pt-2 px-6">
                      <Button variant="outline" size="sm" onClick={() => handleBacktest(strategy.id)}>
                        <BarChart className="h-4 w-4 mr-2" />
                        Backtest
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditStrategy(strategy)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No {currentTab} strategies found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Strategy Editor Dialog would be here in a full implementation */}
        {editingStrategy && (
          <Card className="mt-6 border-2 border-primary/50">
            <CardHeader>
              <CardTitle>Edit Strategy: {editingStrategy.name}</CardTitle>
              <CardDescription>Customize your trading bot parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exchange">Exchange</Label>
                    <Select 
                      value={editingStrategy.exchange} 
                      onValueChange={(value) => setEditingStrategy({...editingStrategy, exchange: value})}
                    >
                      <SelectTrigger id="exchange">
                        <SelectValue placeholder="Select exchange" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="binance">Binance</SelectItem>
                        <SelectItem value="coinbase">Coinbase</SelectItem>
                        <SelectItem value="kraken">Kraken</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pair">Trading Pair</Label>
                    <Select 
                      value={editingStrategy.pair} 
                      onValueChange={(value) => setEditingStrategy({...editingStrategy, pair: value})}
                    >
                      <SelectTrigger id="pair">
                        <SelectValue placeholder="Select pair" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                        <SelectItem value="ETH/USD">ETH/USD</SelectItem>
                        <SelectItem value="SOL/USD">SOL/USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tp">Take Profit (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="tp"
                      min={0.5}
                      max={10}
                      step={0.5}
                      value={[editingStrategy.settings.takeProfit]}
                      onValueChange={(values) => setEditingStrategy({
                        ...editingStrategy, 
                        settings: {...editingStrategy.settings, takeProfit: values[0]}
                      })}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{editingStrategy.settings.takeProfit}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sl">Stop Loss (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="sl"
                      min={0.5}
                      max={10}
                      step={0.5}
                      value={[editingStrategy.settings.stopLoss]}
                      onValueChange={(values) => setEditingStrategy({
                        ...editingStrategy, 
                        settings: {...editingStrategy.settings, stopLoss: values[0]}
                      })}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{editingStrategy.settings.stopLoss}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tradeSize">Trade Size (% of portfolio)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="tradeSize"
                      min={1}
                      max={50}
                      step={1}
                      value={[editingStrategy.settings.tradeSize]}
                      onValueChange={(values) => setEditingStrategy({
                        ...editingStrategy, 
                        settings: {...editingStrategy.settings, tradeSize: values[0]}
                      })}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{editingStrategy.settings.tradeSize}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxTrades">Max Concurrent Trades</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="maxTrades"
                      min={1}
                      max={20}
                      step={1}
                      value={[editingStrategy.settings.maxTrades]}
                      onValueChange={(values) => setEditingStrategy({
                        ...editingStrategy, 
                        settings: {...editingStrategy.settings, maxTrades: values[0]}
                      })}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{editingStrategy.settings.maxTrades}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingStrategy(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveStrategy}>
                Save Strategy
              </Button>
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default AiTradingBots;
