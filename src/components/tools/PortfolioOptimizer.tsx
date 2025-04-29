
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart4, TrendingUp, PieChart, Settings2, Briefcase, Play, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PortfolioOptimizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("allocation");
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [riskTolerance, setRiskTolerance] = useState<number>(50);
  
  const assets = [
    { name: "Bitcoin", symbol: "BTC", allocation: 30, returns: 85, volatility: 75, correlation: 0.5 },
    { name: "Ethereum", symbol: "ETH", allocation: 25, returns: 65, volatility: 68, correlation: 0.6 },
    { name: "Solana", symbol: "SOL", allocation: 15, returns: 95, volatility: 85, correlation: 0.7 },
    { name: "Cardano", symbol: "ADA", allocation: 10, returns: 55, volatility: 60, correlation: 0.5 },
    { name: "XRP", symbol: "XRP", allocation: 5, returns: 45, volatility: 65, correlation: 0.6 },
    { name: "USD Coin", symbol: "USDC", allocation: 15, returns: 10, volatility: 5, correlation: 0.1 },
  ];
  
  const optimizedAssets = [
    { name: "Bitcoin", symbol: "BTC", allocation: 24, returns: 85, volatility: 75, correlation: 0.5 },
    { name: "Ethereum", symbol: "ETH", allocation: 32, returns: 65, volatility: 68, correlation: 0.6 },
    { name: "Solana", symbol: "SOL", allocation: 18, returns: 95, volatility: 85, correlation: 0.7 },
    { name: "Cardano", symbol: "ADA", allocation: 5, returns: 55, volatility: 60, correlation: 0.5 },
    { name: "XRP", symbol: "XRP", allocation: 0, returns: 45, volatility: 65, correlation: 0.6 },
    { name: "USD Coin", symbol: "USDC", allocation: 21, returns: 10, volatility: 5, correlation: 0.1 },
  ];
  
  const [portfolioAssets, setPortfolioAssets] = useState(assets);
  
  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setPortfolioAssets(optimizedAssets);
    }, 2000);
  };
  
  const handleReset = () => {
    setPortfolioAssets(assets);
  };
  
  const calculateStats = (assets: typeof portfolioAssets) => {
    const totalReturn = assets.reduce((sum, asset) => sum + (asset.returns * asset.allocation / 100), 0);
    
    // Simple volatility calculation (this is a simplification)
    let volatility = 0;
    assets.forEach(asset => {
      volatility += Math.pow(asset.volatility * asset.allocation / 100, 2);
      assets.forEach(other => {
        if (asset !== other) {
          volatility += 2 * asset.correlation * (asset.volatility * asset.allocation / 100) * (other.volatility * other.allocation / 100);
        }
      });
    });
    volatility = Math.sqrt(volatility);
    
    const sharpeRatio = totalReturn / volatility;
    
    return {
      expectedReturn: totalReturn,
      volatility,
      sharpeRatio
    };
  };
  
  const currentStats = calculateStats(portfolioAssets);
  const originalStats = calculateStats(assets);
  const isOptimized = JSON.stringify(portfolioAssets) !== JSON.stringify(assets);
  
  return (
    <Card className="shadow-lg border border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Portfolio Optimizer</CardTitle>
            <CardDescription>Optimize your asset allocation for better risk-adjusted returns</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="allocation" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-12 py-2 px-3 bg-muted/20 text-xs font-medium rounded-t-md">
                <div className="col-span-4">Asset</div>
                <div className="col-span-3 text-center">Allocation</div>
                <div className="col-span-2 text-center">Returns</div>
                <div className="col-span-2 text-center">Volatility</div>
                <div className="col-span-1 text-center">Corr.</div>
              </div>
              
              <div className="space-y-2">
                {portfolioAssets.map((asset, index) => (
                  <div key={index} className="grid grid-cols-12 items-center py-2 px-3 bg-muted/10 rounded-md">
                    <div className="col-span-4 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2 text-xs">
                        {asset.symbol}
                      </div>
                      <div>{asset.name}</div>
                    </div>
                    <div className="col-span-3 text-center">
                      <div className="h-2 bg-muted/30 rounded-full mx-4">
                        <div 
                          className="h-full bg-primary/60 rounded-full" 
                          style={{ width: `${asset.allocation}%` }}
                        ></div>
                      </div>
                      <div className="text-xs mt-1">{asset.allocation}%</div>
                    </div>
                    <div className="col-span-2 text-center text-xs">{asset.returns}%</div>
                    <div className="col-span-2 text-center text-xs">{asset.volatility}%</div>
                    <div className="col-span-1 text-center text-xs">{asset.correlation}</div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Expected Return</div>
                  <div className="text-lg font-bold">{currentStats.expectedReturn.toFixed(2)}%</div>
                </div>
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Portfolio Volatility</div>
                  <div className="text-lg font-bold">{currentStats.volatility.toFixed(2)}%</div>
                </div>
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Sharpe Ratio</div>
                  <div className="text-lg font-bold">{currentStats.sharpeRatio.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleReset} disabled={!isOptimized}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button onClick={handleOptimize} disabled={isOptimizing}>
                  {isOptimizing ? (
                    <>Optimizing...</>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Optimize
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/10 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <PieChart className="h-4 w-4 mr-2" />
                  Asset Allocation
                </h3>
                <div className="h-40 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full relative">
                    {portfolioAssets.map((asset, index) => {
                      const colors = [
                        'bg-blue-500/80', 'bg-green-500/80', 'bg-purple-500/80', 
                        'bg-amber-500/80', 'bg-red-500/80', 'bg-cyan-500/80'
                      ];
                      let startAngle = 0;
                      for (let i = 0; i < index; i++) {
                        startAngle += portfolioAssets[i].allocation * 3.6;
                      }
                      return (
                        <div 
                          key={index}
                          className={`absolute top-0 left-0 w-full h-full ${colors[index % colors.length]}`}
                          style={{
                            clipPath: `conic-gradient(from ${startAngle}deg, transparent 0deg, transparent ${asset.allocation * 3.6}deg, transparent ${asset.allocation * 3.6}deg)`,
                          }}
                        ></div>
                      );
                    })}
                    <div className="absolute inset-3 bg-muted rounded-full flex items-center justify-center text-xs">
                      {portfolioAssets.reduce((sum, asset) => sum + asset.allocation, 0)}%
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {portfolioAssets.map((asset, index) => {
                    const colors = [
                      'bg-blue-500/80', 'bg-green-500/80', 'bg-purple-500/80', 
                      'bg-amber-500/80', 'bg-red-500/80', 'bg-cyan-500/80'
                    ];
                    return (
                      <div key={index} className="flex items-center text-xs">
                        <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-1`}></div>
                        <span>{asset.symbol} ({asset.allocation}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-muted/10 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Risk vs. Return
                </h3>
                <div className="h-40 relative">
                  {/* Simple risk/return scatter plot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full border-l border-b border-border/60 relative">
                      {/* Y-axis (Returns) */}
                      <div className="absolute -left-6 top-0 text-xs">Return</div>
                      
                      {/* X-axis (Risk) */}
                      <div className="absolute bottom-0 right-0 text-xs">Risk</div>
                      
                      {/* Current portfolio dot */}
                      <div 
                        className="absolute w-4 h-4 rounded-full bg-primary/80 border-2 border-primary"
                        style={{ 
                          bottom: `${(currentStats.expectedReturn / 100) * 100}%`,
                          left: `${(currentStats.volatility / 100) * 100}%`,
                          transform: 'translate(-50%, 50%)'
                        }}
                      ></div>
                      
                      {/* Original portfolio dot (if optimized) */}
                      {isOptimized && (
                        <div 
                          className="absolute w-4 h-4 rounded-full bg-muted border-2 border-muted-foreground"
                          style={{ 
                            bottom: `${(originalStats.expectedReturn / 100) * 100}%`,
                            left: `${(originalStats.volatility / 100) * 100}%`,
                            transform: 'translate(-50%, 50%)'
                          }}
                        ></div>
                      )}
                      
                      {/* Assets dots */}
                      {portfolioAssets.map((asset, index) => (
                        <div 
                          key={index}
                          className="absolute w-2 h-2 rounded-full bg-secondary/70"
                          style={{ 
                            bottom: `${(asset.returns / 100) * 100}%`,
                            left: `${(asset.volatility / 100) * 100}%`,
                            transform: 'translate(-50%, 50%)'
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-4 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary/80 mr-1"></div>
                    <span>Current Portfolio</span>
                  </div>
                  {isOptimized && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-muted mr-1"></div>
                      <span>Original Portfolio</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-muted/10 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <BarChart4 className="h-4 w-4 mr-2" />
                Key Metrics Comparison
              </h3>
              
              <div className="space-y-4">
                {/* Expected Return */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Expected Annual Return</span>
                    <span>{currentStats.expectedReturn.toFixed(2)}%</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500/80 rounded-full" style={{ width: `${currentStats.expectedReturn}%` }}></div>
                  </div>
                  {isOptimized && (
                    <div className="text-xs text-right text-green-500">
                      {((currentStats.expectedReturn - originalStats.expectedReturn) > 0 ? '+' : '')}
                      {(currentStats.expectedReturn - originalStats.expectedReturn).toFixed(2)}%
                    </div>
                  )}
                </div>
                
                {/* Volatility */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Portfolio Volatility</span>
                    <span>{currentStats.volatility.toFixed(2)}%</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500/70 rounded-full" style={{ width: `${currentStats.volatility}%` }}></div>
                  </div>
                  {isOptimized && (
                    <div className="text-xs text-right text-red-500">
                      {((currentStats.volatility - originalStats.volatility) < 0 ? '' : '+')}
                      {(currentStats.volatility - originalStats.volatility).toFixed(2)}%
                    </div>
                  )}
                </div>
                
                {/* Sharpe Ratio */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Sharpe Ratio</span>
                    <span>{currentStats.sharpeRatio.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500/80 rounded-full" style={{ width: `${currentStats.sharpeRatio * 20}%` }}></div>
                  </div>
                  {isOptimized && (
                    <div className="text-xs text-right text-blue-500">
                      {((currentStats.sharpeRatio - originalStats.sharpeRatio) > 0 ? '+' : '')}
                      {(currentStats.sharpeRatio - originalStats.sharpeRatio).toFixed(2)}
                    </div>
                  )}
                </div>
                
                {/* Diversification Score (simplified) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Diversification Score</span>
                    <span>{(1 - Math.sqrt(portfolioAssets.reduce((sum, asset) => sum + Math.pow(asset.allocation / 100, 2), 0)) * 100).toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500/80 rounded-full" 
                      style={{ width: `${(1 - Math.sqrt(portfolioAssets.reduce((sum, asset) => sum + Math.pow(asset.allocation / 100, 2), 0))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="optimization" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="risk-tolerance">Risk Tolerance ({riskTolerance}%)</Label>
                <Slider
                  id="risk-tolerance"
                  min={10}
                  max={90}
                  step={5}
                  value={[riskTolerance]}
                  onValueChange={(value) => setRiskTolerance(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div>Conservative</div>
                  <div>Moderate</div>
                  <div>Aggressive</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Optimization Goals</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="switch-1" className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Maximize Returns</span>
                    </Label>
                    <Switch id="switch-1" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="switch-2" className="flex items-center gap-2">
                      <Settings2 className="h-4 w-4" />
                      <span>Minimize Volatility</span>
                    </Label>
                    <Switch id="switch-2" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="switch-3" className="flex items-center gap-2">
                      <PieChart className="h-4 w-4" />
                      <span>Maximize Diversification</span>
                    </Label>
                    <Switch id="switch-3" defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Constraints</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="risk-type">Risk Model</Label>
                    <Select defaultValue="mean-variance">
                      <SelectTrigger id="risk-type">
                        <SelectValue placeholder="Select risk model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mean-variance">Mean-Variance</SelectItem>
                        <SelectItem value="black-litterman">Black-Litterman</SelectItem>
                        <SelectItem value="risk-parity">Risk Parity</SelectItem>
                        <SelectItem value="max-sharpe">Max Sharpe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rebalance">Rebalance Frequency</Label>
                    <Select defaultValue="quarterly">
                      <SelectTrigger id="rebalance">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-md">
                <h3 className="text-sm font-medium text-blue-500 mb-2">Portfolio Recommendations</h3>
                <div className="space-y-1 text-sm">
                  <div>• Consider increasing allocation to assets with lower correlation like USDC to reduce overall risk.</div>
                  <div>• Based on your risk tolerance, ETH offers a better risk/return ratio than BTC.</div>
                  <div>• Removing XRP from your portfolio would improve your Sharpe ratio.</div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleReset} disabled={!isOptimized}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button onClick={handleOptimize} disabled={isOptimizing}>
                  {isOptimizing ? (
                    <>Optimizing...</>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run Optimization
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PortfolioOptimizer;
