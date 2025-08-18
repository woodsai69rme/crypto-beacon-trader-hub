
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchTopCryptoData } from '@/services/cryptoService';
import { CoinOption, CryptoData } from '@/types/trading';
import CorrelationMatrix from './CorrelationMatrix';
import CorrelationHeatmap from './CorrelationHeatmap';
import PriceCorrelationChart from './PriceCorrelationChart';
import { generateCorrelationMatrix } from '@/lib/correlationUtils';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

const MarketCorrelations: React.FC = () => {
  const [coins, setCoins] = useState<CoinOption[]>([]);
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  const [correlationMatrix, setCorrelationMatrix] = useState<number[][]>([]);
  const [timeframe, setTimeframe] = useState<string>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to convert CoinOption to CryptoData
  const convertCoinOptionToCryptoData = (coin: CoinOption): CryptoData => {
    return {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      current_price: coin.price,
      price: coin.price,
      price_change_percentage_24h: coin.changePercent || 0,
      change24h: coin.change24h,
      market_cap: coin.marketCap || 0,
      total_volume: coin.volume || 0,
      image: coin.image || '',
      value: coin.value,
      label: coin.label,
      priceChange: coin.priceChange,
      changePercent: coin.changePercent,
      volume: coin.volume,
      marketCap: coin.marketCap
    };
  };

  // Helper function to convert CryptoData to CoinOption
  const convertCryptoDataToCoinOption = (crypto: CryptoData): CoinOption => {
    return {
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      price: crypto.current_price,
      change24h: crypto.price_change_percentage_24h,
      value: crypto.value,
      label: crypto.label,
      priceChange: crypto.priceChange,
      changePercent: crypto.changePercent,
      volume: crypto.volume,
      marketCap: crypto.marketCap,
      image: crypto.image
    };
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const cryptoData = await fetchTopCryptoData(10);
        setCoins(cryptoData);
        
        // Select first 5 coins by default
        const defaultSelection = cryptoData.slice(0, 5).map(coin => coin.id);
        setSelectedCoins(defaultSelection);
        
        // Generate correlation matrix for selected coins
        const selectedCoinData = cryptoData.filter(coin => defaultSelection.includes(coin.id));
        const cryptoDataConverted = selectedCoinData.map(convertCoinOptionToCryptoData);
        const matrix = generateCorrelationMatrix(selectedCoinData);
        setCorrelationMatrix(matrix);
        
      } catch (err) {
        console.error('Error loading market correlations data:', err);
        setError('Failed to load market data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedCoins.length > 0 && coins.length > 0) {
      const selectedCoinData = coins.filter(coin => selectedCoins.includes(coin.id));
      const matrix = generateCorrelationMatrix(selectedCoinData);
      setCorrelationMatrix(matrix);
    }
  }, [selectedCoins, coins, timeframe]);

  const handleCoinToggle = (coinId: string) => {
    setSelectedCoins(prev => {
      if (prev.includes(coinId)) {
        return prev.filter(id => id !== coinId);
      } else if (prev.length < 10) { // Limit to 10 coins
        return [...prev, coinId];
      }
      return prev;
    });
  };

  const handleCoinSelect = (coin: CoinOption) => {
    console.log('Selected coin:', coin);
  };

  const selectedCoinData = coins.filter(coin => selectedCoins.includes(coin.id));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Market Correlations
          </CardTitle>
          <CardDescription>Loading correlation data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Market Correlations
          </CardTitle>
          <CardDescription>Error loading data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Market Correlations
        </CardTitle>
        <CardDescription>
          Analyze price correlations between different cryptocurrencies
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Timeframe</label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-2 min-w-[300px]">
            <label className="text-sm font-medium mb-2 block">
              Selected Assets ({selectedCoins.length}/10)
            </label>
            <div className="flex flex-wrap gap-2">
              {coins.map(coin => (
                <Badge
                  key={coin.id}
                  variant={selectedCoins.includes(coin.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleCoinToggle(coin.id)}
                >
                  {coin.symbol}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {selectedCoins.length < 2 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Select at least 2 assets to see correlation analysis
            </p>
          </div>
        ) : (
          <Tabs defaultValue="matrix" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="matrix" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Matrix
              </TabsTrigger>
              <TabsTrigger value="heatmap" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Heatmap
              </TabsTrigger>
              <TabsTrigger value="chart" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Chart
              </TabsTrigger>
            </TabsList>

            <TabsContent value="matrix">
              <CorrelationMatrix
                correlationData={correlationMatrix}
                coins={selectedCoinData}
                onCoinSelect={handleCoinSelect}
              />
            </TabsContent>

            <TabsContent value="heatmap">
              <CorrelationHeatmap
                correlationData={correlationMatrix}
                coins={selectedCoinData}
                onCoinSelect={handleCoinSelect}
              />
            </TabsContent>

            <TabsContent value="chart">
              <PriceCorrelationChart
                coins={selectedCoinData}
              />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketCorrelations;
