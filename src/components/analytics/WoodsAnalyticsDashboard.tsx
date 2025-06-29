
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, 
  BarChart3, PieChart as PieChartIcon, Eye, Clock,
  AlertTriangle, CheckCircle, Target, Zap
} from 'lucide-react';

const WoodsAnalyticsDashboard: React.FC = () => {
  const [realTimeData, setRealTimeData] = useState<any>({});
  const [chartData, setChartData] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [tradeHistory, setTradeHistory] = useState<any[]>([]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      const now = new Date();
      const newDataPoint = {
        time: now.toLocaleTimeString(),
        profit: Math.random() * 1000 - 500,
        volume: Math.random() * 10000,
        price: 45000 + Math.random() * 5000,
        trades: Math.floor(Math.random() * 100)
      };

      setChartData(prev => [...prev.slice(-23), newDataPoint]);
      
      setRealTimeData({
        totalProfit: 15420.32 + Math.random() * 1000,
        dailyProfit: 1234.56 + Math.random() * 500,
        activeBots: 8 + Math.floor(Math.random() * 4),
        totalTrades: 2456 + Math.floor(Math.random() * 100),
        successRate: 68.5 + Math.random() * 10,
        avgTradeSize: 890.12 + Math.random() * 200,
        sharpeRatio: 1.85 + Math.random() * 0.5,
        maxDrawdown: 12.3 + Math.random() * 5,
        volume24h: 1250000 + Math.random() * 500000,
        roi: 24.8 + Math.random() * 10
      });

      // Simulate trade history
      if (Math.random() < 0.3) {
        const newTrade = {
          id: Date.now(),
          symbol: ['BTC', 'ETH', 'SOL', 'ADA'][Math.floor(Math.random() * 4)],
          type: Math.random() > 0.5 ? 'BUY' : 'SELL',
          amount: Math.random() * 1000,
          price: Math.random() * 50000,
          profit: (Math.random() - 0.5) * 200,
          timestamp: now.toISOString(),
          bot: `Bot-${Math.floor(Math.random() * 12) + 1}`
        };
        setTradeHistory(prev => [newTrade, ...prev.slice(0, 49)]);
      }
    }, 2000);

    // Initialize performance data
    setPerformanceData([
      { name: 'Trend Following', profit: 2340, trades: 156, winRate: 68 },
      { name: 'Mean Reversion', profit: 1890, trades: 134, winRate: 72 },
      { name: 'Breakout', profit: 3210, trades: 89, winRate: 59 },
      { name: 'Scalping', profit: 1560, trades: 234, winRate: 75 },
      { name: 'Arbitrage', profit: 890, trades: 67, winRate: 92 },
      { name: 'Grid Trading', profit: 1234, trades: 112, winRate: 65 }
    ]);

    return () => clearInterval(interval);
  }, []);

  const pieData = [
    { name: 'Bitcoin', value: 35, color: '#f7931a' },
    { name: 'Ethereum', value: 25, color: '#627eea' },
    { name: 'Solana', value: 15, color: '#9945ff' },
    { name: 'Cardano', value: 12, color: '#0033ad' },
    { name: 'Others', value: 13, color: '#64748b' }
  ];

  return (
    <div className="space-y-6">
      {/* Real-Time KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Profit</p>
                <p className="text-2xl font-bold text-green-600">
                  ${realTimeData.totalProfit?.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-green-600">
                  +${realTimeData.dailyProfit?.toFixed(2) || '0.00'} today
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{realTimeData.successRate?.toFixed(1) || '0.0'}%</p>
                <Progress value={realTimeData.successRate || 0} className="h-2 mt-2" />
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">{realTimeData.activeBots || 0}</p>
                <p className="text-xs text-muted-foreground">
                  {realTimeData.totalTrades || 0} total trades
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sharpe Ratio</p>
                <p className="text-2xl font-bold">{realTimeData.sharpeRatio?.toFixed(2) || '0.00'}</p>
                <p className="text-xs text-muted-foreground">
                  Max DD: {realTimeData.maxDrawdown?.toFixed(1) || '0.0'}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trades">Live Trades</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-Time P&L Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">24h Volume</span>
                  <span className="font-semibold">${realTimeData.volume24h?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">ROI</span>
                  <span className="font-semibold text-green-600">{realTimeData.roi?.toFixed(1) || '0.0'}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg Trade Size</span>
                  <span className="font-semibold">${realTimeData.avgTradeSize?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Trades</span>
                  <span className="font-semibold">{realTimeData.totalTrades?.toLocaleString() || '0'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Status</span>
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Feed</span>
                  <Badge variant="default" className="bg-green-500">
                    <Zap className="h-3 w-3 mr-1" />
                    Real-time
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Trading Engine</span>
                  <Badge variant="default" className="bg-green-500">
                    <Activity className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Risk Monitor</span>
                  <Badge variant="default" className="bg-green-500">
                    <Eye className="h-3 w-3 mr-1" />
                    Monitoring
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="profit" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Trade Feed - Woods Standard</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {tradeHistory.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant={trade.type === 'BUY' ? 'default' : 'destructive'}>
                          {trade.type}
                        </Badge>
                        <span className="font-semibold">{trade.symbol}</span>
                        <span className="text-sm text-muted-foreground">{trade.bot}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ${trade.amount.toFixed(2)} @ ${trade.price.toFixed(2)}
                        </div>
                        <div className={`text-sm ${trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(trade.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pieData.map((asset) => (
                    <div key={asset.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: asset.color }}
                        />
                        <span className="text-sm">{asset.name}</span>
                      </div>
                      <span className="font-semibold">{asset.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Value at Risk (1%)</span>
                  <span className="font-semibold text-red-600">-$1,250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Beta</span>
                  <span className="font-semibold">1.15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Correlation to BTC</span>
                  <span className="font-semibold">0.78</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Volatility</span>
                  <span className="font-semibold">32.5%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts & Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center p-3 border-l-4 border-l-green-500 bg-green-50 rounded-r">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-semibold">Trade Executed Successfully</p>
                    <p className="text-sm text-muted-foreground">Bot-3 executed BUY order for 0.5 BTC</p>
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground">2 min ago</span>
                </div>
                
                <div className="flex items-center p-3 border-l-4 border-l-yellow-500 bg-yellow-50 rounded-r">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
                  <div>
                    <p className="font-semibold">Risk Threshold Warning</p>
                    <p className="text-sm text-muted-foreground">Portfolio risk approaching 15% limit</p>
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground">5 min ago</span>
                </div>
                
                <div className="flex items-center p-3 border-l-4 border-l-blue-500 bg-blue-50 rounded-r">
                  <Eye className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <p className="font-semibold">Market Opportunity Detected</p>
                    <p className="text-sm text-muted-foreground">Arbitrage opportunity on ETH/USDT pair</p>
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground">8 min ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WoodsAnalyticsDashboard;
