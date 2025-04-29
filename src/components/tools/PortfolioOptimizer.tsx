
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { PieChart, BarChart2, ArrowRight } from "lucide-react";
import { PieChart as ReChartPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const PortfolioOptimizer = () => {
  const [riskLevel, setRiskLevel] = useState(50);
  const [includeCrypto, setIncludeCrypto] = useState(true);
  const [includeStocks, setIncludeStocks] = useState(true);
  const [includeCommodities, setIncludeCommodities] = useState(false);
  const [investment, setInvestment] = useState(10000);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  
  // Initial portfolio allocation
  const [allocation, setAllocation] = useState([
    { id: "BTC", name: "BTC", value: 30, color: "#f7931a" },
    { id: "ETH", name: "ETH", value: 20, color: "#627eea" },
    { id: "AAPL", name: "AAPL", value: 15, color: "#999999" },
    { id: "AMZN", name: "AMZN", value: 15, color: "#ff9900" },
    { id: "MSFT", name: "MSFT", value: 10, color: "#7cbb00" },
    { id: "GOOGL", name: "GOOGL", value: 10, color: "#4285f4" },
  ]);
  
  // Optimized portfolio allocation
  const [optimizedAllocation, setOptimizedAllocation] = useState([
    { id: "BTC", name: "BTC", value: 25, color: "#f7931a" },
    { id: "ETH", name: "ETH", value: 15, color: "#627eea" },
    { id: "SOL", name: "SOL", value: 10, color: "#00ffbd" },
    { id: "AAPL", name: "AAPL", value: 12, color: "#999999" },
    { id: "AMZN", name: "AMZN", value: 8, color: "#ff9900" },
    { id: "MSFT", name: "MSFT", value: 10, color: "#7cbb00" },
    { id: "GOOGL", name: "GOOGL", value: 10, color: "#4285f4" },
    { id: "GOLD", name: "GOLD", value: 10, color: "#ffd700" },
  ]);
  
  // Key metrics
  const [metrics, setMetrics] = useState({
    currentExpectedReturn: 14.2,
    currentRisk: 28.6,
    currentSharpeRatio: 0.46,
    optimizedExpectedReturn: 16.5,
    optimizedRisk: 22.3,
    optimizedSharpeRatio: 0.71,
  });
  
  const handleOptimize = () => {
    setIsOptimizing(true);
    
    // Simulate optimization delay
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationComplete(true);
      
      // Adjust optimization based on risk preference
      const newOptimized = [...optimizedAllocation];
      
      if (riskLevel > 70) {
        // Higher risk - more crypto
        newOptimized[0].value = 35; // BTC
        newOptimized[1].value = 20; // ETH
        newOptimized[2].value = 15; // SOL
        newOptimized[7].value = 0;  // GOLD
        
        setMetrics({
          ...metrics,
          optimizedExpectedReturn: 19.8,
          optimizedRisk: 32.4,
          optimizedSharpeRatio: 0.59,
        });
      } else if (riskLevel < 30) {
        // Lower risk - more stable assets
        newOptimized[0].value = 15; // BTC
        newOptimized[1].value = 10; // ETH
        newOptimized[2].value = 5;  // SOL
        newOptimized[7].value = 20; // GOLD
        
        setMetrics({
          ...metrics,
          optimizedExpectedReturn: 12.3,
          optimizedRisk: 14.8,
          optimizedSharpeRatio: 0.78,
        });
      }
      
      setOptimizedAllocation(newOptimized);
    }, 1500);
  };
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 shadow-md rounded-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="shadow-lg border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-primary" />
          Portfolio Optimizer
        </CardTitle>
        <CardDescription>
          Optimize your portfolio allocation for maximum returns at your preferred risk level
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="investment">Investment Amount</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-muted-foreground">$</span>
                </div>
                <Input
                  id="investment"
                  type="number"
                  className="pl-7"
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
                <span className="text-sm">
                  {riskLevel < 30
                    ? "Conservative"
                    : riskLevel < 70
                    ? "Moderate"
                    : "Aggressive"}
                </span>
              </div>
              <Slider
                id="risk-tolerance"
                defaultValue={[riskLevel]}
                max={100}
                step={1}
                onValueChange={(vals) => setRiskLevel(vals[0])}
              />
            </div>
            
            <div className="space-y-3 pt-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="include-crypto">Include Cryptocurrencies</Label>
                <Switch
                  id="include-crypto"
                  checked={includeCrypto}
                  onCheckedChange={setIncludeCrypto}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="include-stocks">Include Stocks/ETFs</Label>
                <Switch
                  id="include-stocks"
                  checked={includeStocks}
                  onCheckedChange={setIncludeStocks}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="include-commodities">Include Commodities</Label>
                <Switch
                  id="include-commodities"
                  checked={includeCommodities}
                  onCheckedChange={setIncludeCommodities}
                />
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleOptimize} 
              disabled={isOptimizing}
            >
              {isOptimizing ? "Optimizing..." : "Optimize Portfolio"}
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="text-sm font-medium">Current Allocation</div>
            <div className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReChartPie data={allocation}>
                  <Pie
                    data={allocation}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    label={({name, value}) => `${name}: ${value}%`}
                  >
                    {allocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </ReChartPie>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Expected Return</span>
                <span className="text-green-500">{metrics.currentExpectedReturn}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Risk (Volatility)</span>
                <span className="text-amber-400">{metrics.currentRisk}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sharpe Ratio</span>
                <span>{metrics.currentSharpeRatio}</span>
              </div>
            </div>
          </div>
        </div>
        
        {optimizationComplete && (
          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Optimized Allocation</div>
                  <ArrowRight className="h-4 w-4 text-green-500" />
                </div>
                <div className="h-[230px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartPie data={optimizedAllocation}>
                      <Pie
                        data={optimizedAllocation}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        label={({name, value}) => `${name}: ${value}%`}
                      >
                        {optimizedAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </ReChartPie>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Expected Return</span>
                    <span className="text-green-500">{metrics.optimizedExpectedReturn}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Risk (Volatility)</span>
                    <span className="text-amber-400">{metrics.optimizedRisk}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sharpe Ratio</span>
                    <span className="text-blue-400">{metrics.optimizedSharpeRatio}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm font-medium">Suggested Changes</div>
                
                <div className="space-y-3">
                  <div className="bg-muted/10 p-3 rounded-md flex justify-between">
                    <div>
                      <div className="font-medium">Reduce BTC</div>
                      <div className="text-xs text-muted-foreground">From 30% to 25%</div>
                    </div>
                    <div className="text-amber-400">-5%</div>
                  </div>
                  
                  <div className="bg-muted/10 p-3 rounded-md flex justify-between">
                    <div>
                      <div className="font-medium">Reduce ETH</div>
                      <div className="text-xs text-muted-foreground">From 20% to 15%</div>
                    </div>
                    <div className="text-amber-400">-5%</div>
                  </div>
                  
                  <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-md flex justify-between">
                    <div>
                      <div className="font-medium">Add SOL</div>
                      <div className="text-xs text-muted-foreground">From 0% to 10%</div>
                    </div>
                    <div className="text-green-500">+10%</div>
                  </div>
                  
                  <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-md flex justify-between">
                    <div>
                      <div className="font-medium">Add GOLD</div>
                      <div className="text-xs text-muted-foreground">From 0% to 10%</div>
                    </div>
                    <div className="text-green-500">+10%</div>
                  </div>
                </div>
                
                <Button className="w-full">Apply Optimized Allocation</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioOptimizer;
