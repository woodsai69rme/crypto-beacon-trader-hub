
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EnhancedPortfolioBenchmarkingProps } from '@/types/trading';

const EnhancedPortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({ portfolioPerformance }) => {
  const defaultPerformance = {
    daily: 2.5,
    weekly: 8.3,
    monthly: 15.2,
    yearly: 42.1,
    allTime: 75.4
  };
  
  const performance = portfolioPerformance || defaultPerformance;
  
  // Generate mock comparison data
  const generateComparisonData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Portfolio performance starts at base 100 and adds some randomness plus overall trend
      const portfolioBase = 100 + (30 - i) * (performance.monthly / 30);
      const portfolioValue = portfolioBase + (Math.random() * 2 - 1);
      
      // S&P and Bitcoin correlate somewhat but with different volatility
      const spValue = 100 + (30 - i) * (performance.monthly / 45) + (Math.random() * 1 - 0.5);
      const btcValue = 100 + (30 - i) * (performance.monthly / 25) + (Math.random() * 4 - 2);
      
      data.push({
        date: date.toLocaleDateString(),
        portfolio: parseFloat(portfolioValue.toFixed(2)),
        sp500: parseFloat(spValue.toFixed(2)),
        bitcoin: parseFloat(btcValue.toFixed(2))
      });
    }
    
    return data;
  };
  
  const benchmarkData = generateComparisonData();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Benchmarking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Portfolio</div>
            <div className="text-lg font-bold text-green-500">+{performance.monthly.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">30 days</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">S&P 500</div>
            <div className="text-lg font-bold">{(performance.monthly * 0.65).toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">30 days</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Bitcoin</div>
            <div className="text-lg font-bold">{(performance.monthly * 1.2).toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">30 days</div>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={benchmarkData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }}
                tickLine={false}
                minTickGap={20}
              />
              <YAxis 
                tickFormatter={(value) => `${value}`}
                tick={{ fontSize: 10 }}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip 
                formatter={(value) => [`${value}`, '']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="portfolio" 
                name="Your Portfolio" 
                stroke="#4ADE80" 
                dot={false}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="sp500" 
                name="S&P 500" 
                stroke="#94A3B8" 
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="bitcoin" 
                name="Bitcoin" 
                stroke="#F59E0B" 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center mt-4">
          <div className="p-3 border rounded-md">
            <div className="text-sm font-medium">vs. S&P 500</div>
            <div className={`text-lg font-bold ${performance.monthly > performance.monthly * 0.65 ? 'text-green-500' : 'text-red-500'}`}>
              {performance.monthly > performance.monthly * 0.65 ? '+' : ''}{(performance.monthly - performance.monthly * 0.65).toFixed(1)}%
            </div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="text-sm font-medium">vs. Bitcoin</div>
            <div className={`text-lg font-bold ${performance.monthly > performance.monthly * 1.2 ? 'text-green-500' : 'text-red-500'}`}>
              {performance.monthly > performance.monthly * 1.2 ? '+' : ''}{(performance.monthly - performance.monthly * 1.2).toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
