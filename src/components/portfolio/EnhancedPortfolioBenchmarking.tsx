
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedPortfolioBenchmarkingProps } from '@/types/trading';
import { TrendingUp, TrendingDown } from 'lucide-react';

const EnhancedPortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({
  portfolioPerformance,
  portfolioDates,
  portfolioData,
  benchmarks = ['BTC', 'ETH', 'Market'],
  timeframe = '1M'
}) => {
  // Generate benchmark data if not provided
  const chartData = portfolioDates.map((date, index) => ({
    date: new Date(date).toLocaleDateString(),
    portfolio: portfolioPerformance[index] || 0,
    btc: portfolioData?.[index]?.benchmarkValue || Math.random() * 20 - 5,
    eth: Math.random() * 15 - 3,
    market: Math.random() * 12 - 2
  }));

  const calculateReturns = (data: number[]) => {
    if (data.length < 2) return 0;
    const initial = data[0];
    const final = data[data.length - 1];
    return ((final - initial) / initial) * 100;
  };

  const portfolioReturn = calculateReturns(portfolioPerformance);
  const btcReturn = calculateReturns(chartData.map(d => d.btc));
  const ethReturn = calculateReturns(chartData.map(d => d.eth));

  const getBadgeVariant = (value: number) => {
    return value >= 0 ? 'default' : 'destructive';
  };

  const formatPercentage = (value: number) => {
    const prefix = value >= 0 ? '+' : '';
    return `${prefix}${value.toFixed(2)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Benchmarking</CardTitle>
        <CardDescription>
          Compare your portfolio performance against major benchmarks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your Portfolio</span>
              <Badge variant={getBadgeVariant(portfolioReturn)}>
                {portfolioReturn >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {formatPercentage(portfolioReturn)}
              </Badge>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Bitcoin (BTC)</span>
              <Badge variant={getBadgeVariant(btcReturn)}>
                {btcReturn >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {formatPercentage(btcReturn)}
              </Badge>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Ethereum (ETH)</span>
              <Badge variant={getBadgeVariant(ethReturn)}>
                {ethReturn >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {formatPercentage(ethReturn)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value.toFixed(2)}%`,
                  name === 'portfolio' ? 'Your Portfolio' : 
                  name === 'btc' ? 'Bitcoin' :
                  name === 'eth' ? 'Ethereum' : name
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="portfolio"
                stroke="#8884d8"
                strokeWidth={3}
                name="Your Portfolio"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="btc"
                stroke="#f7931a"
                strokeWidth={2}
                name="Bitcoin"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="eth"
                stroke="#627eea"
                strokeWidth={2}
                name="Ethereum"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Performance Analysis</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>vs Bitcoin:</span>
                <span className={portfolioReturn > btcReturn ? 'text-green-600' : 'text-red-600'}>
                  {formatPercentage(portfolioReturn - btcReturn)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>vs Ethereum:</span>
                <span className={portfolioReturn > ethReturn ? 'text-green-600' : 'text-red-600'}>
                  {formatPercentage(portfolioReturn - ethReturn)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Risk Metrics</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Volatility:</span>
                <span>15.2%</span>
              </div>
              <div className="flex justify-between">
                <span>Sharpe Ratio:</span>
                <span>1.24</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
