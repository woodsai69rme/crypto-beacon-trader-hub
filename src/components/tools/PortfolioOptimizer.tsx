
import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { Info, ArrowRight, Trash, Plus, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Custom tooltip component for the first LineChart
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload || payload.length === 0) return null;
  
  return (
    <div className="bg-card p-3 border rounded-md shadow-md">
      <p className="font-medium">{`Return: ${payload[0].value.toFixed(2)}%`}</p>
      <p className="text-sm text-muted-foreground">{`Risk: ${payload[0].payload.risk.toFixed(2)}%`}</p>
    </div>
  );
};

// Custom tooltip component for the second LineChart
const PerformanceTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload || payload.length === 0) return null;
  
  return (
    <div className="bg-card p-3 border rounded-md shadow-md">
      <p className="font-medium">{`Month: ${payload[0].payload.name}`}</p>
      <p className="text-xs text-green-500">{`Optimized: ${payload[0].value.toFixed(2)}%`}</p>
      <p className="text-xs text-blue-500">{`Current: ${payload[1].value.toFixed(2)}%`}</p>
    </div>
  );
};

const PortfolioOptimizer = () => {
  const [activeTab, setActiveTab] = useState('optimizer');
  const [riskTolerance, setRiskTolerance] = useState([50]); // 0-100 scale
  const [optimizedAllocation, setOptimizedAllocation] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [timeHorizon, setTimeHorizon] = useState('medium'); // short, medium, long
  
  // Sample portfolio data
  const [portfolio, setPortfolio] = useState([
    { id: '1', asset: 'Bitcoin', ticker: 'BTC', current: 40, optimized: null, color: '#F7931A' },
    { id: '2', asset: 'Ethereum', ticker: 'ETH', current: 30, optimized: null, color: '#627EEA' },
    { id: '3', asset: 'Solana', ticker: 'SOL', current: 15, optimized: null, color: '#00FFA3' },
    { id: '4', asset: 'Cardano', ticker: 'ADA', current: 10, optimized: null, color: '#0033AD' },
    { id: '5', asset: 'Stablecoin', ticker: 'USDC', current: 5, optimized: null, color: '#2775CA' },
  ]);
  
  const [newAsset, setNewAsset] = useState({ asset: '', ticker: '', current: 0 });
  
  // Sample efficient frontier data
  const efficientFrontierData = [
    { x: 12, y: 5, risk: 5, return: 5 },
    { x: 14, y: 8, risk: 8, return: 8 },
    { x: 16, y: 12, risk: 12, return: 12 },
    { x: 19, y: 16, risk: 16, return: 16 },
    { x: 23, y: 21, risk: 21, return: 21 },
    { x: 28, y: 28, risk: 28, return: 28 },
    { x: 34, y: 36, risk: 36, return: 36 },
  ];
  
  // Sample performance data
  const performanceData = [
    { name: 'Jan', optimized: 2.3, current: 1.7 },
    { name: 'Feb', optimized: 1.9, current: 0.8 },
    { name: 'Mar', optimized: -0.8, current: -1.5 },
    { name: 'Apr', optimized: 3.2, current: 2.6 },
    { name: 'May', optimized: 2.1, current: 1.4 },
    { name: 'Jun', optimized: -1.2, current: -2.0 },
    { name: 'Jul', optimized: 4.3, current: 3.1 },
    { name: 'Aug', optimized: 2.8, current: 2.2 },
    { name: 'Sep', optimized: 0.5, current: 0.1 },
    { name: 'Oct', optimized: 3.7, current: 2.9 },
    { name: 'Nov', optimized: 2.9, current: 2.3 },
    { name: 'Dec', optimized: 1.8, current: 1.2 },
  ];
  
  // Stats based on sample data
  const stats = {
    expectedReturn: {
      current: 11.2,
      optimized: optimizedAllocation ? 14.5 : null
    },
    risk: {
      current: 18.7,
      optimized: optimizedAllocation ? 16.3 : null
    },
    sharpeRatio: {
      current: 0.59,
      optimized: optimizedAllocation ? 0.88 : null
    },
    maxDrawdown: {
      current: 28,
      optimized: optimizedAllocation ? 22 : null
    }
  };
  
  const COLORS = ['#F7931A', '#627EEA', '#00FFA3', '#0033AD', '#2775CA', '#E84142', '#345D9D', '#8A2BE2'];
  
  const handleAddAsset = () => {
    if (newAsset.asset && newAsset.ticker) {
      setPortfolio([
        ...portfolio, 
        { 
          id: Date.now().toString(), 
          ...newAsset, 
          optimized: null,
          color: COLORS[portfolio.length % COLORS.length]
        }
      ]);
      setNewAsset({ asset: '', ticker: '', current: 0 });
    }
  };
  
  const handleRemoveAsset = (id) => {
    setPortfolio(portfolio.filter(asset => asset.id !== id));
    setOptimizedAllocation(null);
  };
  
  const handleOptimize = () => {
    setIsOptimizing(true);
    
    // Simulate optimization processing
    setTimeout(() => {
      // Generate optimized allocation based on risk tolerance
      const riskFactor = riskTolerance[0] / 100;
      let optimizedPortfolio = [];
      
      if (riskFactor < 0.3) {
        // Low risk - more stablecoins, less volatile assets
        optimizedPortfolio = portfolio.map(asset => {
          if (asset.ticker === 'USDC') return { ...asset, optimized: 30 };
          if (asset.ticker === 'BTC') return { ...asset, optimized: 25 };
          if (asset.ticker === 'ETH') return { ...asset, optimized: 20 };
          if (asset.ticker === 'SOL') return { ...asset, optimized: 15 };
          if (asset.ticker === 'ADA') return { ...asset, optimized: 10 };
          return { ...asset, optimized: 0 };
        });
      } else if (riskFactor < 0.7) {
        // Medium risk - balanced allocation
        optimizedPortfolio = portfolio.map(asset => {
          if (asset.ticker === 'USDC') return { ...asset, optimized: 10 };
          if (asset.ticker === 'BTC') return { ...asset, optimized: 35 };
          if (asset.ticker === 'ETH') return { ...asset, optimized: 30 };
          if (asset.ticker === 'SOL') return { ...asset, optimized: 15 };
          if (asset.ticker === 'ADA') return { ...asset, optimized: 10 };
          return { ...asset, optimized: 0 };
        });
      } else {
        // High risk - more volatile assets
        optimizedPortfolio = portfolio.map(asset => {
          if (asset.ticker === 'USDC') return { ...asset, optimized: 5 };
          if (asset.ticker === 'BTC') return { ...asset, optimized: 40 };
          if (asset.ticker === 'ETH') return { ...asset, optimized: 35 };
          if (asset.ticker === 'SOL') return { ...asset, optimized: 15 };
          if (asset.ticker === 'ADA') return { ...asset, optimized: 5 };
          return { ...asset, optimized: 0 };
        });
      }
      
      setPortfolio(optimizedPortfolio);
      setOptimizedAllocation(true);
      setIsOptimizing(false);
    }, 1500);
  };
  
  const renderCurrentPieChart = () => {
    const data = portfolio.map(item => ({
      name: item.ticker,
      value: item.current
    }));
    
    return (
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={portfolio[index].color} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    );
  };
  
  const renderOptimizedPieChart = () => {
    if (!optimizedAllocation) return (
      <div className="h-60 flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          Run the optimizer to see suggested allocation
        </p>
      </div>
    );
    
    const data = portfolio.map(item => ({
      name: item.ticker,
      value: item.optimized
    }));
    
    return (
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={portfolio[index].color} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Optimizer</CardTitle>
        <CardDescription>
          Optimize your crypto portfolio allocation based on risk and return objectives
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="optimizer">Optimizer</TabsTrigger>
            <TabsTrigger value="metrics">Performance Analysis</TabsTrigger>
            <TabsTrigger value="frontier">Efficient Frontier</TabsTrigger>
          </TabsList>
          
          <TabsContent value="optimizer" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Current Allocation</h3>
                {renderCurrentPieChart()}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Optimized Allocation</h3>
                {renderOptimizedPieChart()}
              </div>
            </div>
            
            <ScrollArea className="h-64 rounded-md border">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Assets</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Asset Name"
                      value={newAsset.asset}
                      onChange={(e) => setNewAsset({...newAsset, asset: e.target.value})}
                      className="w-28 h-8"
                    />
                    <Input
                      placeholder="Ticker"
                      value={newAsset.ticker}
                      onChange={(e) => setNewAsset({...newAsset, ticker: e.target.value})}
                      className="w-16 h-8"
                    />
                    <Input
                      type="number"
                      placeholder="%"
                      value={newAsset.current}
                      onChange={(e) => setNewAsset({...newAsset, current: parseInt(e.target.value) || 0})}
                      className="w-14 h-8"
                    />
                    <Button size="sm" variant="outline" onClick={handleAddAsset}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {portfolio.map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center">
                        <div 
                          className="h-3 w-3 rounded-full mr-3"
                          style={{ backgroundColor: asset.color }}
                        />
                        <div>
                          <div className="font-medium">{asset.asset}</div>
                          <div className="text-xs text-muted-foreground">{asset.ticker}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground mr-1">Current:</span>
                          <span>{asset.current}%</span>
                        </div>
                        
                        <div className="flex items-center">
                          <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
                          
                          <div className="text-sm">
                            <span className="text-muted-foreground mr-1">Optimized:</span>
                            <span>
                              {asset.optimized !== null ? `${asset.optimized}%` : '—'}
                            </span>
                          </div>
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleRemoveAsset(asset.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
            
            <div className="bg-muted/20 p-4 rounded-md space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="risk-tolerance">
                    Risk Tolerance 
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 inline-block ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Adjust your risk tolerance to change the optimization targets.
                            Higher risk typically means higher potential returns, but also
                            larger potential drawdowns.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <span className="text-sm">
                    {riskTolerance[0] <= 33 ? 'Conservative' : 
                     riskTolerance[0] <= 66 ? 'Moderate' : 'Aggressive'}
                  </span>
                </div>
                <Slider
                  id="risk-tolerance"
                  max={100}
                  step={1}
                  value={riskTolerance}
                  onValueChange={setRiskTolerance}
                />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Low Risk</span>
                  <span>Medium Risk</span>
                  <span>High Risk</span>
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Investment Time Horizon</Label>
                <div className="flex space-x-2">
                  <Button 
                    variant={timeHorizon === 'short' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTimeHorizon('short')}
                    className="flex-1"
                  >
                    Short-Term
                  </Button>
                  <Button 
                    variant={timeHorizon === 'medium' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTimeHorizon('medium')}
                    className="flex-1"
                  >
                    Medium-Term
                  </Button>
                  <Button 
                    variant={timeHorizon === 'long' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTimeHorizon('long')}
                    className="flex-1"
                  >
                    Long-Term
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleOptimize} 
                  disabled={isOptimizing}
                  className="w-full sm:w-auto"
                >
                  {isOptimizing ? 'Optimizing...' : 'Run Optimizer'}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Performance Comparison</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip content={<PerformanceTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="optimized" 
                      stroke="#10B981" 
                      strokeWidth={2} 
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="current" 
                      stroke="#3B82F6" 
                      strokeWidth={2} 
                      dot={false} 
                      activeDot={{ r: 6 }}
                    />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Expected Annual Return</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">
                          {stats.expectedReturn.current}%
                        </span>
                        {stats.expectedReturn.optimized && (
                          <Badge className="ml-2 bg-green-500/20 text-green-500 hover:bg-green-500/30">
                            {stats.expectedReturn.optimized}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-muted h-1">
                      <div className="bg-blue-500 h-1" style={{width: `${(stats.expectedReturn.current / 30) * 100}%`}}></div>
                    </div>
                    {stats.expectedReturn.optimized && (
                      <div className="bg-green-500 h-1 mt-0.5" style={{
                        width: `${(stats.expectedReturn.optimized / 30) * 100}%`,
                        marginLeft: "auto"
                      }}></div>
                    )}
                  </div>
                  
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Risk (Volatility)</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">
                          {stats.risk.current}%
                        </span>
                        {stats.risk.optimized && (
                          <Badge className="ml-2 bg-green-500/20 text-green-500 hover:bg-green-500/30">
                            {stats.risk.optimized}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-muted h-1">
                      <div className="bg-blue-500 h-1" style={{width: `${(stats.risk.current / 40) * 100}%`}}></div>
                    </div>
                    {stats.risk.optimized && (
                      <div className="bg-green-500 h-1 mt-0.5" style={{
                        width: `${(stats.risk.optimized / 40) * 100}%`,
                        marginLeft: "auto"
                      }}></div>
                    )}
                  </div>
                  
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Sharpe Ratio</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">
                          {stats.sharpeRatio.current}
                        </span>
                        {stats.sharpeRatio.optimized && (
                          <Badge className="ml-2 bg-green-500/20 text-green-500 hover:bg-green-500/30">
                            {stats.sharpeRatio.optimized}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-muted h-1">
                      <div className="bg-blue-500 h-1" style={{width: `${(stats.sharpeRatio.current / 2) * 100}%`}}></div>
                    </div>
                    {stats.sharpeRatio.optimized && (
                      <div className="bg-green-500 h-1 mt-0.5" style={{
                        width: `${(stats.sharpeRatio.optimized / 2) * 100}%`,
                        marginLeft: "auto"
                      }}></div>
                    )}
                  </div>
                  
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Maximum Drawdown</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">
                          {stats.maxDrawdown.current}%
                        </span>
                        {stats.maxDrawdown.optimized && (
                          <Badge className="ml-2 bg-green-500/20 text-green-500 hover:bg-green-500/30">
                            {stats.maxDrawdown.optimized}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-muted h-1">
                      <div className="bg-blue-500 h-1" style={{width: `${(stats.maxDrawdown.current / 40) * 100}%`}}></div>
                    </div>
                    {stats.maxDrawdown.optimized && (
                      <div className="bg-green-500 h-1 mt-0.5" style={{
                        width: `${(stats.maxDrawdown.optimized / 40) * 100}%`,
                        marginLeft: "auto"
                      }}></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-md flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-500">Portfolio Insights</h4>
                <p className="text-sm mt-1">
                  The optimized allocation has a better risk-adjusted return (higher Sharpe ratio)
                  with 29% lower maximum drawdown. This means your portfolio should be less volatile
                  during market downturns while maintaining similar returns.
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <Button variant="default" className="w-full" onClick={handleOptimize}>
                {optimizedAllocation ? 'Re-Optimize Portfolio' : 'Run Portfolio Optimization'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="frontier" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Efficient Frontier</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={efficientFrontierData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="risk" 
                      type="number" 
                      name="Risk" 
                      domain={[0, 40]} 
                      label={{ value: 'Risk (%)', position: 'insideBottom', offset: -5 }} 
                    />
                    <YAxis 
                      dataKey="return" 
                      type="number" 
                      name="Return" 
                      domain={[0, 40]} 
                      label={{ value: 'Return (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="return" 
                      stroke="#3B82F6" 
                      strokeWidth={2} 
                      dot={false} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Understanding Efficient Frontier</h3>
                
                <div className="bg-muted/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <ChevronRight className="h-5 w-5 text-muted-foreground mr-1" />
                    What is the Efficient Frontier?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The Efficient Frontier represents the optimal portfolios that offer the highest expected
                    return for a defined level of risk. Portfolios below the curve are sub-optimal because
                    they don't provide enough return for the risk.
                  </p>
                </div>
                
                <div className="bg-muted/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <ChevronRight className="h-5 w-5 text-muted-foreground mr-1" />
                    Your Portfolio Position
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Your current portfolio (blue dot) has an estimated return of {stats.expectedReturn.current}% with a risk
                    level of {stats.risk.current}%. The optimized portfolio (green dot) aims to move closer to
                    the efficient frontier for better risk-adjusted returns.
                  </p>
                </div>
                
                <div className="bg-muted/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <ChevronRight className="h-5 w-5 text-muted-foreground mr-1" />
                    Market Assumptions
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    These projections are based on historical data and statistical models. Actual future
                    performance may differ due to changing market conditions. Our optimization algorithm
                    uses Monte Carlo simulations with thousands of possible market scenarios.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-md space-y-4">
              <h4 className="font-medium text-indigo-400">Strategy Recommendations</h4>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-card p-3 rounded-md border flex-1">
                  <div className="text-sm font-medium mb-1">Conservative</div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Lower risk approach with stable returns
                  </p>
                  <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">
                    9.5% Expected Return
                  </Badge>
                </div>
                
                <div className="bg-card p-3 rounded-md border flex-1">
                  <div className="text-sm font-medium mb-1">Balanced</div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Moderate risk with better return potential
                  </p>
                  <Badge className="bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500/30">
                    14.2% Expected Return
                  </Badge>
                </div>
                
                <div className="bg-card p-3 rounded-md border flex-1">
                  <div className="text-sm font-medium mb-1">Aggressive</div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Higher risk approach for maximum returns
                  </p>
                  <Badge className="bg-purple-500/20 text-purple-500 hover:bg-purple-500/30">
                    24.8% Expected Return
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PortfolioOptimizer;
