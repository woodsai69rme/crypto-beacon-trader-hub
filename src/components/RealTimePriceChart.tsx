
import React, { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { CryptoData, PricePoint, CoinOption } from '@/types/trading';
import { fetchCryptoHistory } from '@/services/cryptoService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface RealTimePriceChartProps {
  coinId?: string;
  currency?: string;
  timeframe?: '1h' | '24h' | '7d' | '30d' | '90d' | '1y' | 'max';
  height?: number | string;
  autoUpdate?: boolean;
  updateInterval?: number;
  showControls?: boolean;
  showVolume?: boolean;
  onDataUpdate?: (data: PricePoint[]) => void;
}

const RealTimePriceChart: React.FC<RealTimePriceChartProps> = ({
  coinId = 'bitcoin',
  currency = 'aud',
  timeframe = '7d',
  height = 400,
  autoUpdate = true,
  updateInterval = 60000,
  showControls = true,
  showVolume = false,
  onDataUpdate,
}) => {
  const [data, setData] = useState<PricePoint[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinOption>({
    id: coinId,
    name: '',
    symbol: '',
    price: 0,
    value: coinId,
    label: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(timeframe);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const historyData = await fetchCryptoHistory(
        coinId,
        selectedTimeframe
      );
      
      // Transform the data
      const transformedData: PricePoint[] = historyData.map((point) => ({
        timestamp: point.timestamp,
        price: point.price,
        // Add the time property for compatibility
        time: point.timestamp,
        date: new Date(point.timestamp).toLocaleDateString(),
      }));
      
      setData(transformedData);
      if (onDataUpdate) onDataUpdate(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError('Failed to load chart data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [coinId, selectedTimeframe, onDataUpdate]);

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up auto refresh
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (autoUpdate) {
      intervalId = setInterval(fetchData, updateInterval);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoUpdate, fetchData, updateInterval]);

  const handleCoinData = (coinData: CryptoData) => {
    setSelectedCoin({
      id: coinData.id,
      name: coinData.name,
      symbol: coinData.symbol,
      price: coinData.current_price || 0,
      value: coinData.id,
      label: `${coinData.name} (${coinData.symbol.toUpperCase()})`
    });
  };

  const handleTimeframeChange = (tf: string) => {
    setSelectedTimeframe(tf);
  };

  // Format the date for the tooltip
  const formatXAxis = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Format the price for the Y axis
  const formatYAxis = (price: number) => {
    return `$${price.toLocaleString()}`;
  };
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-3 rounded-md shadow-md">
          <p className="text-sm text-primary">{`Date: ${new Date(label).toLocaleDateString()}`}</p>
          <p className="text-sm text-primary">
            {`Price: $${payload[0].value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          </p>
          {showVolume && payload[1] && (
            <p className="text-sm text-secondary-foreground">
              {`Volume: ${payload[1].value.toLocaleString()}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>
            {selectedCoin.name || coinId.charAt(0).toUpperCase() + coinId.slice(1)} Price Chart
          </CardTitle>
          {showControls && (
            <div className="flex gap-2">
              <Button
                variant={selectedTimeframe === '24h' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTimeframeChange('24h')}
              >
                24H
              </Button>
              <Button
                variant={selectedTimeframe === '7d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTimeframeChange('7d')}
              >
                7D
              </Button>
              <Button
                variant={selectedTimeframe === '30d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTimeframeChange('30d')}
              >
                30D
              </Button>
              <Button
                variant={selectedTimeframe === '1y' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTimeframeChange('1y')}
              >
                1Y
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
              >
                Refresh
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="w-full" style={{ height }}>
            <Skeleton className="w-full h-full" />
          </div>
        ) : error ? (
          <div className="w-full flex items-center justify-center text-center" style={{ height }}>
            <div>
              <p className="text-destructive mb-2">{error}</p>
              <Button onClick={fetchData}>Retry</Button>
            </div>
          </div>
        ) : (
          <div className="w-full" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  {showVolume && (
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  )}
                </defs>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatXAxis}
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  tickCount={5}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  stroke="hsl(var(--muted-foreground))"
                />
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  isAnimationActive={false}
                />
                {showVolume && (
                  <Area
                    type="monotone"
                    dataKey="volume"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorVolume)"
                    isAnimationActive={false}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimePriceChart;
