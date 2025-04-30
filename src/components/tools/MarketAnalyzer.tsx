
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, BarChart, Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { fetchCryptoData, fetchCryptoHistoricalData } from '@/services/cryptoService';
import { CryptoData } from '@/types/trading';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MarketAnalyzer: React.FC = () => {
  const [marketData, setMarketData] = useState<CryptoData[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('7');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCryptoData();
        setMarketData(data);
      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchHistorical = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCryptoHistoricalData(selectedCoin, parseInt(selectedTimeframe));
        setHistoricalData(data);
      } catch (error) {
        console.error("Error fetching historical data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistorical();
  }, [selectedCoin, selectedTimeframe]);
  
  const formatPriceData = () => {
    if (!historicalData || !historicalData.prices) return null;
    
    return {
      labels: historicalData.prices.map((item: [number, number]) => 
        new Date(item[0]).toLocaleString(undefined, { month: 'short', day: 'numeric' })
      ),
      datasets: [
        {
          label: `${selectedCoin} Price (USD)`,
          data: historicalData.prices.map((item: [number, number]) => item[1]),
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        }
      ]
    };
  };
  
  const formatVolumeData = () => {
    if (!historicalData || !historicalData.total_volumes) return null;
    
    return {
      labels: historicalData.total_volumes.map((item: [number, number]) => 
        new Date(item[0]).toLocaleString(undefined, { month: 'short', day: 'numeric' })
      ),
      datasets: [
        {
          label: `${selectedCoin} Trading Volume (USD)`,
          data: historicalData.total_volumes.map((item: [number, number]) => item[1]),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }
      ]
    };
  };
  
  const formatMarketCapData = () => {
    if (!historicalData || !historicalData.market_caps) return null;
    
    return {
      labels: historicalData.market_caps.map((item: [number, number]) => 
        new Date(item[0]).toLocaleString(undefined, { month: 'short', day: 'numeric' })
      ),
      datasets: [
        {
          label: `${selectedCoin} Market Cap (USD)`,
          data: historicalData.market_caps.map((item: [number, number]) => item[1]),
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1
        }
      ]
    };
  };
  
  const selectedCoinData = marketData.find(coin => coin.id === selectedCoin);
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Market Data Analysis',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      }
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const formatNumber = (value: number) => {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`;
    }
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`;
    }
    if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K`;
    }
    return value.toString();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Market Analyzer</CardTitle>
        <CardDescription>
          Analyze cryptocurrency market data and trends
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="w-full md:w-1/2">
            <label className="text-sm font-medium mb-1 block">Select Cryptocurrency</label>
            <Select value={selectedCoin} onValueChange={setSelectedCoin}>
              <SelectTrigger>
                <SelectValue placeholder="Select a coin" />
              </SelectTrigger>
              <SelectContent>
                {marketData.slice(0, 20).map(coin => (
                  <SelectItem key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-1/2">
            <label className="text-sm font-medium mb-1 block">Timeframe</label>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Day</SelectItem>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">3 Months</SelectItem>
                <SelectItem value="365">1 Year</SelectItem>
                <SelectItem value="max">Max</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {selectedCoinData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Current Price</div>
              <div className="text-2xl font-bold mt-1">
                ${typeof selectedCoinData.current_price === 'number' ? selectedCoinData.current_price.toFixed(2) : selectedCoinData.current_price}
              </div>
              <div className={`text-sm mt-1 ${selectedCoinData.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {selectedCoinData.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(selectedCoinData.price_change_percentage_24h).toFixed(2)}% (24h)
              </div>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Market Cap</div>
              <div className="text-2xl font-bold mt-1">
                {formatCurrency(selectedCoinData.market_cap)}
              </div>
              <div className="text-sm mt-1 text-muted-foreground">
                Rank #{selectedCoinData.market_cap_rank}
              </div>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">24h Trading Volume</div>
              <div className="text-2xl font-bold mt-1">
                {formatCurrency(selectedCoinData.total_volume)}
              </div>
              <div className="text-sm mt-1 text-muted-foreground">
                Volume/Market Cap: {(selectedCoinData.total_volume / selectedCoinData.market_cap).toFixed(3)}
              </div>
            </div>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Price Chart</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="marketcap">Market Cap</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading data...</p>
              </div>
            ) : (
              formatPriceData() && <Line data={formatPriceData()!} options={chartOptions} />
            )}
          </TabsContent>
          
          <TabsContent value="volume" className="h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading data...</p>
              </div>
            ) : (
              formatVolumeData() && <Bar data={formatVolumeData()!} options={chartOptions} />
            )}
          </TabsContent>
          
          <TabsContent value="marketcap" className="h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading data...</p>
              </div>
            ) : (
              formatMarketCapData() && <Line data={formatMarketCapData()!} options={chartOptions} />
            )}
          </TabsContent>
        </Tabs>
        
        {selectedCoinData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-border rounded-lg p-3">
              <div className="text-sm text-muted-foreground">All-Time High</div>
              <div className="font-bold mt-1">${typeof selectedCoinData.ath === 'number' ? selectedCoinData.ath.toFixed(2) : selectedCoinData.ath}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(selectedCoinData.ath_date).toLocaleDateString()}
              </div>
            </div>
            
            <div className="border border-border rounded-lg p-3">
              <div className="text-sm text-muted-foreground">All-Time Low</div>
              <div className="font-bold mt-1">${typeof selectedCoinData.atl === 'number' ? selectedCoinData.atl.toFixed(2) : selectedCoinData.atl}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(selectedCoinData.atl_date).toLocaleDateString()}
              </div>
            </div>
            
            <div className="border border-border rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Circulating Supply</div>
              <div className="font-bold mt-1">{formatNumber(selectedCoinData.circulating_supply)}</div>
              <div className="text-xs text-muted-foreground">
                {selectedCoinData.max_supply 
                  ? `${((selectedCoinData.circulating_supply / selectedCoinData.max_supply) * 100).toFixed(2)}% of max supply`
                  : 'No max supply'}
              </div>
            </div>
            
            <div className="border border-border rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Max Supply</div>
              <div className="font-bold mt-1">
                {selectedCoinData.max_supply 
                  ? formatNumber(selectedCoinData.max_supply)
                  : 'Unlimited'}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedCoinData.total_supply && `Total: ${formatNumber(selectedCoinData.total_supply)}`}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketAnalyzer;
