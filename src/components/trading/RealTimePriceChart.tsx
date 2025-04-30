
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, RefreshCw } from 'lucide-react';
import { CoinOption } from './types';
import { fetchCryptoData } from "@/services/cryptoService";

interface RealTimePriceChartProps {
  selectedCoinId: string;
  onSelectCoin: (coinId: string) => void;
  coinId?: string;
  availableCoins?: CoinOption[];
}

const RealTimePriceChart: React.FC<RealTimePriceChartProps> = ({ 
  selectedCoinId, 
  onSelectCoin,
  coinId,
  availableCoins: propAvailableCoins
}) => {
  const effectiveCoinId = coinId || selectedCoinId;
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeFrame, setTimeFrame] = useState<string>("1d");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [availableCoins, setAvailableCoins] = useState<CoinOption[]>(propAvailableCoins || []);
  
  useEffect(() => {
    // If coin options were not provided via props, fetch them
    if (!propAvailableCoins) {
      const fetchCoins = async () => {
        try {
          const coins = await fetchCryptoData();
          const formattedCoins: CoinOption[] = coins.map(coin => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
            price: coin.current_price,
            image: coin.image,
            priceChange: coin.price_change_24h,
            changePercent: coin.price_change_percentage_24h,
            volume: coin.total_volume,
            marketCap: coin.market_cap,
            value: coin.id,
            label: `${coin.name} (${coin.symbol.toUpperCase()})`
          }));
          setAvailableCoins(formattedCoins);
        } catch (error) {
          console.error("Error fetching coins:", error);
        }
      };
      
      fetchCoins();
    }
  }, [propAvailableCoins]);
  
  useEffect(() => {
    loadChartData();
  }, [effectiveCoinId, timeFrame]);
  
  const loadChartData = async () => {
    setIsLoading(true);
    
    try {
      // In a real application, this would fetch from an API
      // For demo purposes, we'll generate random data
      const daysMap: Record<string, number> = {
        "1h": 1,
        "1d": 30,
        "1w": 90,
        "1m": 180,
        "1y": 365
      };
      
      const days = daysMap[timeFrame] || 30;
      const dataPoints = days * 24;
      const now = new Date();
      const startPrice = Math.random() * 1000 + 100;
      
      const mockData = Array(dataPoints).fill(0).map((_, index) => {
        const date = new Date(now.getTime() - (dataPoints - index) * 3600000);
        const random = Math.random();
        const volatility = 0.02;
        const change = volatility * (random - 0.5);
        const price = startPrice * Math.exp(index * 0.001 + change);
        
        return {
          date: date.toISOString(),
          price: price,
          volume: Math.round(Math.random() * 1000000)
        };
      });
      
      setChartData(mockData);
    } catch (error) {
      console.error("Error loading chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefresh = () => {
    loadChartData();
  };
  
  const selectedCoin = availableCoins.find(coin => coin.id === effectiveCoinId);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Price Chart</CardTitle>
            <CardDescription>
              {selectedCoin 
                ? `${selectedCoin.name} (${selectedCoin.symbol}) price over time` 
                : "Select a coin to view price chart"}
            </CardDescription>
          </div>
          
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="w-full sm:w-64">
              <Select 
                value={effectiveCoinId} 
                onValueChange={onSelectCoin}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a coin" />
                </SelectTrigger>
                <SelectContent>
                  {availableCoins.map(coin => (
                    <SelectItem key={coin.id} value={coin.id}>
                      <div className="flex items-center gap-2">
                        {coin.image && (
                          <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                        )}
                        <span>{coin.name} ({coin.symbol})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Tabs defaultValue="1d" value={timeFrame} onValueChange={setTimeFrame}>
              <TabsList>
                <TabsTrigger value="1h">1H</TabsTrigger>
                <TabsTrigger value="1d">1D</TabsTrigger>
                <TabsTrigger value="1w">1W</TabsTrigger>
                <TabsTrigger value="1m">1M</TabsTrigger>
                <TabsTrigger value="1y">1Y</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {selectedCoin ? (
            <div className="h-[350px] flex items-center justify-center border border-border rounded-lg">
              <div className="text-center text-muted-foreground">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <LineChart className="h-12 w-12 animate-pulse" />
                    <p>Loading chart data...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <LineChart className="h-12 w-12" />
                    <p>
                      Price Chart Visualization Placeholder
                      <br />
                      {selectedCoin.name} - {timeFrame.toUpperCase()} timeframe
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-[350px] flex items-center justify-center border border-border rounded-lg">
              <div className="text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <LineChart className="h-12 w-12" />
                  <p>Select a coin to view price chart</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePriceChart;
