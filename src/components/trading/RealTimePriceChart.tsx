
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, CandlestickChart, ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from "lucide-react";
import { RealTimePriceChartProps, CoinOption } from '@/types/trading';

const RealTimePriceChart: React.FC<RealTimePriceChartProps> = ({
  selectedCoinId,
  onSelectCoin,
  availableCoins = []
}) => {
  const [chartType, setChartType] = useState<'line' | 'candle' | 'bar'>('line');
  const [timeframe, setTimeframe] = useState<string>('7d');
  const [priceData, setPriceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const chartRef = useRef<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCoinId) return;
      
      setIsLoading(true);
      try {
        // Mock data fetch - in a real app, replace with actual API call
        // Replace fetchCoinPriceHistory with a fetch function that exists in your app
        const mockData = Array(30).fill(null).map((_, i) => ({
          timestamp: Date.now() - (i * 86400000),
          price: 50000 - (Math.random() * 5000),
          volume: Math.random() * 10000000
        }));
        
        setPriceData(mockData);
      } catch (error) {
        console.error("Error fetching price data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [selectedCoinId, timeframe]);
  
  const handleZoomIn = () => {
    // Implement zoom functionality
    console.log("Zoom in");
  };
  
  const handleZoomOut = () => {
    // Implement zoom functionality
    console.log("Zoom out");
  };
  
  const handleScrollLeft = () => {
    // Scroll chart to the left
    console.log("Scroll left");
  };
  
  const handleScrollRight = () => {
    // Scroll chart to the right
    console.log("Scroll right");
  };
  
  const handleDateSelect = (date: string) => {
    // Scroll to specific date - convert string to number for index
    const index = parseInt(date, 10) || 0;
    if (chartRef.current?.scrollToIndex) {
      chartRef.current.scrollToIndex(index);
    }
  };
  
  const selectedCoin = availableCoins.find(coin => coin.id === selectedCoinId);
  
  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>
              {selectedCoin?.name || 'Price Chart'}
            </CardTitle>
            {selectedCoin && (
              <span className="text-sm text-muted-foreground">
                {selectedCoin.symbol.toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
                <SelectItem value="max">All Time</SelectItem>
              </SelectContent>
            </Select>
            
            <Tabs value={chartType} onValueChange={(value) => setChartType(value as 'line' | 'candle' | 'bar')}>
              <TabsList className="h-8">
                <TabsTrigger value="line" className="px-2">
                  <LineChart className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="candle" className="px-2">
                  <CandlestickChart className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="bar" className="px-2">
                  <BarChart className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="relative">
            <div className="h-[300px] w-full">
              {/* Chart would be rendered here using a library like recharts, d3, etc. */}
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Chart visualization would be rendered here
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" onClick={handleScrollLeft}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleScrollRight}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {selectedCoin && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Price</div>
              <div className="font-medium">${selectedCoin.price?.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">24h Change</div>
              <div className={`font-medium ${(selectedCoin.changePercent || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {(selectedCoin.changePercent || 0) >= 0 ? '+' : ''}{selectedCoin.changePercent?.toFixed(2)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Volume</div>
              <div className="font-medium">${selectedCoin.volume?.toLocaleString()}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimePriceChart;
