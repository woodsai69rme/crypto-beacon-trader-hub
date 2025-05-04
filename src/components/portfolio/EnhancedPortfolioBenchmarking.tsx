
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EnhancedPortfolioBenchmarkingProps } from '@/types/trading';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EnhancedPortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({ 
  portfolioPerformance, 
  portfolioDates 
}) => {
  // Prepare data for the chart
  const chartData = portfolioPerformance.map((performance, index) => ({
    date: portfolioDates[index],
    portfolio: performance,
    btc: Math.random() * 10 - 3, // Mock data for BTC performance
    sp500: Math.random() * 5 - 1, // Mock data for S&P 500 performance
    gold: Math.random() * 3  // Mock data for Gold performance
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Portfolio Performance Benchmarking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="portfolio" 
                stroke="#8884d8" 
                name="Your Portfolio" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="btc" 
                stroke="#F7931A" 
                name="Bitcoin" 
              />
              <Line 
                type="monotone" 
                dataKey="sp500" 
                stroke="#82ca9d" 
                name="S&P 500" 
              />
              <Line 
                type="monotone" 
                dataKey="gold" 
                stroke="#FFD700" 
                name="Gold" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
