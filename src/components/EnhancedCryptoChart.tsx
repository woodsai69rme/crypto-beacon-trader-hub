
import { useState, useEffect } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid 
} from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCoinHistory, CryptoChartData } from "../services/cryptoApi";
import { toast } from "@/components/ui/use-toast";

interface EnhancedCryptoChartProps {
  coin: string;
  coinId?: string;
  color?: string;
}

const EnhancedCryptoChart = ({ 
  coin, 
  coinId = "bitcoin", 
  color = "#F7931A" 
}: EnhancedCryptoChartProps) => {
  const [chartData, setChartData] = useState<{ date: string; price: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<number>(7); // Default to 7 days
  const [priceChange, setPriceChange] = useState<{
    percentage: number;
    value: number;
    isPositive: boolean;
  }>({
    percentage: 0,
    value: 0,
    isPositive: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCoinHistory(coinId, timeRange);
        if (data && data.prices) {
          // Format the data for the chart
          const formattedData = data.prices.map((item: [number, number]) => {
            const date = new Date(item[0]);
            return {
              date: formatDate(date, timeRange),
              price: item[1],
            };
          });

          setChartData(formattedData);

          // Calculate price change
          if (formattedData.length > 0) {
            const firstPrice = formattedData[0].price;
            const lastPrice = formattedData[formattedData.length - 1].price;
            const change = lastPrice - firstPrice;
            const percentage = (change / firstPrice) * 100;

            setPriceChange({
              percentage,
              value: change,
              isPositive: change >= 0,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch chart data",
          variant: "destructive",
        });

        // Use mock data as fallback
        const mockData = generateMockChartData(timeRange);
        setChartData(mockData);
        
        // Calculate mock price change
        if (mockData.length > 0) {
          const firstPrice = mockData[0].price;
          const lastPrice = mockData[mockData.length - 1].price;
          const change = lastPrice - firstPrice;
          const percentage = (change / firstPrice) * 100;

          setPriceChange({
            percentage,
            value: change,
            isPositive: change >= 0,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [coinId, timeRange]);

  const formatDate = (date: Date, days: number): string => {
    // Format based on the time range
    if (days <= 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days <= 30) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
    }
  };

  // Generate mock data in case API fails
  const generateMockChartData = (days: number) => {
    const data = [];
    const now = new Date();
    const basePrice = 30000 + Math.random() * 10000;
    const volatility = 0.05; // 5% volatility
    
    const points = days <= 1 ? 24 : days; // Hourly for 1 day, daily for others
    
    for (let i = points; i >= 0; i--) {
      const date = new Date(now);
      
      if (days <= 1) {
        // For 24h view, go back by hours
        date.setHours(date.getHours() - i);
      } else {
        // For other views, go back by days
        date.setDate(date.getDate() - i);
      }
      
      // Random walk price
      const randomChange = (Math.random() - 0.5) * 2 * volatility;
      const newPrice = basePrice * (1 + randomChange * (i / points));
      
      data.push({
        date: formatDate(date, days),
        price: newPrice,
      });
    }
    
    return data;
  };

  const timeRangeOptions = [
    { label: "24H", value: 1 },
    { label: "7D", value: 7 },
    { label: "30D", value: 30 },
    { label: "90D", value: 90 },
    { label: "1Y", value: 365 },
  ];

  const formatTooltipValue = (value: number) => {
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="crypto-card">
      <div className="crypto-card-header">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">{coin} Price Chart</h2>
          {!isLoading && (
            <div className="mt-1 flex items-center text-sm">
              <span className="text-muted-foreground">Current Price:</span>
              <span className="ml-1 font-medium">
                ${chartData.length > 0 ? chartData[chartData.length - 1].price.toLocaleString() : "0"}
              </span>
              <span
                className={`ml-2 flex items-center text-xs ${
                  priceChange.isPositive ? "text-crypto-green" : "text-crypto-red"
                }`}
              >
                {priceChange.isPositive ? (
                  <ArrowUp className="mr-0.5 h-3 w-3" />
                ) : (
                  <ArrowDown className="mr-0.5 h-3 w-3" />
                )}
                {Math.abs(priceChange.percentage).toFixed(2)}%
                <span className="ml-1 text-xs text-muted-foreground">
                  ({timeRangeOptions.find(o => o.value === timeRange)?.label})
                </span>
              </span>
            </div>
          )}
        </div>
        <div className="flex space-x-1">
          {timeRangeOptions.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={timeRange === option.value ? "default" : "outline"}
              className="px-2 py-1 text-xs"
              onClick={() => setTimeRange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="h-64 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={`colorPrice_${coinId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333333" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 10 }} 
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tickFormatter={(value) => `$${value.toLocaleString()}`} 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 10 }}
                width={60}
              />
              <Tooltip 
                formatter={formatTooltipValue}
                contentStyle={{ 
                  background: '#1E1E1E', 
                  border: '1px solid #333333',
                  borderRadius: '4px' 
                }} 
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                fillOpacity={1}
                fill={`url(#colorPrice_${coinId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default EnhancedCryptoChart;
