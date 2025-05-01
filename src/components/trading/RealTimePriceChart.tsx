import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { convertToCoinOptions, fetchCryptoHistoricalData, fetchMultipleCryptoData } from '@/services/cryptoService';
import { CoinOption, RealTimePriceChartProps } from '@/types/trading';
import { Loader2, RefreshCw } from 'lucide-react';

const RealTimePriceChart: React.FC<RealTimePriceChartProps> = ({ 
  coinId, 
  selectedCoinId, 
  onSelectCoin, 
  availableCoins,
  updateInterval = 5000 
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<string>("7");
  
  const timeframeOptions = [
    { value: "1", label: "24 Hours" },
    { value: "7", label: "7 Days" },
    { value: "30", label: "30 Days" },
    { value: "90", label: "3 Months" },
    { value: "365", label: "1 Year" }
  ];
  
  const loadChartData = async () => {
    if (!coinId) return;
    setIsLoading(true);
    
    try {
      const data = await fetchCryptoHistoricalData(coinId, parseInt(timeframe));
      
      // Format data for chart
      const timestamps = data.prices.map((item: [number, number]) => {
        const date = new Date(item[0]);
        return date.toLocaleDateString();
      });
      
      const prices = data.prices.map((item: [number, number]) => item[1]);
      
      setChartData({
        labels: timestamps,
        datasets: [{
          label: 'Price (USD)',
          data: prices,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }]
      });
      
    } catch (error) {
      console.error("Failed to load chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load initial chart data
  useEffect(() => {
    loadChartData();
    
    // Set up interval for real-time updates
    const intervalId = setInterval(() => {
      loadChartData();
    }, updateInterval);
    
    return () => clearInterval(intervalId);
  }, [coinId, timeframe, updateInterval]);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <CardTitle className="text-xl">Price Chart</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={coinId} onValueChange={(value) => onSelectCoin && onSelectCoin(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a coin" />
              </SelectTrigger>
              <SelectContent>
                {availableCoins.map(coin => (
                  <SelectItem key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                {timeframeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={loadChartData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="h-[300px] flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-sm text-muted-foreground">Loading chart data...</div>
          </div>
        ) : (
          chartData ? (
            <div className="text-center">
              Price chart visualization would be displayed here (using a charting library like recharts)
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No chart data available
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimePriceChart;
