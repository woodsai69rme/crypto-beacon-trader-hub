
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AITradingStrategy, PaperTradingConfig, AIStrategyParameters } from "@/types/trading";
import AiTradingStrategySelector from './AiTradingStrategySelector';
import AiTradingBotList from './AiTradingBotList';
import { RealTimePriceChart } from '@/components';
import { Robot, Zap, AlertTriangle, Settings, LineChart, Activity, Box } from "lucide-react";
import { fetchCoinHistory, formatPrice } from '@/services/cryptoService';
import { toast } from '@/components/ui/use-toast';
import { generateTradingSignal, backtestStrategy, availableStrategies } from '@/services/aiService';

const AiTradingDashboard: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<AITradingStrategy | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
  const [paperTradingConfig, setPaperTradingConfig] = useState<PaperTradingConfig>({
    enabled: true,
    initialBalance: 10000,
    currency: 'AUD', // Default to AUD as per requirements
    slippageModel: 'realistic',
    slippagePercentage: 0.1,
    maxTradeSize: 1000,
    includeFees: true,
    feePercentage: 0.2
  });
  
  const [strategyParameters, setStrategyParameters] = useState<AIStrategyParameters>({
    buySignalThreshold: 0.7,
    sellSignalThreshold: 0.7,
    stopLossPercentage: 5,
    takeProfitPercentage: 10,
    maxOpenPositions: 3,
    positionSizePercentage: 10
  });
  
  const [priceData, setPriceData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<string>('7d');
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [signal, setSignal] = useState<{ signal: 'buy' | 'sell' | 'hold', confidence: number, reasoning: string } | null>(null);
  const [backtestInProgress, setBacktestInProgress] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Fetch price data when coin or timeframe changes
  useEffect(() => {
    fetchData();
  }, [selectedCoin, timeframe]);
  
  const fetchData = async () => {
    setIsLoadingData(true);
    
    try {
      const days = timeframe === '24h' ? 1 : 
                  timeframe === '7d' ? 7 : 
                  timeframe === '30d' ? 30 : 
                  timeframe === '90d' ? 90 : 365;
      
      const data = await fetchCoinHistory(selectedCoin, days);
      setPriceData(data);
    } catch (error) {
      console.error("Error fetching price data:", error);
      toast({
        title: "Data Loading Error",
        description: "Failed to load price data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingData(false);
    }
  };
  
  const handleSelectStrategy = (strategy: AITradingStrategy) => {
    setSelectedStrategy(strategy);
    
    // Reset signal when strategy changes
    setSignal(null);
    
    // Update timeframe to match strategy's default
    if (strategy.timeframe) {
      setTimeframe(strategy.timeframe);
      fetchData();
    }
  };
  
  const handleGenerateSignal = async () => {
    if (!selectedStrategy || !priceData.length) {
      toast({
        title: "Cannot Generate Signal",
        description: "Please select a strategy and wait for price data to load.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoadingData(true);
    
    try {
      const generatedSignal = await generateTradingSignal(
        selectedCoin,
        selectedStrategy,
        priceData,
        strategyParameters
      );
      
      setSignal(generatedSignal);
      
      toast({
        title: "Trading Signal Generated",
        description: `Signal: ${generatedSignal.signal.toUpperCase()} with ${Math.round(generatedSignal.confidence * 100)}% confidence`,
        variant: generatedSignal.signal === 'buy' ? "default" : 
                generatedSignal.signal === 'sell' ? "destructive" : "secondary"
      });
    } catch (error) {
      console.error("Error generating trading signal:", error);
      toast({
        title: "Signal Generation Failed",
        description: "Could not generate a trading signal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingData(false);
    }
  };
  
  const handleRunBacktest = async () => {
    if (!selectedStrategy) {
      toast({
        title: "Cannot Run Backtest",
        description: "Please select a strategy first.",
        variant: "destructive"
      });
      return;
    }
    
    setBacktestInProgress(true);
    
    try {
      // Calculate date range for backtest
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(); // 90 days ago
      
      const backtestResults = await backtestStrategy(
        selectedStrategy,
        selectedCoin,
        startDate,
        endDate,
        strategyParameters
      );
      
      // Navigate to backtest results tab
      setActiveTab('backtest');
      
      toast({
        title: "Backtest Completed",
        description: `${selectedStrategy.name} on ${selectedCoin}: ${backtestResults.returns.toFixed(2)}% return`,
      });
    } catch (error) {
      console.error("Error running backtest:", error);
      toast({
        title: "Backtest Failed",
        description: "Could not complete backtest. Please try again.",
        variant: "destructive"
      });
    } finally {
      setBacktestInProgress(false);
    }
  };
  
  const handleCreateBot = () => {
    if (!selectedStrategy) {
      toast({
        title: "Cannot Create Bot",
        description: "Please select a strategy first.",
        variant: "destructive"
      });
      return;
    }
    
    // Show success toast for demo
    toast({
      title: "Bot Created",
      description: `${selectedStrategy.name} bot for ${selectedCoin.toUpperCase()} has been created and is now running.`,
    });
    
    // Navigate to bots tab
    setActiveTab('bots');
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>AI Trading Platform</CardTitle>
              <CardDescription>
                Deploy advanced AI trading strategies with paper or live trading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="strategy">Strategy</TabsTrigger>
                  <TabsTrigger value="backtest">Backtest</TabsTrigger>
                  <TabsTrigger value="bots">Bots</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-sm text-muted-foreground">Active Bots</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">68.4%</div>
                        <p className="text-sm text-muted-foreground">Average Win Rate</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-500">+12.8%</div>
                        <p className="text-sm text-muted-foreground">Total Profit/Loss</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Card className="flex-1">
                      <CardHeader>
                        <CardTitle>Recent Trades</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        <div className="text-center p-8">
                          <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">Your recent AI trades will appear here</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="flex-1">
                      <CardHeader>
                        <CardTitle>Best Performing Strategy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="font-medium">AI Mean Reversion</h3>
                            <p className="text-sm text-muted-foreground">ETH/AUD, 4h timeframe</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            +23.6%
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Win Rate</span>
                            <span>71.4%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Profit</span>
                            <span>$1,328.79</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Trades</span>
                            <span>28</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="strategy" className="space-y-4">
                  <AiTradingStrategySelector
                    onSelect={handleSelectStrategy}
                    selectedStrategyId={selectedStrategy?.id}
                  />
                </TabsContent>
                
                <TabsContent value="backtest" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Strategy Backtesting</CardTitle>
                      <CardDescription>
                        Test and optimize your AI trading strategies with historical data
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedStrategy ? (
                        <div className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-medium mb-2">Selected Strategy</h3>
                              <div className="bg-muted p-4 rounded-md">
                                <div className="flex items-center gap-2 mb-2">
                                  <Robot className="h-5 w-5 text-primary" />
                                  <h4>{selectedStrategy.name}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {selectedStrategy.description}
                                </p>
                                <div className="flex gap-2">
                                  <Badge variant="outline">{selectedStrategy.type}</Badge>
                                  <Badge variant="outline">{selectedStrategy.timeframe}</Badge>
                                  <Badge variant="outline">{selectedStrategy.riskLevel} risk</Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-medium mb-2">Backtest Parameters</h3>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <Label>Period Start</Label>
                                    <Select defaultValue="90d">
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select period" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="30d">30 days</SelectItem>
                                        <SelectItem value="90d">90 days</SelectItem>
                                        <SelectItem value="180d">180 days</SelectItem>
                                        <SelectItem value="365d">1 year</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-1">
                                    <Label>Asset</Label>
                                    <Select 
                                      value={selectedCoin}
                                      onValueChange={setSelectedCoin}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select asset" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                                        <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                                        <SelectItem value="solana">Solana (SOL)</SelectItem>
                                        <SelectItem value="cardano">Cardano (ADA)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                
                                <Button 
                                  className="w-full" 
                                  onClick={handleRunBacktest}
                                  disabled={backtestInProgress}
                                >
                                  {backtestInProgress ? (
                                    <>
                                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full" />
                                      Running Backtest...
                                    </>
                                  ) : (
                                    <>
                                      <LineChart className="h-4 w-4 mr-2" />
                                      Run Backtest
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-4">Backtest Results</h3>
                            <div className="grid sm:grid-cols-3 gap-4">
                              <Card>
                                <CardContent className="pt-6 text-center">
                                  <div className="text-3xl font-bold text-green-500">+23.5%</div>
                                  <p className="text-sm text-muted-foreground">Total Return</p>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="pt-6 text-center">
                                  <div className="text-3xl font-bold">1.75</div>
                                  <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="pt-6 text-center">
                                  <div className="text-3xl font-bold">72%</div>
                                  <p className="text-sm text-muted-foreground">Win Rate</p>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-8">
                          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-medium mb-2">No Strategy Selected</h3>
                          <p className="text-muted-foreground mb-4">
                            Please select a strategy from the Strategy tab to run a backtest
                          </p>
                          <Button onClick={() => setActiveTab('strategy')}>Select Strategy</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="bots" className="space-y-4">
                  <AiTradingBotList
                    bots={[]}
                    onStartBot={(botId) => console.log(`Start bot ${botId}`)}
                    onStopBot={(botId) => console.log(`Stop bot ${botId}`)}
                    onDeleteBot={(botId) => console.log(`Delete bot ${botId}`)}
                    onViewBot={(botId) => console.log(`View bot ${botId}`)}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Live Signals</CardTitle>
                <Select
                  value={selectedCoin}
                  onValueChange={setSelectedCoin}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select coin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                    <SelectItem value="solana">Solana (SOL)</SelectItem>
                    <SelectItem value="cardano">Cardano (ADA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pb-2 pt-0">
              <RealTimePriceChart
                coinId={selectedCoin}
                timeframe={timeframe}
                priceData={priceData}
                isLoading={isLoadingData}
                onTimeframeChange={setTimeframe}
              />
            </CardContent>
            <CardFooter className="flex-col items-start pt-0">
              <div className="w-full">
                <Button 
                  variant="default" 
                  className="w-full mb-2"
                  disabled={!selectedStrategy || isLoadingData}
                  onClick={handleGenerateSignal}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Signal
                </Button>
                
                {signal && (
                  <div className={`p-3 rounded-md mb-2 ${
                    signal.signal === 'buy' ? 'bg-green-100 dark:bg-green-900' : 
                    signal.signal === 'sell' ? 'bg-red-100 dark:bg-red-900' : 
                    'bg-yellow-100 dark:bg-yellow-900'
                  }`}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">
                        {signal.signal === 'buy' ? 'Buy Signal' : 
                         signal.signal === 'sell' ? 'Sell Signal' : 'Hold Signal'}
                      </div>
                      <div className="text-sm">
                        {Math.round(signal.confidence * 100)}% confidence
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{signal.reasoning}</p>
                  </div>
                )}
                
                {selectedStrategy && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleCreateBot}
                  >
                    <Robot className="h-4 w-4 mr-2" />
                    Create Trading Bot
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Paper Trading</CardTitle>
              <CardDescription>Configure your paper trading environment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Paper Trading</Label>
                <Switch 
                  checked={paperTradingConfig.enabled}
                  onCheckedChange={(checked) => setPaperTradingConfig({
                    ...paperTradingConfig,
                    enabled: checked
                  })}
                />
              </div>
              
              <div className="space-y-1">
                <Label>Initial Balance</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">AUD</span>
                  <input
                    type="number" 
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    value={paperTradingConfig.initialBalance}
                    onChange={(e) => setPaperTradingConfig({
                      ...paperTradingConfig,
                      initialBalance: Number(e.target.value)
                    })}
                    disabled={!paperTradingConfig.enabled}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label>Slippage Model</Label>
                <Select
                  value={paperTradingConfig.slippageModel}
                  onValueChange={(value: 'none' | 'simple' | 'realistic') => setPaperTradingConfig({
                    ...paperTradingConfig,
                    slippageModel: value
                  })}
                  disabled={!paperTradingConfig.enabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select slippage model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Perfect Execution)</SelectItem>
                    <SelectItem value="simple">Simple (Fixed %)</SelectItem>
                    <SelectItem value="realistic">Realistic (Volume-Based)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="includeFees">Include Trading Fees</Label>
                <Switch 
                  id="includeFees"
                  checked={paperTradingConfig.includeFees}
                  onCheckedChange={(checked) => setPaperTradingConfig({
                    ...paperTradingConfig,
                    includeFees: checked
                  })}
                  disabled={!paperTradingConfig.enabled}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AiTradingDashboard;
