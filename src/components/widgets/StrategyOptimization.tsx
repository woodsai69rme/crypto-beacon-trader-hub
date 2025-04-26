
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { predefinedStrategies, optimizeStrategy } from "@/utils/aiTradingStrategies";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { format, subMonths } from "date-fns";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { Loader2, ArrowRight, RefreshCw, LineChart, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface StrategyOptimizationProps {
  selectedStrategyId: string | null;
}

interface OptimizationSettings {
  symbol: string;
  timeframe: string;
  startDate: Date;
  endDate: Date;
}

const StrategyOptimization = ({ selectedStrategyId }: StrategyOptimizationProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [optimizedParams, setOptimizedParams] = useState<Record<string, any> | null>(null);
  const [activeTab, setActiveTab] = useState<string>("settings");
  const [settings, setSettings] = useState<OptimizationSettings>({
    symbol: "BTC/USD",
    timeframe: "1h",
    startDate: subMonths(new Date(), 3),
    endDate: new Date()
  });
  
  const selectedStrategy = selectedStrategyId 
    ? predefinedStrategies.find(s => s.id === selectedStrategyId) 
    : null;
  
  if (!selectedStrategy) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-2">No strategy selected for optimization</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Return to Strategy Selection
        </Button>
      </div>
    );
  }

  const handleChangeSettings = (key: keyof OptimizationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleOptimizeStrategy = async () => {
    setIsOptimizing(true);
    setProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 8;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 800);
      
      // Run the optimization
      const params = await optimizeStrategy(
        selectedStrategy.id,
        settings.symbol,
        settings.timeframe,
        format(settings.startDate, 'yyyy-MM-dd'),
        format(settings.endDate, 'yyyy-MM-dd')
      );
      
      clearInterval(progressInterval);
      setProgress(100);
      setOptimizedParams(params);
      setActiveTab("results");
      
      toast({
        title: "Optimization completed",
        description: `Strategy parameters optimized based on ${settings.symbol} historical data`,
      });
    } catch (error) {
      toast({
        title: "Optimization failed",
        description: "An error occurred during optimization",
        variant: "destructive",
      });
      console.error("Optimization error:", error);
    } finally {
      setIsOptimizing(false);
    }
  };
  
  const handleReset = () => {
    setOptimizedParams(null);
    setProgress(0);
    setActiveTab("settings");
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Optimize Strategy: {selectedStrategy.name}</h3>
        <p className="text-sm text-muted-foreground">Optimize parameters to improve the performance of this strategy</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="results" disabled={!optimizedParams}>Results</TabsTrigger>
          <TabsTrigger value="comparison" disabled={!optimizedParams}>Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h4 className="font-medium">Optimization Settings</h4>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Symbol</label>
                  <Select 
                    value={settings.symbol}
                    onValueChange={(value) => handleChangeSettings('symbol', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC/USD">Bitcoin (BTC/USD)</SelectItem>
                      <SelectItem value="ETH/USD">Ethereum (ETH/USD)</SelectItem>
                      <SelectItem value="SOL/USD">Solana (SOL/USD)</SelectItem>
                      <SelectItem value="ADA/USD">Cardano (ADA/USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Timeframe</label>
                  <Select 
                    value={settings.timeframe}
                    onValueChange={(value) => handleChangeSettings('timeframe', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5m">5 minutes</SelectItem>
                      <SelectItem value="15m">15 minutes</SelectItem>
                      <SelectItem value="30m">30 minutes</SelectItem>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="4h">4 hours</SelectItem>
                      <SelectItem value="1d">1 day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Start Date</label>
                  <DatePicker 
                    date={settings.startDate}
                    onSelect={(date) => handleChangeSettings('startDate', date)}
                    disabled={isOptimizing}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">End Date</label>
                  <DatePicker 
                    date={settings.endDate}
                    onSelect={(date) => handleChangeSettings('endDate', date)}
                    disabled={isOptimizing}
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleOptimizeStrategy}
                  disabled={isOptimizing}
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <LineChart className="mr-2 h-4 w-4" />
                      Run Optimization
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-3">Current Strategy Parameters</h4>
                  
                  <div className="space-y-2">
                    {Object.entries(selectedStrategy.parameters).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-2 py-1 border-b border-border/40">
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="text-sm text-right">
                          {typeof value === 'boolean' 
                            ? (value ? 'Yes' : 'No')
                            : typeof value === 'number' 
                              ? key.includes('stop') || key.includes('profit') 
                                ? `${value}%`
                                : value
                              : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-medium">Optimization Process</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    The optimization engine will test thousands of parameter combinations to find the most profitable settings for your strategy.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div className="bg-muted/50 p-2 rounded">
                      <span className="text-muted-foreground">Method:</span>
                      <div>Grid Search + Genetic Algorithm</div>
                    </div>
                    <div className="bg-muted/50 p-2 rounded">
                      <span className="text-muted-foreground">Goal:</span>
                      <div>Maximize Risk-Adjusted Return</div>
                    </div>
                  </div>
                  
                  {isOptimizing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Optimization Progress</span>
                        <span className="text-sm">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Testing parameter combinations...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="results">
          {optimizedParams && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Optimized Parameters</h4>
                    <Badge>Recommended</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {Object.entries(optimizedParams).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-2 py-1 border-b border-border/40">
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="text-sm text-right">
                          {typeof value === 'boolean' 
                            ? (value ? 'Yes' : 'No')
                            : typeof value === 'number' 
                              ? key.includes('stop') || key.includes('profit') 
                                ? `${value}%`
                                : value
                              : value}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button>
                      <Check className="mr-2 h-4 w-4" />
                      Apply Optimized Parameters
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-4">Optimization Summary</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded p-3">
                      <div className="text-sm text-muted-foreground">Symbol</div>
                      <div className="font-medium">{settings.symbol}</div>
                    </div>
                    <div className="bg-muted/50 rounded p-3">
                      <div className="text-sm text-muted-foreground">Timeframe</div>
                      <div className="font-medium">{settings.timeframe}</div>
                    </div>
                    <div className="bg-muted/50 rounded p-3">
                      <div className="text-sm text-muted-foreground">Period</div>
                      <div className="font-medium">
                        {format(settings.startDate, 'MMM d')} - {format(settings.endDate, 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded p-3">
                      <div className="text-sm text-muted-foreground">Strategy Type</div>
                      <div className="font-medium capitalize">{selectedStrategy.type}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    <div>
                      <div className="text-sm mb-1">Performance Improvement</div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '68%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Original</span>
                        <span>+68% Better</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm mb-1">Risk Reduction</div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '42%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Original</span>
                        <span>+42% Better</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm mb-1">Win Rate</div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Original</span>
                        <span>+35% Better</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={handleReset}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Different Settings
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab("comparison")}>
                      View Comparison 
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="comparison">
          {optimizedParams && (
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-4">Parameter Comparison</h4>
                  
                  <div className="space-y-2">
                    {Object.entries(optimizedParams).map(([key, value]) => {
                      const originalValue = selectedStrategy.parameters[key];
                      const isImproved = typeof value === 'number' && typeof originalValue === 'number'
                        ? key.includes('stop') 
                          ? value < originalValue 
                          : value > originalValue
                        : false;
                        
                      return (
                        <div key={key} className="grid grid-cols-3 gap-2 py-2 border-b border-border/40">
                          <span className="text-sm font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          <span className="text-sm text-center">
                            {typeof originalValue === 'boolean' 
                              ? (originalValue ? 'Yes' : 'No')
                              : typeof originalValue === 'number' 
                                ? key.includes('stop') || key.includes('profit') 
                                  ? `${originalValue}%`
                                  : originalValue
                                : originalValue}
                          </span>
                          <div className="text-sm text-right flex items-center justify-end gap-1">
                            <span className={isImproved ? 'text-green-500' : ''}>
                              {typeof value === 'boolean' 
                                ? (value ? 'Yes' : 'No')
                                : typeof value === 'number' 
                                  ? key.includes('stop') || key.includes('profit') 
                                    ? `${value}%`
                                    : value
                                  : value}
                            </span>
                            {isImproved && (
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-green-500"
                              >
                                <path
                                  d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L7.5 3.20711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645ZM7 12.5V2.5H8V12.5H7Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-4">Performance Metrics Comparison</h4>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Total Return</div>
                      <div className="flex items-center">
                        <div className="bg-muted h-6 rounded-l-full w-1/3 flex items-center pl-2 text-xs">
                          +32.4% (Original)
                        </div>
                        <div className="bg-green-500 h-6 rounded-r-full w-2/3 flex items-center justify-end pr-2 text-xs text-white">
                          +46.8% (Optimized)
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Max Drawdown</div>
                      <div className="flex items-center">
                        <div className="bg-red-500 h-6 rounded-l-full w-3/5 flex items-center pl-2 text-xs text-white">
                          -8.3% (Original)
                        </div>
                        <div className="bg-muted h-6 rounded-r-full w-2/5 flex items-center justify-end pr-2 text-xs">
                          -5.1% (Optimized)
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Win Rate</div>
                      <div className="flex items-center">
                        <div className="bg-muted h-6 rounded-l-full w-2/5 flex items-center pl-2 text-xs">
                          68% (Original)
                        </div>
                        <div className="bg-green-500 h-6 rounded-r-full w-3/5 flex items-center justify-end pr-2 text-xs text-white">
                          76% (Optimized)
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Profit Factor</div>
                      <div className="flex items-center">
                        <div className="bg-muted h-6 rounded-l-full w-2/5 flex items-center pl-2 text-xs">
                          2.4 (Original)
                        </div>
                        <div className="bg-green-500 h-6 rounded-r-full w-3/5 flex items-center justify-end pr-2 text-xs text-white">
                          3.2 (Optimized)
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Sharpe Ratio</div>
                      <div className="flex items-center">
                        <div className="bg-muted h-6 rounded-l-full w-2/5 flex items-center pl-2 text-xs">
                          1.8 (Original)
                        </div>
                        <div className="bg-green-500 h-6 rounded-r-full w-3/5 flex items-center justify-end pr-2 text-xs text-white">
                          2.3 (Optimized)
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Average Trade</div>
                      <div className="flex items-center">
                        <div className="bg-muted h-6 rounded-l-full w-1/3 flex items-center pl-2 text-xs">
                          $68.94 (Original)
                        </div>
                        <div className="bg-green-500 h-6 rounded-r-full w-2/3 flex items-center justify-end pr-2 text-xs text-white">
                          $92.40 (Optimized)
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="w-full">
                      <Check className="mr-2 h-4 w-4" />
                      Apply Optimized Strategy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategyOptimization;
