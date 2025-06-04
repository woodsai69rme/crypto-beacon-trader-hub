
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  Bot, 
  Wallet,
  DollarSign,
  PieChart,
  LineChart,
  Target
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import TradingDashboard from '@/components/TradingDashboard';
import ComprehensiveTradingDashboard from '@/components/trading/ComprehensiveTradingDashboard';
import PortfolioHistoryChart from '@/components/trading/PortfolioHistoryChart';

const TradingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for charts
  const priceData = [
    { time: '09:00', price: 65000, volume: 1200 },
    { time: '10:00', price: 65500, volume: 1800 },
    { time: '11:00', price: 64800, volume: 2200 },
    { time: '12:00', price: 66200, volume: 1600 },
    { time: '13:00', price: 67100, volume: 2400 },
    { time: '14:00', price: 66800, volume: 1900 },
    { time: '15:00', price: 68200, volume: 2800 },
    { time: '16:00', price: 67900, volume: 2100 }
  ];

  const portfolioData = [
    { name: 'BTC', value: 45, color: '#F7931A' },
    { name: 'ETH', value: 25, color: '#627EEA' },
    { name: 'ADA', value: 15, color: '#0033AD' },
    { name: 'SOL', value: 10, color: '#00D4AA' },
    { name: 'Others', value: 5, color: '#8B5CF6' }
  ];

  const performanceData = [
    { date: 'Jan', portfolio: 100000, benchmark: 100000 },
    { date: 'Feb', portfolio: 105000, benchmark: 102000 },
    { date: 'Mar', portfolio: 98000, benchmark: 99000 },
    { date: 'Apr', portfolio: 112000, benchmark: 105000 },
    { date: 'May', portfolio: 125000, benchmark: 108000 },
    { date: 'Jun', portfolio: 135000, benchmark: 115000 }
  ];

  const tradingVolume = [
    { hour: '00', volume: 12000 },
    { hour: '04', volume: 8000 },
    { hour: '08', volume: 25000 },
    { hour: '12', volume: 35000 },
    { hour: '16', volume: 42000 },
    { hour: '20', volume: 18000 }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Trading</h1>
          <p className="text-muted-foreground">
            Professional crypto trading with real-time analytics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="default" className="bg-green-100 text-green-800">
            <Activity className="h-3 w-3 mr-1" />
            Live Market Data
          </Badge>
          <Badge variant="outline">AUD Default</Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
                <p className="text-2xl font-bold">$135,247</p>
                <p className="text-sm text-green-600">+12.4% today</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">24h Volume</p>
                <p className="text-2xl font-bold">$47,892</p>
                <p className="text-sm text-blue-600">+8.2% vs avg</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Trades</p>
                <p className="text-2xl font-bold">17</p>
                <p className="text-sm text-purple-600">5 pending</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">P&L Today</p>
                <p className="text-2xl font-bold">+$2,847</p>
                <p className="text-sm text-green-600">+2.1% gain</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Trading Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="ai-bots">AI Bots</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Bitcoin Price (AUD)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceData}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F7931A" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#F7931A" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Price']} />
                      <Area type="monotone" dataKey="price" stroke="#F7931A" fillOpacity={1} fill="url(#colorPrice)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Allocation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Portfolio Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={portfolioData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {portfolioData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio vs Benchmark Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                    <Line type="monotone" dataKey="portfolio" stroke="#8B5CF6" strokeWidth={3} name="Your Portfolio" />
                    <Line type="monotone" dataKey="benchmark" stroke="#64748B" strokeWidth={2} strokeDasharray="5 5" name="Market Benchmark" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Volume Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Trading Volume (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tradingVolume}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Volume']} />
                      <Bar dataKey="volume" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Market Depth */}
            <Card>
              <CardHeader>
                <CardTitle>Market Depth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium">Market Depth Chart</p>
                    <p className="text-sm text-muted-foreground">
                      Real-time order book visualization
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <PortfolioHistoryChart data={[]} currency="AUD" />
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <TradingDashboard />
        </TabsContent>

        <TabsContent value="ai-bots" className="space-y-6">
          <ComprehensiveTradingDashboard />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">73.5%</p>
                      <p className="text-sm text-muted-foreground">Win Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">2.4</p>
                      <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">-8.2%</p>
                      <p className="text-sm text-muted-foreground">Max Drawdown</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">1.8</p>
                      <p className="text-sm text-muted-foreground">Profit Factor</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Portfolio Beta</span>
                    <span className="font-medium">1.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volatility</span>
                    <span className="font-medium">18.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VaR (95%)</span>
                    <span className="font-medium text-red-600">-$2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Correlation</span>
                    <span className="font-medium">0.76</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingPage;
