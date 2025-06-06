
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RealTimePricesProps } from '@/types/trading';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const RealTimePrices: React.FC<RealTimePricesProps> = ({
  selectedCoinId,
  onSelectCoin,
  initialCoins,
  refreshInterval
}) => {
  const [coins, setCoins] = useState(initialCoins);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate price updates
      setCoins(prevCoins => 
        prevCoins.map(coin => ({
          ...coin,
          price: coin.price * (1 + (Math.random() - 0.5) * 0.02), // ±1% random change
          priceChange: (Math.random() - 0.5) * 100, // Random change amount
          changePercent: (Math.random() - 0.5) * 5 // ±2.5% change
        }))
      );
      setLastUpdate(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Real-Time Prices
          </CardTitle>
          <Badge variant="outline">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {coins.map((coin) => (
            <div
              key={coin.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedCoinId === coin.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
              }`}
              onClick={() => onSelectCoin(coin.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {coin.image && (
                    <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  )}
                  <div>
                    <div className="font-medium">{coin.name}</div>
                    <div className="text-sm text-muted-foreground">{coin.symbol}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">${coin.price.toFixed(2)}</div>
                  {coin.changePercent !== undefined && (
                    <div className={`flex items-center gap-1 text-sm ${
                      coin.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {coin.changePercent >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>{Math.abs(coin.changePercent).toFixed(2)}%</span>
                    </div>
                  )}
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
