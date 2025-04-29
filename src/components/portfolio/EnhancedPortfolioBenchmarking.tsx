
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EnhancedPortfolioBenchmarkingProps } from '@/types/trading';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EnhancedPortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({
  portfolioPerformance,
  portfolioDates
}) => {
  // Create data for chart
  const chartData = portfolioDates.map((date, index) => ({
    date,
    portfolio: portfolioPerformance[index],
    bitcoin: Math.random() * 20 - 5 + portfolioPerformance[index] * 0.8,  // Simulated benchmark data
    sp500: Math.random() * 10 - 2 + portfolioPerformance[index] * 0.5,    // Simulated benchmark data
  }));

  return (
    <Card className="w-full bg-card shadow-lg border border-border">
      <CardHeader className="bg-card/50 border-b border-border">
        <CardTitle className="text-foreground">Portfolio Performance Benchmarking</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis 
                dataKey="date" 
                className="fill-muted-foreground text-xs" 
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                className="fill-muted-foreground text-xs" 
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }} 
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="portfolio" 
                name="Your Portfolio" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2} 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="bitcoin" 
                name="Bitcoin" 
                stroke="#f7931a" 
                strokeWidth={1.5} 
              />
              <Line 
                type="monotone" 
                dataKey="sp500" 
                name="S&P 500" 
                stroke="#21ce99" 
                strokeWidth={1.5} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/5 p-4 rounded-lg border border-border">
            <div className="text-muted-foreground text-xs">Performance (YTD)</div>
            <div className="text-2xl font-bold text-primary">
              {portfolioPerformance[portfolioPerformance.length - 1].toFixed(2)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">vs Bitcoin: +3.45%</div>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg border border-border">
            <div className="text-muted-foreground text-xs">Volatility</div>
            <div className="text-2xl font-bold text-foreground">0.63</div>
            <div className="text-xs text-muted-foreground mt-1">Lower than market average</div>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg border border-border">
            <div className="text-muted-foreground text-xs">Sharpe Ratio</div>
            <div className="text-2xl font-bold text-foreground">1.87</div>
            <div className="text-xs text-muted-foreground mt-1">Risk-adjusted return</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
