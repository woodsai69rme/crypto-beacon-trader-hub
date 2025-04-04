
import { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Clock } from "lucide-react";

interface CryptoChartProps {
  coin: string;
  color: string;
}

const generateMockData = (days: number, trend: string) => {
  const data = [];
  let basePrice = trend === 'up' ? 27500 : 29500;
  const volatility = trend === 'up' ? 1.003 : 0.997;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    // Add some randomness to the price movement
    basePrice = basePrice * (volatility + (Math.random() * 0.01 - 0.005));
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.round(basePrice * 100) / 100,
    });
  }
  
  return data;
};

const CryptoChart: React.FC<CryptoChartProps> = ({ coin, color }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | 'YTD'>('1W');
  const [chartData, setChartData] = useState<any[]>([]);
  const [priceChange, setPriceChange] = useState({ value: 0, percentage: 0 });
  
  useEffect(() => {
    // In a real app, we'd fetch actual data from an API
    // For now, we'll generate mock data
    const days = timeframe === '1D' ? 24 : 
                timeframe === '1W' ? 7 : 
                timeframe === '1M' ? 30 : 
                timeframe === '3M' ? 90 : 
                365;
                
    const trend = coin === 'Bitcoin' ? 'up' : 'down';
    const data = generateMockData(days, trend);
    setChartData(data);
    
    // Calculate price change
    if (data.length >= 2) {
      const currentPrice = data[data.length - 1].price;
      const previousPrice = data[0].price;
      const change = currentPrice - previousPrice;
      const percentChange = (change / previousPrice) * 100;
      
      setPriceChange({
        value: change,
        percentage: Math.round(percentChange * 100) / 100
      });
    }
  }, [timeframe, coin]);
  
  const currentPrice = chartData.length ? chartData[chartData.length - 1].price : 0;
  const isPriceUp = priceChange.value >= 0;

  return (
    <div className="crypto-card h-full">
      <div className="crypto-card-header">
        <div>
          <h2 className="text-lg font-bold">{coin}</h2>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold">${currentPrice.toLocaleString()}</span>
            <div className={`ml-2 flex items-center ${isPriceUp ? 'text-crypto-green' : 'text-crypto-red'}`}>
              {isPriceUp ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span className="ml-1">{Math.abs(priceChange.percentage)}%</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-1">
          {['1D', '1W', '1M', '3M', 'YTD'].map((tf) => (
            <Button 
              key={tf}
              variant={timeframe === tf ? "default" : "ghost"} 
              size="sm"
              onClick={() => setTimeframe(tf as any)}
              className={`px-2 py-1 h-8 ${timeframe === tf ? '' : 'text-muted-foreground'}`}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="date" 
              stroke="#999"
              tick={{ fill: '#999', fontSize: 12 }}
            />
            <YAxis 
              domain={['dataMin - 100', 'dataMax + 100']}
              stroke="#999"
              tick={{ fill: '#999', fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value}`, 'Price']}
              contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
              labelStyle={{ color: '#ccc' }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={color} 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-end mt-2 text-xs text-muted-foreground items-center">
        <Clock size={12} className="mr-1" />
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default CryptoChart;
