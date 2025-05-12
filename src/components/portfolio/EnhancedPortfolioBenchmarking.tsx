
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { EnhancedPortfolioBenchmarkingProps } from '@/types/trading';

const EnhancedPortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({
  portfolioPerformance,
  portfolioDates
}) => {
  // Generate S&P 500 and BTC performance with some correlation to portfolio
  const generateComparisonData = () => {
    // Create mock data for comparison
    const basePerformance = [...portfolioPerformance];
    
    // Generate S&P data with some correlation but lower volatility
    const spPerformance = basePerformance.map(val => {
      const correlation = 0.7; // 70% correlation
      const volatility = 0.4; // 40% of the volatility
      
      // Random component that's partially correlated
      const randomComponent = (Math.random() - 0.48) * volatility;
      const correlatedComponent = val * correlation;
      
      return correlatedComponent + randomComponent;
    });
    
    // Generate BTC data with some correlation but higher volatility
    const btcPerformance = basePerformance.map(val => {
      const correlation = 0.6; // 60% correlation
      const volatility = 2.0; // 200% of the volatility
      
      // Random component that's partially correlated
      const randomComponent = (Math.random() - 0.48) * volatility;
      const correlatedComponent = val * correlation;
      
      return correlatedComponent + randomComponent;
    });
    
    // Compile data for chart
    return portfolioDates.map((date, idx) => ({
      date,
      portfolio: portfolioPerformance[idx],
      sp500: spPerformance[idx],
      btc: btcPerformance[idx]
    }));
  };
  
  const chartData = generateComparisonData();
  
  // Calculate overall performance metrics
  const calculatePerformance = (data: number[]) => {
    const start = data[0];
    const end = data[data.length - 1];
    const totalReturn = ((end - start) / start) * 100;
    
    // Calculate volatility (standard deviation of daily returns)
    let sumSquaredDiffs = 0;
    let previousValue = data[0];
    
    for (let i = 1; i < data.length; i++) {
      const dailyReturn = (data[i] - previousValue) / previousValue;
      sumSquaredDiffs += dailyReturn * dailyReturn;
      previousValue = data[i];
    }
    
    const variance = sumSquaredDiffs / (data.length - 1);
    const volatility = Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized volatility
    
    // Calculate Sharpe ratio (assuming risk-free rate of 2%)
    const riskFreeRate = 2;
    const sharpeRatio = (totalReturn - riskFreeRate) / volatility;
    
    return {
      totalReturn: totalReturn.toFixed(2),
      volatility: volatility.toFixed(2),
      sharpeRatio: sharpeRatio.toFixed(2)
    };
  };
  
  const portfolioStats = calculatePerformance(portfolioPerformance);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Portfolio Benchmarking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value.toFixed(2)}%`}
              />
              <Tooltip 
                formatter={(value: number) => `${value.toFixed(2)}%`}
                labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="portfolio" 
                stroke="#8884d8" 
                name="Your Portfolio"
                dot={false}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="sp500" 
                stroke="#82ca9d" 
                name="S&P 500"
                dot={false}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="btc" 
                stroke="#ff7300" 
                name="Bitcoin"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded-md p-3">
            <div className="text-sm text-muted-foreground">Total Return</div>
            <div className={`text-lg font-bold ${
              parseFloat(portfolioStats.totalReturn) >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {portfolioStats.totalReturn}%
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-sm text-muted-foreground">Volatility</div>
            <div className="text-lg font-bold">{portfolioStats.volatility}%</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
            <div className="text-lg font-bold">{portfolioStats.sharpeRatio}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
