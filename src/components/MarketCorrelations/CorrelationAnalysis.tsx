
import React from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { CryptoData } from '@/types/trading';

const CorrelationAnalysis: React.FC<{ data: CryptoData[] }> = ({ data }) => {
  // Extract market cap and volume data for scatter plot
  const scatterData = data.map(coin => ({
    name: coin.name,
    marketCap: coin.marketCap || 0,
    volume: coin.volume || 0,
    price: coin.price,
    symbol: coin.symbol,
    changePercent: coin.changePercent
  }));

  // Colors for the scatter points based on price change percentage
  const getPointColor = (changePercent: number) => {
    if (changePercent > 2) return '#4ADE80';
    if (changePercent > 0) return '#34D399';
    if (changePercent > -2) return '#F87171';
    return '#EF4444';
  };

  // Format numbers to be more readable
  const formatValue = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  // Custom tooltip to show additional information
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-md shadow-lg p-3 text-xs">
          <p className="font-bold">{data.name} ({data.symbol})</p>
          <p className="text-muted-foreground">Market Cap: {formatValue(data.marketCap)}</p>
          <p className="text-muted-foreground">Volume: {formatValue(data.volume)}</p>
          <p className="text-muted-foreground">Price: ${data.price.toFixed(2)}</p>
          <p className={data.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}>
            Change: {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            type="number" 
            dataKey="marketCap" 
            name="Market Cap" 
            domain={['auto', 'auto']}
            tickFormatter={formatValue}
            label={{ value: 'Market Cap', position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            type="number" 
            dataKey="volume" 
            name="Volume" 
            tickFormatter={formatValue}
            label={{ value: 'Volume (24h)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter name="Coins" data={scatterData} fill="#8884d8">
            {scatterData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getPointColor(entry.changePercent)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CorrelationAnalysis;
