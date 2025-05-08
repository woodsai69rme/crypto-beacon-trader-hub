
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CryptoData } from '@/types/trading';

interface PriceCorrelationChartProps {
  data: CryptoData[];
}

const PriceCorrelationChart: React.FC<PriceCorrelationChartProps> = ({ data }) => {
  // Generate mock historical price data
  // In a real app, this would come from an API
  const generateHistoricalData = () => {
    const days = 30;
    const result = [];
    
    // Only use the top 5 coins for clarity
    const topCoins = data.slice(0, 5);
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const entry: any = {
        date: date.toLocaleDateString(),
      };
      
      topCoins.forEach(coin => {
        const symbol = coin.symbol.toUpperCase();
        
        // Start with the current price
        let basePrice = coin.price;
        
        // Adjust for historical data (simplified model)
        // In real app, this would be actual historical data
        if (i === 0) {
          // Current price
          entry[symbol] = basePrice;
        } else {
          // Generate price variations based on trends
          // This creates somewhat correlated price movements for visualization
          const trendFactor = coin.changePercent > 0 ? 1 : -1;
          const dayVariation = (Math.random() * 0.03 - 0.01) + (0.005 * trendFactor);
          
          // Bitcoin influences other coins (simplified correlation model)
          const btcEffect = symbol === 'BTC' ? 0 : (Math.random() * 0.01) * (topCoins[0].changePercent > 0 ? 1 : -1);
          
          // Calculate historical price
          const historicalPrice = basePrice / (1 + ((days - i) * (dayVariation + btcEffect) / days));
          entry[symbol] = parseFloat(historicalPrice.toFixed(2));
        }
      });
      
      result.push(entry);
    }
    
    return result;
  };
  
  const historicalData = generateHistoricalData();
  
  // Generate normalized data for better visualization
  const normalizeData = (data: any[]) => {
    const symbols = Object.keys(data[0]).filter(key => key !== 'date');
    const firstValues: {[key: string]: number} = {};
    
    // Get the first value for each coin
    symbols.forEach(symbol => {
      firstValues[symbol] = data[0][symbol];
    });
    
    // Normalize all values as percentage change from first day
    return data.map(day => {
      const normalizedDay: any = { date: day.date };
      
      symbols.forEach(symbol => {
        normalizedDay[symbol] = ((day[symbol] / firstValues[symbol]) - 1) * 100;
      });
      
      return normalizedDay;
    });
  };
  
  const normalizedData = normalizeData(historicalData);
  
  // Get a color for each coin
  const getColor = (index: number) => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];
    return colors[index % colors.length];
  };
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={normalizedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="date" 
            minTickGap={20} 
          />
          <YAxis 
            label={{ value: '% Change', angle: -90, position: 'insideLeft', dx: -10 }}
            tickFormatter={(value) => `${value.toFixed(0)}%`}
          />
          <Tooltip 
            formatter={(value: any) => [`${value.toFixed(2)}%`, '']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          {data.slice(0, 5).map((coin, index) => (
            <Line
              key={coin.symbol}
              type="monotone"
              dataKey={coin.symbol.toUpperCase()}
              name={`${coin.name} (${coin.symbol.toUpperCase()})`}
              stroke={getColor(index)}
              dot={false}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceCorrelationChart;
