
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedPortfolioBenchmarkingProps } from '@/types/trading';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EnhancedPortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({
  portfolioPerformance,
  portfolioDates
}) => {
  // Prepare data for chart
  const chartData = portfolioDates.map((date, index) => ({
    date: date,
    portfolio: portfolioPerformance[index],
    sp500: portfolioPerformance[index] * (Math.random() * 0.3 + 0.7), // Simulated S&P500 values
    btc: portfolioPerformance[index] * (Math.random() * 0.5 + 0.8), // Simulated BTC values
  }));

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Portfolio Benchmarking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card-bg, #222333)',
                  borderColor: 'var(--border-color, #333344)'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="portfolio" stroke="#8884d8" name="Your Portfolio" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="sp500" stroke="#82ca9d" name="S&P 500" />
              <Line type="monotone" dataKey="btc" stroke="#ffc658" name="Bitcoin" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="rounded-md bg-primary/10 p-2">
            <div className="font-bold text-lg">+12.4%</div>
            <div className="text-xs text-muted-foreground">Portfolio YTD</div>
          </div>
          <div className="rounded-md bg-green-500/10 p-2">
            <div className="font-bold text-lg">+6.8%</div>
            <div className="text-xs text-muted-foreground">S&P 500 YTD</div>
          </div>
          <div className="rounded-md bg-yellow-500/10 p-2">
            <div className="font-bold text-lg">+24.2%</div>
            <div className="text-xs text-muted-foreground">BTC YTD</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
