
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, Plus, RefreshCw } from 'lucide-react';
import { PortfolioAsset } from '@/types/trading';

const RealTimePortfolioTracker: React.FC = () => {
  const [portfolio, setPortfolio] = useState({
    totalValue: 125750.35,
    totalChange24h: 8234.12,
    totalChangePercent: 7.02,
    lastUpdated: new Date().toISOString(),
  });

  const [assets] = useState<PortfolioAsset[]>([
    {
      coinId: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 2.5,
      price: 45230.50,
      priceChange: 2150.30,
      changePercent24h: 4.98,
      value: 113076.25,
      allocation: 89.9
    },
    {
      coinId: 'ethereum', 
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 8.0,
      price: 3105.78,
      priceChange: 186.42,
      changePercent24h: 6.38,
      value: 24846.24,
      allocation: 19.8
    },
    {
      coinId: 'solana',
      symbol: 'SOL', 
      name: 'Solana',
      amount: 45.2,
      price: 95.67,
      priceChange: -2.34,
      changePercent24h: -2.39,
      value: 4324.28,
      allocation: 3.4
    }
  ]);

  const [performanceData] = useState([
    { date: '1d', value: 125750 },
    { date: '2d', value: 123200 },
    { date: '3d', value: 126800 },
    { date: '4d', value: 124500 },
    { date: '5d', value: 127200 },
    { date: '6d', value: 125900 },
    { date: '7d', value: 125750 }
  ]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  const refreshPortfolio = () => {
    // Simulate real-time price updates
    console.log('Refreshing portfolio data...');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setPortfolio(prev => ({
        ...prev,
        lastUpdated: new Date().toISOString()
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Portfolio Overview</CardTitle>
            <CardDescription>
              Real-time portfolio value and performance
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshPortfolio}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Total Value</span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(portfolio.totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(portfolio.lastUpdated).toLocaleTimeString()}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">24h Change</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(portfolio.totalChange24h)}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {formatPercent(portfolio.totalChangePercent)}
                </Badge>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Performance</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">+18.5%</div>
              <p className="text-xs text-muted-foreground">All-time return</p>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="h-64 mb-6">
            <h4 className="text-lg font-semibold mb-4">7-Day Performance</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 1000', 'dataMax + 1000']} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Portfolio Value']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Portfolio distribution by asset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assets}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="allocation"
                  >
                    {assets.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Allocation']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {assets.map((asset, index) => (
                <div key={asset.coinId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium">{asset.symbol}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{asset.allocation}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Holdings Detail */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Holdings</CardTitle>
              <CardDescription>Individual asset performance</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assets.map((asset) => (
                <div key={asset.coinId} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold">{asset.symbol}</div>
                      <Badge variant="outline">{asset.name}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(asset.value || 0)}</div>
                      <div className={`text-sm flex items-center gap-1 ${
                        (asset.changePercent24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(asset.changePercent24h || 0) >= 0 ? 
                          <TrendingUp className="h-3 w-3" /> : 
                          <TrendingDown className="h-3 w-3" />
                        }
                        {formatPercent(asset.changePercent24h || 0)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Holdings:</span>
                      <p className="font-medium">{asset.amount} {asset.symbol}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price:</span>
                      <p className="font-medium">{formatCurrency(asset.price)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Allocation</span>
                      <span>{asset.allocation}%</span>
                    </div>
                    <Progress value={asset.allocation} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimePortfolioTracker;
