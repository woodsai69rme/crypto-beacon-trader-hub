
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PriceCorrelationChartProps } from '@/types/trading';

const PriceCorrelationChart: React.FC<PriceCorrelationChartProps> = ({ coins }) => {
  // Generate mock correlation data for visualization
  const generateCorrelationData = () => {
    const data = [];
    
    for (let i = 0; i < coins.length; i++) {
      for (let j = i + 1; j < coins.length; j++) {
        const correlation = (Math.random() * 2 - 1); // Random correlation between -1 and 1
        const volatility = Math.random() * 50 + 10; // Random volatility
        
        data.push({
          x: correlation,
          y: volatility,
          z: Math.random() * 100 + 50, // Size of bubble
          coin1: coins[i].symbol,
          coin2: coins[j].symbol,
          name: `${coins[i].symbol}-${coins[j].symbol}`
        });
      }
    }
    
    return data;
  };

  const correlationData = generateCorrelationData();

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="text-sm mb-4">
          <p>Price correlation vs volatility chart</p>
          <p className="text-xs text-muted-foreground">
            X-axis: Correlation coefficient (-1 to 1), Y-axis: Volatility (%), Bubble size: Market cap
          </p>
        </div>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                type="number" 
                dataKey="x" 
                domain={[-1, 1]} 
                tickFormatter={(value) => value.toFixed(1)}
                label={{ value: 'Correlation', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                domain={[0, 60]}
                tickFormatter={(value) => `${value.toFixed(0)}%`}
                label={{ value: 'Volatility (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'x') return [value.toFixed(3), 'Correlation'];
                  if (name === 'y') return [`${value.toFixed(1)}%`, 'Volatility'];
                  return [value, name];
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return `${payload[0].payload.name}`;
                  }
                  return label;
                }}
              />
              <Legend />
              <Scatter
                name="Asset Pairs"
                data={correlationData}
                fill="#3b82f6"
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>• Strong positive correlation (≥0.7): Assets tend to move in the same direction</p>
          <p>• Weak correlation (-0.3 to 0.3): Assets move relatively independently</p>
          <p>• Strong negative correlation (≤-0.7): Assets tend to move in opposite directions</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceCorrelationChart;
