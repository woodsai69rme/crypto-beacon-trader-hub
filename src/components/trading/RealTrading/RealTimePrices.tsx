
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { RealTimePricesProps, CoinOption } from '@/types/trading';

const RealTimePrices: React.FC<RealTimePricesProps> = ({
  symbols = ['BTC', 'ETH', 'SOL'],
  onPriceUpdate,
  onSelectCoin,
  selectedCoinId,
  initialCoins = [],
  refreshInterval = 30000
}) => {
  const [coins, setCoins] = useState<CoinOption[]>(initialCoins.length > 0 ? initialCoins : [
    { 
      id: 'bitcoin', 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      price: 45230.50, 
      changePercent: 2.34, 
      change24h: 2.34,
      value: 'BTC', 
      label: 'Bitcoin' 
    },
    { 
      id: 'ethereum', 
      name: 'Ethereum', 
      symbol: 'ETH', 
      price: 3105.78, 
      changePercent: -1.23, 
      change24h: -1.23,
      value: 'ETH', 
      label: 'Ethereum' 
    },
    { 
      id: 'solana', 
      name: 'Solana', 
      symbol: 'SOL', 
      price: 95.67, 
      changePercent: 5.67, 
      change24h: 5.67,
      value: 'SOL', 
      label: 'Solana' 
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prevCoins => 
        prevCoins.map(coin => {
          const newPrice = coin.price * (1 + (Math.random() - 0.5) * 0.02);
          const newChange = (newPrice - coin.price) / coin.price * 100;
          
          if (onPriceUpdate) {
            onPriceUpdate(coin.symbol, newPrice);
          }
          
          return {
            ...coin,
            price: newPrice,
            changePercent: newChange,
            change24h: newChange
          };
        })
      );
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [onPriceUpdate, refreshInterval]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const formatPercent = (percent: number = 0) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Real-Time Prices</CardTitle>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {coins.map((coin) => (
            <div
              key={coin.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedCoinId === coin.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
              }`}
              onClick={() => onSelectCoin?.(coin.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="font-semibold">{coin.symbol}</div>
                  <span className="text-sm text-muted-foreground">{coin.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(coin.price)}</div>
                  <Badge
                    variant={coin.changePercent && coin.changePercent >= 0 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {coin.changePercent && coin.changePercent >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {formatPercent(coin.changePercent)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePrices;
