
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calculator, TrendingUp, AlertTriangle, Zap, DollarSign } from 'lucide-react';
import { YieldFarmingPool } from '@/types/trading';

const YieldFarmingCalculator: React.FC = () => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(10000);
  const [timeframe, setTimeframe] = useState<string>('1year');
  const [selectedPool, setSelectedPool] = useState<string>('');
  const [calculations, setCalculations] = useState({
    estimatedRewards: 0,
    totalReturn: 0,
    apy: 0,
    impermanentLoss: 0,
    fees: 0,
    netProfit: 0
  });

  const [pools] = useState<YieldFarmingPool[]>([
    {
      id: 'uniswap-eth-usdc',
      protocol: 'Uniswap V3',
      tokenPair: 'ETH/USDC',
      apy: 24.5,
      tvl: 125000000,
      rewards: ['UNI', 'Fees'],
      risk: 'medium',
      blockchain: 'Ethereum'
    },
    {
      id: 'pancakeswap-bnb-busd',
      protocol: 'PancakeSwap',
      tokenPair: 'BNB/BUSD',
      apy: 35.8,
      tvl: 89000000,
      rewards: ['CAKE', 'Fees'],
      risk: 'high',
      blockchain: 'BSC'
    },
    {
      id: 'curve-3pool',
      protocol: 'Curve Finance',
      tokenPair: 'DAI/USDC/USDT',
      apy: 8.2,
      tvl: 245000000,
      rewards: ['CRV', 'Fees'],
      risk: 'low',
      blockchain: 'Ethereum'
    },
    {
      id: 'compound-usdc',
      protocol: 'Compound',
      tokenPair: 'USDC',
      apy: 5.4,
      tvl: 150000000,
      rewards: ['COMP'],
      risk: 'low',
      blockchain: 'Ethereum'
    },
    {
      id: 'aave-eth',
      protocol: 'Aave',
      tokenPair: 'ETH',
      apy: 12.1,
      tvl: 185000000,
      rewards: ['AAVE'],
      risk: 'medium',
      blockchain: 'Ethereum'
    }
  ]);

  const timeframes = [
    { value: '1month', label: '1 Month', multiplier: 1/12 },
    { value: '3months', label: '3 Months', multiplier: 0.25 },
    { value: '6months', label: '6 Months', multiplier: 0.5 },
    { value: '1year', label: '1 Year', multiplier: 1 },
    { value: '2years', label: '2 Years', multiplier: 2 }
  ];

  useEffect(() => {
    if (selectedPool && investmentAmount > 0) {
      calculateYield();
    }
  }, [selectedPool, investmentAmount, timeframe]);

  const calculateYield = () => {
    const pool = pools.find(p => p.id === selectedPool);
    const timeMultiplier = timeframes.find(t => t.value === timeframe)?.multiplier || 1;
    
    if (!pool) return;

    const annualRewards = investmentAmount * (pool.apy / 100);
    const timeAdjustedRewards = annualRewards * timeMultiplier;
    
    // Estimate impermanent loss based on volatility
    const impermanentLossPercent = pool.risk === 'high' ? 5 : pool.risk === 'medium' ? 2 : 0.5;
    const impermanentLoss = investmentAmount * (impermanentLossPercent / 100);
    
    // Platform fees (estimated)
    const fees = timeAdjustedRewards * 0.02; // 2% of rewards
    
    const netProfit = timeAdjustedRewards - impermanentLoss - fees;
    const totalReturn = investmentAmount + netProfit;

    setCalculations({
      estimatedRewards: timeAdjustedRewards,
      totalReturn,
      apy: pool.apy,
      impermanentLoss,
      fees,
      netProfit
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const formatTVL = (tvl: number) => {
    return `$${(tvl / 1000000).toFixed(1)}M`;
  };

  // Chart data
  const profitBreakdown = [
    { name: 'Rewards', value: calculations.estimatedRewards, color: '#10b981' },
    { name: 'IL Loss', value: -calculations.impermanentLoss, color: '#ef4444' },
    { name: 'Fees', value: -calculations.fees, color: '#f59e0b' }
  ];

  const comparisonData = pools.map(pool => ({
    name: pool.protocol,
    apy: pool.apy,
    tvl: pool.tvl / 1000000,
    risk: pool.risk
  }));

  return (
    <div className="space-y-6">
      {/* Calculator Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            DeFi Yield Farming Calculator
          </CardTitle>
          <CardDescription>
            Optimize your yield farming strategies with detailed projections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Investment Amount (AUD)</Label>
              <Input
                id="amount"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                placeholder="Enter amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeframe">Investment Period</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map(tf => (
                    <SelectItem key={tf.value} value={tf.value}>
                      {tf.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pool">Select Pool</Label>
              <Select value={selectedPool} onValueChange={setSelectedPool}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a pool" />
                </SelectTrigger>
                <SelectContent>
                  {pools.map(pool => (
                    <SelectItem key={pool.id} value={pool.id}>
                      {pool.protocol} - {pool.tokenPair} ({pool.apy}% APY)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedPool && (
            <Button onClick={calculateYield} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Yield
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {calculations.netProfit !== 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Yield Projections</CardTitle>
              <CardDescription>Expected returns and costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Estimated Rewards</span>
                    </div>
                    <div className="text-xl font-bold text-green-800">
                      {formatCurrency(calculations.estimatedRewards)}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">Total Return</span>
                    </div>
                    <div className="text-xl font-bold text-blue-800">
                      {formatCurrency(calculations.totalReturn)}
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-700">Impermanent Loss</span>
                    </div>
                    <div className="text-xl font-bold text-red-800">
                      {formatCurrency(calculations.impermanentLoss)}
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">Net Profit</span>
                    </div>
                    <div className="text-xl font-bold text-purple-800">
                      {formatCurrency(calculations.netProfit)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Annual APY:</span>
                    <span className="font-medium">{calculations.apy}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform Fees:</span>
                    <span className="font-medium">{formatCurrency(calculations.fees)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>ROI:</span>
                    <span className="font-medium">
                      {((calculations.netProfit / investmentAmount) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profit Breakdown</CardTitle>
              <CardDescription>Visual breakdown of returns vs costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profitBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(Math.abs(value)), 'Amount']}
                    />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pool Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Available Yield Farming Pools</CardTitle>
          <CardDescription>Compare different protocols and their offerings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pools.map((pool) => (
              <div 
                key={pool.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPool === pool.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedPool(pool.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{pool.protocol}</h4>
                  <Badge className={getRiskColor(pool.risk)}>
                    {pool.risk}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pair:</span>
                    <span className="font-medium">{pool.tokenPair}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>APY:</span>
                    <span className="font-bold text-green-600">{pool.apy}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>TVL:</span>
                    <span className="font-medium">{formatTVL(pool.tvl)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Chain:</span>
                    <span className="font-medium">{pool.blockchain}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-xs text-muted-foreground">Rewards:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {pool.rewards.map((reward) => (
                      <Badge key={reward} variant="outline" className="text-xs">
                        {reward}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Protocol Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Protocol APY Comparison</CardTitle>
          <CardDescription>Compare annual percentage yields across protocols</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'apy') return [`${value}%`, 'APY'];
                    if (name === 'tvl') return [`$${value}M`, 'TVL'];
                    return [value, name];
                  }}
                />
                <Bar dataKey="apy" fill="#10b981" name="APY" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YieldFarmingCalculator;
