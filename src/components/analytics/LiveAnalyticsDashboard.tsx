
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, RefreshCw, Activity } from 'lucide-react';

const LiveAnalyticsDashboard: React.FC = () => {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateMockData();
    const interval = setInterval(generateMockData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const generateMockData = () => {
    const symbols = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'];
    const data = symbols.map(symbol => {
      const basePrice = symbol === 'BTC' ? 64500 : symbol === 'ETH' ? 3500 : 150;
      const change = (Math.random() - 0.5) * 10;
      
      return {
        symbol,
        price: basePrice * (1 + change / 100),
        change_24h: change,
        volume: Math.random() * 1000000000,
        market_cap: basePrice * Math.random() * 1000000,
        updated_at: new Date().toLocaleTimeString()
      };
    });

    setMarketData(data);
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      generateMockData();
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Market Analytics</h2>
          <p className="text-muted-foreground">Real-time cryptocurrency market data and analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            <Activity className="h-3 w-3 mr-1 animate-pulse" />
            Live Data
          </Badge>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {marketData.map(coin => (
          <Card key={coin.symbol}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{coin.symbol}</p>
                  <p className="text-xl font-bold">{formatCurrency(coin.price)}</p>
                </div>
                <div className="text-right">
                  <div className={`flex items-center ${coin.change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {coin.change_24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="ml-1 text-sm font-medium">
                      {coin.change_24h >= 0 ? '+' : ''}{coin.change_24h.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{coin.updated_at}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>24-hour price movements</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="symbol" />
                <YAxis tickFormatter={(value) => `$${value.toFixed(0)}`} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), 'Price']}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Performance</CardTitle>
            <CardDescription>24-hour percentage changes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="symbol" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  formatter={(value) => [`${(value as number).toFixed(2)}%`, '24h Change']}
                />
                <Line 
                  type="monotone" 
                  dataKey="change_24h" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Market Statistics</CardTitle>
          <CardDescription>Detailed market metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Asset</th>
                  <th className="text-right p-2">Price (AUD)</th>
                  <th className="text-right p-2">24h Change</th>
                  <th className="text-right p-2">Volume</th>
                  <th className="text-right p-2">Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map(coin => (
                  <tr key={coin.symbol} className="border-b">
                    <td className="p-2 font-medium">{coin.symbol}</td>
                    <td className="p-2 text-right">{formatCurrency(coin.price)}</td>
                    <td className={`p-2 text-right ${coin.change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {coin.change_24h >= 0 ? '+' : ''}{coin.change_24h.toFixed(2)}%
                    </td>
                    <td className="p-2 text-right">{formatCurrency(coin.volume)}</td>
                    <td className="p-2 text-right">{formatCurrency(coin.market_cap)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveAnalyticsDashboard;
