
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PriceCorrelationChartProps } from '@/types/trading';

const PriceCorrelationChart: React.FC<PriceCorrelationChartProps> = ({
  coins,
  asset1Data,
  asset2Data,
  asset1Symbol = 'Asset 1',
  asset2Symbol = 'Asset 2'
}) => {
  const chartData = useMemo(() => {
    if (!asset1Data || !asset2Data) return [];
    
    // Combine data by timestamp
    const combinedData = asset1Data.map((item1) => {
      const item2 = asset2Data.find(item => item.timestamp === item1.timestamp);
      return {
        timestamp: item1.timestamp,
        asset1Price: item1.price,
        asset2Price: item2?.price || null,
        date: new Date(item1.timestamp).toLocaleDateString()
      };
    }).filter(item => item.asset1Price && item.asset2Price);
    
    return combinedData;
  }, [asset1Data, asset2Data]);
  
  const correlation = useMemo(() => {
    if (chartData.length < 2) return 0;
    
    const asset1Prices = chartData.map(d => d.asset1Price);
    const asset2Prices = chartData.map(d => d.asset2Price);
    
    const n = asset1Prices.length;
    const sum1 = asset1Prices.reduce((a, b) => a + b, 0);
    const sum2 = asset2Prices.reduce((a, b) => a + b, 0);
    const sum1Sq = asset1Prices.reduce((a, b) => a + b * b, 0);
    const sum2Sq = asset2Prices.reduce((a, b) => a + b * b, 0);
    const sum12 = asset1Prices.reduce((a, b, i) => a + b * asset2Prices[i], 0);
    
    const numerator = n * sum12 - sum1 * sum2;
    const denominator = Math.sqrt((n * sum1Sq - sum1 * sum1) * (n * sum2Sq - sum2 * sum2));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Correlation Analysis</CardTitle>
        <CardDescription>
          Price movement correlation between {asset1Symbol} and {asset2Symbol}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {correlation.toFixed(3)}
            </div>
            <div className="text-sm text-muted-foreground">
              Correlation Coefficient
            </div>
            <div className="text-xs mt-1">
              {Math.abs(correlation) > 0.7 ? 'Strong' : 
               Math.abs(correlation) > 0.3 ? 'Moderate' : 'Weak'} {' '}
              {correlation > 0 ? 'Positive' : 'Negative'} Correlation
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                yAxisId="left"
                fontSize={12}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                fontSize={12}
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `$${Number(value).toLocaleString()}`,
                  name
                ]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="asset1Price"
                stroke="#8884d8"
                strokeWidth={2}
                name={asset1Symbol}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="asset2Price"
                stroke="#82ca9d"
                strokeWidth={2}
                name={asset2Symbol}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-blue-50 rounded">
            <div className="font-medium text-blue-800">{asset1Symbol}</div>
            <div className="text-blue-600">
              Latest: ${chartData[chartData.length - 1]?.asset1Price?.toLocaleString() || 'N/A'}
            </div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="font-medium text-green-800">{asset2Symbol}</div>
            <div className="text-green-600">
              Latest: ${chartData[chartData.length - 1]?.asset2Price?.toLocaleString() || 'N/A'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceCorrelationChart;
