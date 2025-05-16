
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CoinOption, PricePoint } from '@/types/trading.d';
import { format, parseISO } from 'date-fns';
import { useTheme } from 'next-themes';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import CryptoSearch from '@/components/CryptoSearch';

interface RealTimePriceChartProps {
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  coinId?: string;
  availableCoins?: CoinOption[];
}

const RealTimePriceChart: React.FC<RealTimePriceChartProps> = ({ selectedCoinId, onSelectCoin, coinId, availableCoins }) => {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [coinDetails, setCoinDetails] = useState<CoinOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const { toast } = useToast();
  const [internalCoinId, setInternalCoinId] = useState(selectedCoinId || coinId || 'bitcoin');

  // Update internalCoinId when selectedCoinId or coinId prop changes
  useEffect(() => {
    if (selectedCoinId) {
      setInternalCoinId(selectedCoinId);
    } else if (coinId) {
      setInternalCoinId(coinId);
    }
  }, [selectedCoinId, coinId]);

  const fetchChartData = useCallback(async (coinId: string) => {
    setIsLoading(true);
    try {
      // We'll create a mock implementation for now
      const historicalData = await fetchHistoricalData(coinId, '30');
      if (historicalData && historicalData.length > 0) {
        setPriceHistory(historicalData);
      } else {
        toast({
          title: "Could not load chart data",
          description: "No historical data found for the selected coin.",
          variant: "destructive",
        });
        setPriceHistory([]);
      }
    } catch (error) {
      console.error("Error fetching historical data:", error);
      toast({
        title: "Error loading chart data",
        description: "Failed to retrieve historical data. Please try again later.",
        variant: "destructive",
      });
      setPriceHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchDetails = useCallback(async (coinId: string) => {
    try {
      // We'll create a mock implementation for now
      const details = await fetchCoinDetails(coinId);
      setCoinDetails(details);
    } catch (error) {
      console.error("Error fetching coin details:", error);
      setCoinDetails(null);
    }
  }, []);

  useEffect(() => {
    fetchChartData(internalCoinId);
    fetchDetails(internalCoinId);
  }, [internalCoinId, fetchChartData, fetchDetails]);

  const handleCoinSelect = (coin: CoinOption) => {
    setInternalCoinId(coin.id);
    onSelectCoin?.(coin.id);
  };

  const formatDate = (timestamp: number) => {
    try {
      const date = parseISO(new Date(timestamp).toISOString());
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error("Error parsing date:", error);
      return 'Invalid Date';
    }
  };

  const chartData = priceHistory.map((point) => ({
    price: point.price,
    timestamp: point.timestamp,
    date: point.date || formatDate(point.timestamp),
    volume: point.volume
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-secondary rounded-md text-secondary-foreground">
          <p className="label">{`Date: ${formatDate(payload[0].payload.timestamp)}`}</p>
          <p className="label">{`Price: $${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>
          {coinDetails ? `${coinDetails.name} Price Chart` : "Price Chart"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <CryptoSearch onSelect={handleCoinSelect} placeholder="Search for a cryptocurrency..." />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis tickFormatter={(value) => `$${value.toFixed(2)}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={theme === "dark" ? "#8884d8" : "#82ca9d"}
                fill={theme === "dark" ? "#3f3f3f" : "#c8e6c9"}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

// Mock implementations for the missing API functions
async function fetchHistoricalData(coinId: string, period: string): Promise<PricePoint[]> {
  // Return mock data for now
  const mockData: PricePoint[] = [];
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  
  // Generate 30 days of mock data
  for (let i = 29; i >= 0; i--) {
    const timestamp = now - (i * dayInMs);
    const price = 30000 + Math.random() * 5000; // Random price between 30000 and 35000
    
    mockData.push({
      timestamp,
      price,
      date: new Date(timestamp).toISOString().split('T')[0],
      volume: Math.random() * 1000000000
    });
  }
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData), 500);
  });
}

async function fetchCoinDetails(coinId: string): Promise<CoinOption> {
  // Return mock data for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: coinId,
        name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
        symbol: coinId.substring(0, 3).toUpperCase(),
        price: 30000 + Math.random() * 5000,
        image: `https://via.placeholder.com/32?text=${coinId.substring(0, 1).toUpperCase()}`,
        value: coinId,
        label: coinId.charAt(0).toUpperCase() + coinId.slice(1),
      });
    }, 300);
  });
}

export default RealTimePriceChart;
