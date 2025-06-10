
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Users, Zap } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const AdvancedAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('portfolio');

  // Mock data for analytics
  const portfolioData = [
    { date: '2024-01-01', value: 100000, btc: 45000, eth: 30000, others: 25000 },
    { date: '2024-01-02', value: 105000, btc: 47000, eth: 31000, others: 27000 },
    { date: '2024-01-03', value: 98000, btc: 43000, eth: 29000, others: 26000 },
    { date: '2024-01-04', value: 112000, btc: 50000, eth: 35000, others: 27000 },
    { date: '2024-01-05', value: 108000, btc: 48000, eth: 33000, others: 27000 },
    { date: '2024-01-06', value: 115000, btc: 52000, eth: 36000, others: 27000 },
    { date: '2024-01-07', value: 118000, btc: 53000, eth: 37000, others: 28000 }
  ];

  const tradingMetrics = {
    totalTrades: 1247,
    winRate: 68.5,
    totalVolume: 2850000,
    avgReturn: 12.3,
    sharpeRatio: 1.42,
    maxDrawdown: 8.7
  };

  const topPerformers = [
    { symbol: 'BTC', return: 28.5, volume: 1200000 },
    { symbol: 'ETH', return: 22.1, volume: 850000 },
    { symbol: 'SOL', return: 45.2, volume: 420000 },
    { symbol: 'ADA', return: 15.8, volume: 380000 }
  ];

  const aiBotsPerformance = [
    { name: 'Trend Following Bot', return: 24.5, trades: 89, winRate: 72 },
    { name: 'Mean Reversion Bot', return: 18.2, trades: 156, winRate: 65 },
    { name: 'Scalping Bot', return: 31.8, trades: 423, winRate: 58 },
    { name: 'Arbitrage Bot', return: 12.4, trades: 67, winRate: 89 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Advanced Analytics</h1>
        <div className="flex gap-2">
          {['1d', '7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
                <p className="text-2xl font-bold">{formatCurrency(118000)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18.0% (7d)
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{tradingMetrics.totalTrades}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Activity className="h-3 w-3 mr-1" />
                  {tradingMetrics.winRate}% Win Rate
                </p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  8 Profitable
                </p>
              </div>
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sharpe Ratio</p>
                <p className="text-2xl font-bold">{tradingMetrics.sharpeRatio}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Excellent
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="portfolio" className="space-y-4">
        <TabsList>
          <TabsTrigger value="portfolio">Portfolio Analysis</TabsTrigger>
          <TabsTrigger value="trading">Trading Performance</TabsTrigger>
          <TabsTrigger value="bots">AI Bots</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Value Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={portfolioData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [formatCurrency(value), 'Value']} />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Bitcoin', value: 45, fill: '#f7931a' },
                        { name: 'Ethereum', value: 30, fill: '#627eea' },
                        { name: 'Others', value: 25, fill: '#8b5cf6' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trading" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((asset, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{asset.symbol}</Badge>
                      <div>
                        <div className="font-medium">{formatCurrency(asset.volume)}</div>
                        <div className="text-sm text-muted-foreground">Volume</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-500">+{asset.return}%</div>
                      <div className="text-sm text-muted-foreground">Return</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Bot Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiBotsPerformance.map((bot, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{bot.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {bot.trades} trades • {bot.winRate}% win rate
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-500">+{bot.return}%</div>
                      <div className="text-sm text-muted-foreground">Return</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{tradingMetrics.sharpeRatio}</div>
                  <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-500">-{tradingMetrics.maxDrawdown}%</div>
                  <div className="text-sm text-muted-foreground">Max Drawdown</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{tradingMetrics.avgReturn}%</div>
                  <div className="text-sm text-muted-foreground">Avg Return</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
