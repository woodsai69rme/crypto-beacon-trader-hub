
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip, 
  ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import { toast } from "@/hooks/use-toast";
import { AITradingStrategy } from '@/types/trading';

// Simulated data
const mockPriceData = [
  { date: "Jan", price: 35000, prediction: 34500 },
  { date: "Feb", price: 37500, prediction: 38000 },
  { date: "Mar", price: 42000, prediction: 41000 },
  { date: "Apr", price: 41000, prediction: 42500 },
  { date: "May", price: 38000, prediction: 37000 },
  { date: "Jun", price: 34500, prediction: 35000 },
  { date: "Jul", price: 39000, prediction: 40000 },
];

// Bot performance metrics
const botPerformance = {
  winRate: 68,
  profitFactor: 2.3,
  sharpeRatio: 1.7,
  maxDrawdown: 12.5,
  totalTrades: 87,
  profitableTrades: 59,
  avgTradeLength: "3.2 days",
  bestTrade: "+8.4%",
  worstTrade: "-3.7%",
  netProfit: "+27.3%"
};

// Trading strategies
const tradingStrategies: AITradingStrategy[] = [
  {
    id: "trend-following",
    name: "Trend Following",
    description: "Follows market momentum using moving averages",
    type: "trend-following",
    timeframe: "1d",
    riskLevel: "medium",
    parameters: {
      fastMA: 8,
      slowMA: 21,
      stopLoss: 5,
      takeProfit: 15,
      tradeSize: 10
    }
  },
  {
    id: "mean-reversion",
    name: "Mean Reversion",
    description: "Trades price reversals to the mean",
    type: "mean-reversion",
    timeframe: "4h",
    riskLevel: "high",
    parameters: {
      rsiPeriod: 14,
      rsiOverbought: 70,
      rsiOversold: 30,
      stopLoss: 3,
      takeProfit: 7,
      tradeSize: 5
    }
  },
  {
    id: "breakout",
    name: "Breakout Trading",
    description: "Catches price breakouts from consolidation",
    type: "breakout",
    timeframe: "1h",
    riskLevel: "high",
    parameters: {
      channelPeriod: 20,
      volatilityThreshold: 2.5,
      stopLoss: 5,
      takeProfit: 15,
      tradeSize: 7
    }
  }
];

const AiTradingDashboard: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>("trend-following");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [paperTrading, setPaperTrading] = useState<boolean>(true);
  const [riskLevel, setRiskLevel] = useState<number>(50);
  
  const [parameters, setParameters] = useState<Record<string, any> | null>(null);
  const [currentStrategy, setCurrentStrategy] = useState<AITradingStrategy | null>(null);
  
  // Update parameters when strategy changes
  useEffect(() => {
    const strategy = tradingStrategies.find(s => s.id === selectedStrategy);
    if (strategy) {
      setCurrentStrategy(strategy);
      setParameters(strategy.parameters);
    }
  }, [selectedStrategy]);
  
  const handleStartBot = () => {
    if (isRunning) {
      setIsRunning(false);
      toast({
        title: "Bot Stopped",
        description: "Trading bot has been stopped",
      });
    } else {
      setIsRunning(true);
      toast({
        title: "Bot Started",
        description: `Started ${currentStrategy?.name} in ${paperTrading ? "paper" : "live"} trading mode`,
      });
    }
  };
  
  const handleReset = () => {
    if (currentStrategy?.parameters) {
      setParameters(currentStrategy.parameters);
      toast({
        title: "Parameters Reset",
        description: "Strategy parameters have been reset to defaults",
      });
    }
  };
  
  const handleOptimize = () => {
    toast({
      title: "Optimizing Strategy",
      description: "Running strategy optimization...",
    });
    
    // Simulate optimization delay
    setTimeout(() => {
      const optimizedParams = { ...parameters };
      
      // Simulate parameter changes
      Object.keys(optimizedParams).forEach(key => {
        if (typeof optimizedParams[key] === 'number') {
          optimizedParams[key] = Math.round(optimizedParams[key] * (0.9 + Math.random() * 0.3));
        }
      });
      
      setParameters(optimizedParams);
      
      toast({
        title: "Optimization Complete",
        description: "Strategy parameters have been optimized based on historical data",
      });
    }, 3000);
  };
  
  const handleBacktest = () => {
    toast({
      title: "Running Backtest",
      description: "Backtesting strategy on historical data...",
    });
    
    // Simulate backtest delay
    setTimeout(() => {
      toast({
        title: "Backtest Complete",
        description: `Strategy would have yielded +${Math.floor(15 + Math.random() * 20)}% return over the last 6 months`,
      });
    }, 3000);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Trading Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Strategy selector and controls */}
              <div className="space-y-4 flex-1">
                <div>
                  <Label>Trading Strategy</Label>
                  <Select 
                    value={selectedStrategy} 
                    onValueChange={(value) => setSelectedStrategy(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      {tradingStrategies.map(strategy => (
                        <SelectItem key={strategy.id} value={strategy.id}>
                          {strategy.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentStrategy?.description}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Label>Trading Mode:</Label>
                  <Select
                    value={paperTrading ? "paper" : "live"}
                    onValueChange={(value) => setPaperTrading(value === "paper")}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paper">Paper</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Risk Level: {riskLevel}%</Label>
                  </div>
                  <Slider
                    value={[riskLevel]}
                    min={10}
                    max={90}
                    step={10}
                    onValueChange={(value) => setRiskLevel(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Conservative</span>
                    <span>Aggressive</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1"
                    variant={isRunning ? "destructive" : "default"}
                    onClick={handleStartBot}
                  >
                    {isRunning ? "Stop Bot" : "Start Bot"}
                  </Button>
                  <Button variant="outline" onClick={handleBacktest}>
                    Backtest
                  </Button>
                  <Button variant="outline" onClick={handleOptimize}>
                    Optimize
                  </Button>
                </div>
              </div>
              
              {/* Chart */}
              <div className="flex-1 h-64">
                <h3 className="text-sm font-medium mb-2">Price Prediction</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockPriceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                        border: 'none', 
                        borderRadius: '6px',
                        color: '#fff'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      name="Actual"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="prediction" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      dot={{ r: 4 }}
                      name="Prediction"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Parameters */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Strategy Parameters</h3>
                <Button size="sm" variant="ghost" onClick={handleReset}>
                  Reset
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parameters && Object.entries(parameters).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                    <Input 
                      id={key}
                      type="number" 
                      value={value as number}
                      onChange={(e) => {
                        setParameters({
                          ...parameters,
                          [key]: parseFloat(e.target.value)
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary">
            <TabsList className="mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="trades">Trades</TabsTrigger>
              <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Win Rate</div>
                  <div className="text-lg font-semibold">{botPerformance.winRate}%</div>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Profit Factor</div>
                  <div className="text-lg font-semibold">{botPerformance.profitFactor}</div>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                  <div className="text-lg font-semibold">{botPerformance.sharpeRatio}</div>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Max Drawdown</div>
                  <div className="text-lg font-semibold">{botPerformance.maxDrawdown}%</div>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Total Trades</div>
                  <div className="text-lg font-semibold">{botPerformance.totalTrades}</div>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Profitable</div>
                  <div className="text-lg font-semibold">{botPerformance.profitableTrades}</div>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Best Trade</div>
                  <div className="text-lg font-semibold text-green-500">{botPerformance.bestTrade}</div>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Net Profit</div>
                  <div className="text-lg font-semibold text-green-500">{botPerformance.netProfit}</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="trades">
              <div className="text-center py-8 text-muted-foreground">
                No trade history available. Start the bot to generate trades.
              </div>
            </TabsContent>
            
            <TabsContent value="risk">
              <div className="text-center py-8 text-muted-foreground">
                Risk analysis will be available after the bot has completed several trades.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiTradingDashboard;
