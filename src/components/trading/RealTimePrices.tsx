
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CoinOption, RealTimePricesProps } from '@/types/trading';
import { enhancedFreeApiAggregator } from '@/services/freeApis/enhancedFreeApiAggregator';
import { Loader2 } from 'lucide-react';

const RealTimePrices: React.FC<RealTimePricesProps> = ({
  symbols,
  onPriceUpdate,
  selectedCoinId,
  onSelectCoin
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [prices, setPrices] = useState<CoinOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Formats a price in AUD with the appropriate precision
  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (price >= 1) {
      return `$${price.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
    } else {
      return `$${price.toLocaleString('en-AU', { minimumFractionDigits: 4, maximumFractionDigits: 8 })}`;
    }
  };

  // Determines the appropriate CSS class based on price change
  const getPriceChangeClass = (change: number): string => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  useEffect(() => {
    // Function to fetch real-time prices
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const marketData = await enhancedFreeApiAggregator.getAggregatedMarketData(symbols);
        
        // Transform market data into coin options
        const coinOptions = marketData.map(item => ({
          id: item.coin.id,
          name: item.coin.name,
          symbol: item.coin.symbol,
          price: item.priceAUD,
          priceChange: item.change24h,
          changePercent: item.change24h,
          marketCap: item.marketCap,
          volume: item.volume,
          image: `https://assets.coingecko.com/coins/images/1/large/${item.coin.id}.png`, // Fallback
          value: item.coin.id,
          label: item.coin.name
        }));
        
        setPrices(coinOptions);
        
        // Notify parent component of price updates if callback exists
        if (onPriceUpdate && coinOptions.length > 0) {
          coinOptions.forEach(coin => {
            onPriceUpdate(coin.symbol, coin.price);
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching real-time prices:', err);
        setError('Failed to load cryptocurrency prices. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchPrices();
    
    // Set up interval for regular updates
    const intervalId = setInterval(fetchPrices, 30000); // Update every 30 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [symbols, onPriceUpdate]);

  const handleCoinSelect = (coinId: string) => {
    if (onSelectCoin) {
      onSelectCoin(coinId);
    }
  };

  if (loading && prices.length === 0) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading prices in AUD...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        <p>{error}</p>
        <button 
          onClick={() => setPrices([])}
          className="mt-2 text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prices.map(coin => (
          <Card
            key={coin.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedCoinId === coin.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleCoinSelect(coin.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-3">
                    {coin.symbol.slice(0, 1)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{coin.name}</h3>
                    <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                  </div>
                </div>
                <Badge variant="outline">AUD</Badge>
              </div>
              
              <div className="mt-3">
                <div className="font-bold text-xl">
                  {formatPrice(coin.price)}
                </div>
                <div className={`text-sm font-medium ${getPriceChangeClass(coin.changePercent || 0)}`}>
                  {coin.changePercent && coin.changePercent > 0 ? '+' : ''}
                  {coin.changePercent?.toFixed(2)}% (24h)
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Market Cap</span>
                  <p className="font-medium">
                    {coin.marketCap ? `$${(coin.marketCap / 1000000).toFixed(1)}M` : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Volume (24h)</span>
                  <p className="font-medium">
                    {coin.volume ? `$${(coin.volume / 1000000).toFixed(1)}M` : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground text-center">
        <p>Data aggregated from multiple sources • Refreshes every 30 seconds • All prices in AUD</p>
        <p className="mt-1">Powered by CryptoTrader Pro Free API Aggregator</p>
      </div>
    </div>
  );
};

export default RealTimePrices;
