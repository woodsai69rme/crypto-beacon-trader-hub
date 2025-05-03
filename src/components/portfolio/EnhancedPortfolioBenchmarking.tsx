
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EnhancedPortfolioBenchmarkingProps } from '@/types/trading';

const EnhancedPortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({ portfolioPerformance, portfolioDates }) => {
  // Mock benchmark data
  const bitcoinPerformance = portfolioDates.map((date, i) => {
    // Bitcoin as benchmark - simulated to slightly underperform the portfolio
    return portfolioPerformance[i] * (0.9 + Math.random() * 0.2);
  });
  
  const sp500Performance = portfolioDates.map((date, i) => {
    // S&P 500 as benchmark - simulated to significantly underperform crypto
    return portfolioPerformance[i] * (0.5 + Math.random() * 0.2);
  });
  
  // Format data for the chart
  const chartData = portfolioPerformance.map((value, i) => ({
    date: portfolioDates[i],
    portfolio: value,
    bitcoin: bitcoinPerformance[i],
    sp500: sp500Performance[i]
  }));
  
  // Calculate overall performance
  const portfolioGrowth = ((portfolioPerformance[portfolioPerformance.length - 1] / portfolioPerformance[0]) - 1) * 100;
  const bitcoinGrowth = ((bitcoinPerformance[bitcoinPerformance.length - 1] / bitcoinPerformance[0]) - 1) * 100;
  const sp500Growth = ((sp500Performance[sp500Performance.length - 1] / sp500Performance[0]) - 1) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance Benchmarking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis 
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  domain={['dataMin * 0.95', 'dataMax * 1.05']}
                />
                <Tooltip 
                  formatter={(value) => [`$${(value as number).toLocaleString()}`, ""]}
                  labelFormatter={(value) => `Date: ${value}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="portfolio" 
                  name="Your Portfolio" 
                  stroke="#4ADE80" 
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="bitcoin" 
                  name="Bitcoin" 
                  stroke="#F7931A"
                  strokeWidth={1.5}
                />
                <Line 
                  type="monotone" 
                  dataKey="sp500" 
                  name="S&P 500" 
                  stroke="#0066CC"
                  strokeWidth={1.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Your Portfolio</div>
              <div className="text-2xl font-bold text-green-500">+{portfolioGrowth.toFixed(2)}%</div>
            </div>
            
            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Bitcoin</div>
              <div className={`text-2xl font-bold ${bitcoinGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {bitcoinGrowth >= 0 ? '+' : ''}{bitcoinGrowth.toFixed(2)}%
              </div>
            </div>
            
            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="text-sm text-muted-foreground">S&P 500</div>
              <div className={`text-2xl font-bold ${sp500Growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {sp500Growth >= 0 ? '+' : ''}{sp500Growth.toFixed(2)}%
              </div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Performance Analysis: Your portfolio has {portfolioGrowth > bitcoinGrowth ? 'outperformed' : 'underperformed'} Bitcoin by {Math.abs(portfolioGrowth - bitcoinGrowth).toFixed(2)}% and the S&P 500 by {Math.abs(portfolioGrowth - sp500Growth).toFixed(2)}% during this period.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
