
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoinOption } from '@/types/trading';

interface RealTimePriceChartProps {
  coinId: string;
  timeRange: string;
  height?: number;
  width?: string;
  showControls?: boolean;
}

interface PricePoint {
  timestamp: number;
  price: number;
}

const RealTimePriceChart: React.FC<RealTimePriceChartProps> = ({
  coinId,
  timeRange = '1d',
  height = 300,
  width = 'auto',
  showControls = true
}) => {
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const [selectedRange, setSelectedRange] = useState(timeRange);
  
  const fetchData = async () => {
    try {
      // Mock data for chart
      const now = Date.now();
      const priceData = Array.from({ length: 50 }, (_, i) => {
        const timestamp = now - (49 - i) * 600000; // 10 minutes intervals
        const randomFactor = 1 + (Math.random() * 0.1 - 0.05); // ±5% fluctuation
        const basePrice = 65000; // Base price
        
        return {
          timestamp,
          price: basePrice * randomFactor
        };
      });
      
      setPriceData(priceData);
    } catch (error) {
      console.error('Error fetching price data:', error);
    }
  };
  
  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [coinId, selectedRange]);

  const formattedData = priceData.map(point => {
    const date = new Date(point.timestamp);
    return {
      timestamp: point.timestamp,
      price: point.price,
      time: point.timestamp,
      date: date.toLocaleString()
    };
  });

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Price Chart</CardTitle>
          {showControls && (
            <Tabs value={selectedRange} onValueChange={setSelectedRange}>
              <TabsList className="h-8">
                <TabsTrigger value="1h" className="text-xs">1H</TabsTrigger>
                <TabsTrigger value="1d" className="text-xs">1D</TabsTrigger>
                <TabsTrigger value="1w" className="text-xs">1W</TabsTrigger>
                <TabsTrigger value="1m" className="text-xs">1M</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Simple price display as placeholder */}
        <div className="flex flex-col h-full justify-center items-center">
          <div className="text-4xl font-bold mb-4">
            ${Math.round(priceData[priceData.length - 1]?.price || 0).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            Real chart integration will be implemented here
          </div>
          <Button variant="outline" className="mt-4" onClick={fetchData}>
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePriceChart;
