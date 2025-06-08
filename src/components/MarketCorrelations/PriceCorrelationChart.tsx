
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PriceCorrelationChartProps } from '@/types/trading';

const PriceCorrelationChart: React.FC<PriceCorrelationChartProps> = ({
  coins,
  asset1Data = [],
  asset2Data = [],
  asset1Symbol = 'BTC',
  asset2Symbol = 'ETH'
}) => {
  // Combine data for correlation chart
  const correlationData = asset1Data.map((point, index) => ({
    timestamp: point.timestamp,
    asset1: point.price,
    asset2: asset2Data[index]?.price || 0,
    date: new Date(point.timestamp).toLocaleDateString()
  }));

  // Create scatter plot data for correlation analysis
  const scatterData = asset1Data.map((point, index) => ({
    x: point.price,
    y: asset2Data[index]?.price || 0
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Price Correlation Chart</CardTitle>
          <CardDescription>
            Compare price movements between {asset1Symbol} and {asset2Symbol}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `$${value.toLocaleString()}`,
                    name === 'asset1' ? asset1Symbol : asset2Symbol
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="asset1"
                  stroke="#f7931a"
                  strokeWidth={2}
                  name={asset1Symbol}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="asset2"
                  stroke="#627eea"
                  strokeWidth={2}
                  name={asset2Symbol}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scatter Plot Analysis</CardTitle>
          <CardDescription>
            Correlation scatter plot between {asset1Symbol} and {asset2Symbol}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={scatterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name={asset1Symbol}
                  fontSize={12}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name={asset2Symbol}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `$${value.toLocaleString()}`,
                    name === 'x' ? asset1Symbol : asset2Symbol
                  ]}
                />
                <Scatter 
                  name={`${asset1Symbol} vs ${asset2Symbol}`} 
                  data={scatterData} 
                  fill="#8884d8" 
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceCorrelationChart;
