
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CoinOption, RealTimePricesProps } from '@/types/trading';

const RealTimePrices: React.FC<RealTimePricesProps> = ({
  onSelectCoin,
  selectedCoinId,
  onPriceUpdate,
  initialCoins = [],
  refreshInterval = 30000
}) => {
  const [coins, setCoins] = useState<CoinOption[]>(initialCoins);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate price updates
      const updatedCoins = coins.map(coin => ({
        ...coin,
        price: coin.price * (0.95 + Math.random() * 0.1),
        change24h: -5 + Math.random() * 10,
        priceChange: coin.priceChange || 0,
        changePercent: coin.changePercent || 0,
        volume: coin.volume || 1000000,
        marketCap: coin.marketCap || 10000000,
        rank: coin.rank || 1
      }));
      
      setCoins(updatedCoins);
      
      // Notify parent of price updates
      updatedCoins.forEach(coin => {
        onPriceUpdate(coin.symbol, coin.price);
      });
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [coins, refreshInterval, onPriceUpdate]);

  // Initialize with mock data if no initial coins provided
  useEffect(() => {
    if (initialCoins.length === 0) {
      const mockCoins: CoinOption[] = [
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'BTC',
          price: 65000,
          change24h: 2.5,
          priceChange: 1500,
          changePercent: 2.5,
          marketCap: 1200000000000,
          volume: 25000000000,
          image: '',
          value: 'bitcoin',
          label: 'Bitcoin (BTC)',
          rank: 1
        },
        {
          id: 'ethereum',
          name: 'Ethereum',
          symbol: 'ETH',
          price: 3200,
          change24h: -1.2,
          priceChange: -40,
          changePercent: -1.2,
          marketCap: 400000000000,
          volume: 15000000000,
          image: '',
          value: 'ethereum',
          label: 'Ethereum (ETH)',
          rank: 2
        }
      ];
      setCoins(mockCoins);
    }
  }, [initialCoins]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {coins.map((coin) => (
              <div
                key={coin.id}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 ${
                  selectedCoinId === coin.id ? 'bg-primary/10 border-primary' : ''
                }`}
                onClick={() => onSelectCoin(coin.id)}
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-semibold">{coin.name}</p>
                    <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold">${coin.price.toFixed(2)}</p>
                  <div className="flex items-center space-x-1">
                    {coin.change24h >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <Badge
                      variant={coin.change24h >= 0 ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {coin.change24h.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimePrices;
