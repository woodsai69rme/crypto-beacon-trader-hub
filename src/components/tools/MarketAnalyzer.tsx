
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchCryptoHistoricalData } from '@/services/cryptoService';
import { Loader2 } from 'lucide-react';
import { CoinOption, ValueType } from '@/types/trading';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale);

interface MarketAnalyzerProps {
  className?: string;
}

const MarketAnalyzer: React.FC<MarketAnalyzerProps> = ({ className }) => {
  const [selectedCoin, setSelectedCoin] = useState<string>("bitcoin");
  const [timeframe, setTimeframe] = useState<string>("7");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("price");
  const [chartData, setChartData] = useState<any>(null);
  const [marketStats, setMarketStats] = useState<{
    currentPrice: number;
    priceChange24h: number;
    priceChangePercentage24h: number;
    marketCap: number;
    volume24h: number;
    circulatingSupply: number;
  }>({
    currentPrice: 0,
    priceChange24h: 0,
    priceChangePercentage24h: 0,
    marketCap: 0,
    volume24h: 0,
    circulatingSupply: 0
  });
  
  const coins: CoinOption[] = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 61245.32, value: "bitcoin", label: "Bitcoin (BTC)" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3010.45, value: "ethereum", label: "Ethereum (ETH)" },
    { id: "solana", name: "Solana", symbol: "SOL", price: 121.33, value: "solana", label: "Solana (SOL)" }
  ];
  
  const timeframes = [
    { value: "1", label: "1 day" },
    { value: "7", label: "7 days" },
    { value: "30", label: "30 days" },
    { value: "90", label: "90 days" },
    { value: "365", label: "1 year" }
  ];
  
  useEffect(() => {
    loadChartData();
  }, [selectedCoin, timeframe, activeTab]);
  
  const loadChartData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCryptoHistoricalData(selectedCoin, parseInt(timeframe));
      
      const timestamps = data.prices.map(item => {
        const date = new Date(item[0]);
        return date.toLocaleDateString();
      });
      
      let chartValues: number[] = [];
      let chartDataset = {
        label: "",
        data: chartValues,
        borderColor: "",
        backgroundColor: ""
      };
      
      if (activeTab === "price") {
        chartValues = data.prices.map(item => item[1]);
        chartDataset = {
          label: "Price (USD)",
          data: chartValues,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)"
        };
      } else if (activeTab === "volume") {
        chartValues = data.total_volumes.map(item => item[1]);
        chartDataset = {
          label: "Volume (USD)",
          data: chartValues,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)"
        };
      } else if (activeTab === "market-cap") {
        chartValues = data.market_caps.map(item => item[1]);
        chartDataset = {
          label: "Market Cap (USD)",
          data: chartValues,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)"
        };
      }
      
      setChartData({
        labels: timestamps,
        datasets: [chartDataset]
      });
      
      // Update market stats with the latest data point
      const lastPriceData = data.prices[data.prices.length - 1];
      const prevDayPriceData = data.prices[Math.max(0, data.prices.length - 2)];
      const priceChange = lastPriceData[1] - prevDayPriceData[1];
      const priceChangePercentage = (priceChange / prevDayPriceData[1]) * 100;
      
      const lastVolumeData = data.total_volumes[data.total_volumes.length - 1];
      const lastMarketCapData = data.market_caps[data.market_caps.length - 1];
      
      setMarketStats({
        currentPrice: lastPriceData[1],
        priceChange24h: priceChange,
        priceChangePercentage24h: priceChangePercentage,
        marketCap: lastMarketCapData[1],
        volume24h: lastVolumeData[1],
        circulatingSupply: lastMarketCapData[1] / lastPriceData[1]
      });
    } catch (error) {
      console.error("Failed to load chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatValue = (value: ValueType): string => {
    if (typeof value === 'number') {
      if (value >= 1_000_000_000) {
        return `$${(value / 1_000_000_000).toFixed(2)}B`;
      } else if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(2)}M`;
      } else if (value >= 1_000) {
        return `$${(value / 1_000).toFixed(2)}K`;
      } else {
        return `$${value.toFixed(2)}`;
      }
    }
    return String(value);
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Market Analyzer</CardTitle>
        <CardDescription>
          Analyze detailed market data and historical trends
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Select Cryptocurrency</label>
              <Select
                value={selectedCoin}
                onValueChange={setSelectedCoin}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {coins.map((coin) => (
                    <SelectItem key={coin.id} value={coin.id}>
                      {coin.name} ({coin.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Timeframe</label>
              <Select
                value={timeframe}
                onValueChange={setTimeframe}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="price">Price</TabsTrigger>
                <TabsTrigger value="volume">Volume</TabsTrigger>
                <TabsTrigger value="market-cap">Market Cap</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="h-[400px] flex justify-center items-center">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="mt-2">Loading chart data...</p>
              </div>
            ) : chartData ? (
              <Line 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      ticks: {
                        callback: function(value) {
                          return formatValue(value);
                        }
                      }
                    }
                  },
                  interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                  }
                }} 
              />
            ) : (
              <div>No data available</div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-card/50 border border-border">
              <div className="text-sm text-muted-foreground">Current Price</div>
              <div className="text-xl font-bold">${marketStats.currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              <div className={`text-sm ${marketStats.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {marketStats.priceChange24h >= 0 ? '▲' : '▼'} {marketStats.priceChangePercentage24h.toFixed(2)}%
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-card/50 border border-border">
              <div className="text-sm text-muted-foreground">24h Volume</div>
              <div className="text-xl font-bold">{formatValue(marketStats.volume24h)}</div>
            </div>
            
            <div className="p-4 rounded-lg bg-card/50 border border-border">
              <div className="text-sm text-muted-foreground">Market Cap</div>
              <div className="text-xl font-bold">{formatValue(marketStats.marketCap)}</div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={loadChartData}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                'Refresh Data'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketAnalyzer;
