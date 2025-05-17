
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCoinPriceHistory } from "@/services/cryptoService";
import { RealTimePriceChartProps, PricePoint } from "@/types/trading";

const RealTimePriceChart: React.FC<RealTimePriceChartProps> = ({
  selectedCoinId,
  onSelectCoin,
  availableCoins = []
}) => {
  const [historicalData, setHistoricalData] = useState<PricePoint[]>([]);
  const [timeframe, setTimeframe] = useState<number>(7);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedCoin = availableCoins.find(coin => coin.id === selectedCoinId);

  useEffect(() => {
    const loadHistoricalData = async () => {
      if (!selectedCoinId) return;
      
      setIsLoading(true);
      try {
        const data = await fetchCoinPriceHistory(selectedCoinId, timeframe);
        setHistoricalData(data);
      } catch (error) {
        console.error("Failed to fetch price history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistoricalData();
  }, [selectedCoinId, timeframe]);

  const formatXAxis = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedCoin?.name || "Price Chart"} ({selectedCoin?.symbol || ""})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              variant={timeframe === 1 ? "default" : "outline"} 
              onClick={() => setTimeframe(1)}
              size="sm"
            >
              24h
            </Button>
            <Button 
              variant={timeframe === 7 ? "default" : "outline"} 
              onClick={() => setTimeframe(7)}
              size="sm"
            >
              7d
            </Button>
            <Button 
              variant={timeframe === 30 ? "default" : "outline"} 
              onClick={() => setTimeframe(30)}
              size="sm"
            >
              30d
            </Button>
            <Button 
              variant={timeframe === 90 ? "default" : "outline"} 
              onClick={() => setTimeframe(90)}
              size="sm"
            >
              90d
            </Button>
          </div>

          <div className="h-[300px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <p>Loading price data...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={historicalData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatXAxis}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    labelFormatter={(value) => new Date(Number(value)).toLocaleDateString()}
                    formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Price']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#8884d8" 
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
              {availableCoins.slice(0, 6).map(coin => (
                <Button
                  key={coin.id}
                  variant={selectedCoinId === coin.id ? "default" : "outline"}
                  onClick={() => onSelectCoin(coin.id)}
                  size="sm"
                  className="justify-start overflow-hidden"
                >
                  {coin.symbol}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePriceChart;
