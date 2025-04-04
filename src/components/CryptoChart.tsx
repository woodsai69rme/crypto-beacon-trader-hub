
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
import { fetchCoinHistory } from "../services/cryptoApi";

interface CryptoChartProps {
  coin: string;
  color: string;
}

const CryptoChart: React.FC<CryptoChartProps> = ({ coin, color }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | 'YTD'>('1W');
  const [chartData, setChartData] = useState<any[]>([]);
  const [priceChange, setPriceChange] = useState({ value: 0, percentage: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  useEffect(() => {
    const loadChartData = async () => {
      setIsLoading(true);
      
      try {
        // Convert timeframe to days for API
        const days = 
          timeframe === '1D' ? 1 : 
          timeframe === '1W' ? 7 : 
          timeframe === '1M' ? 30 : 
          timeframe === '3M' ? 90 : 
          365; // YTD
        
        const coinId = coin.toLowerCase();
        const historyData = await fetchCoinHistory(coinId, days);
        
        if (historyData) {
          const formattedData = historyData.prices.map(([timestamp, price]) => {
            const date = new Date(timestamp);
            
            // Format date based on timeframe
            let dateLabel;
            if (timeframe === '1D') {
              dateLabel = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            } else {
              dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
            
            return {
              date: dateLabel,
              price: price,
            };
          });
          
          setChartData(formattedData);
          
          // Calculate price change
          if (formattedData.length >= 2) {
            const currentPrice = formattedData[formattedData.length - 1].price;
            setCurrentPrice(currentPrice);
            
            const previousPrice = formattedData[0].price;
            const change = currentPrice - previousPrice;
            const percentChange = (change / previousPrice) * 100;
            
            setPriceChange({
              value: change,
              percentage: Math.round(percentChange * 100) / 100
            });
          }
          
          setLastUpdated(new Date());
        } else {
          // Fallback to mock data
          generateMockData();
        }
      } catch (error) {
        console.error("Failed to load chart data:", error);
        // Fallback to mock data
        generateMockData();
      } finally {
        setIsLoading(false);
      }
    };
    
    loadChartData();
  }, [timeframe, coin]);
  
  const generateMockData = () => {
    const data = [];
    let basePrice = coin === 'Bitcoin' ? 27500 : 29500;
    const volatility = coin === 'Bitcoin' ? 1.003 : 0.997;
    const days = 
      timeframe === '1D' ? 24 : 
      timeframe === '1W' ? 7 : 
      timeframe === '1M' ? 30 : 
      timeframe === '3M' ? 90 : 
      365; // YTD
    
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
    
    setChartData(data);
    setCurrentPrice(data[data.length - 1].price);
    
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
    
    setLastUpdated(new Date());
  };
  
  const isPriceUp = priceChange.value >= 0;

  return (
    <div className="crypto-card h-full">
      <div className="crypto-card-header">
        <div>
          <h2 className="text-lg font-bold">{coin}</h2>
          <div className="flex items-center mt-1">
            {isLoading ? (
              <div className="h-6 w-32 animate-pulse rounded bg-crypto-dark-hover"></div>
            ) : (
              <>
                <span className="text-2xl font-bold">${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                <div className={`ml-2 flex items-center ${isPriceUp ? 'text-crypto-green' : 'text-crypto-red'}`}>
                  {isPriceUp ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  <span className="ml-1">{Math.abs(priceChange.percentage).toFixed(2)}%</span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex space-x-1">
          {(['1D', '1W', '1M', '3M', 'YTD'] as const).map((tf) => (
            <Button 
              key={tf}
              variant={timeframe === tf ? "default" : "ghost"} 
              size="sm"
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-1 h-8 ${timeframe === tf ? '' : 'text-muted-foreground'}`}
              disabled={isLoading}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="h-[300px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : (
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
                domain={['auto', 'auto']}
                stroke="#999"
                tick={{ fill: '#999', fontSize: 12 }}
                tickFormatter={(value) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 'Price']}
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
        )}
      </div>
      
      <div className="flex justify-end mt-2 text-xs text-muted-foreground items-center">
        <Clock size={12} className="mr-1" />
        <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default CryptoChart;
