
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { CoinOption, RealTimePricesProps } from '@/types/trading';

const RealTimePrices: React.FC<RealTimePricesProps> = ({
  initialCoins,
  selectedCoinId,
  onSelectCoin,
  refreshInterval = 10000
}) => {
  const [coins, setCoins] = useState<CoinOption[]>(initialCoins);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const refreshPrices = async () => {
    setIsLoading(true);
    try {
      // Simulate price updates with random changes
      const updatedCoins = coins.map(coin => {
        const changePercent = (Math.random() - 0.5) * 10; // Random change between -5% and +5%
        const newPrice = coin.price * (1 + changePercent / 100);
        const priceChange = newPrice - coin.price;
        
        return {
          ...coin,
          price: newPrice,
          priceChange,
          changePercent
        };
      });
      
      setCoins(updatedCoins);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to refresh prices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(refreshPrices, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleCoinSelect = (coinId: string) => {
    if (onSelectCoin) {
      onSelectCoin(coinId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Live Prices</h3>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshPrices}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {coins.map((coin) => (
          <Card 
            key={coin.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedCoinId === coin.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleCoinSelect(coin.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {coin.image && (
                    <img 
                      src={coin.image} 
                      alt={coin.name} 
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-medium">{coin.symbol}</div>
                    <div className="text-xs text-muted-foreground">{coin.name}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold">
                  ${coin.price.toLocaleString(undefined, { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </div>
                
                {coin.changePercent !== undefined && (
                  <div className="flex items-center gap-1">
                    {coin.changePercent >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <Badge 
                      variant={coin.changePercent >= 0 ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {coin.changePercent >= 0 ? '+' : ''}{coin.changePercent.toFixed(2)}%
                    </Badge>
                  </div>
                )}
                
                {coin.priceChange !== undefined && (
                  <div className={`text-xs ${
                    coin.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {coin.priceChange >= 0 ? '+' : ''}${Math.abs(coin.priceChange).toFixed(2)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RealTimePrices;
