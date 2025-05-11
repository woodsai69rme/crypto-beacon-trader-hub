
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from 'lucide-react';
import { RealTimePricesProps, CoinOption } from '@/types/trading';

const RealTimePrices: React.FC<RealTimePricesProps> = ({
  initialCoins,
  onSelectCoin,
  selectedCoinId,
  refreshInterval = 5000
}) => {
  const [coins, setCoins] = useState<CoinOption[]>(initialCoins);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  useEffect(() => {
    // In a real app, this would connect to a WebSocket or REST API
    // For this demo, we'll simulate price updates
    const intervalId = setInterval(() => {
      const updatedCoins = coins.map(coin => {
        // Generate a random price change (-2% to +2%)
        const priceChangePercent = (Math.random() * 4 - 2) / 100;
        const newPrice = coin.price * (1 + priceChangePercent);
        const priceChange = newPrice - coin.price;
        
        // Updated coin data
        return {
          ...coin,
          price: newPrice,
          priceChange: coin.priceChange + priceChange,
          changePercent: coin.changePercent + (priceChangePercent * 100)
        };
      });
      
      setCoins(updatedCoins);
      setLastUpdated(new Date());
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [coins, refreshInterval]);
  
  const handleRowClick = (coinId: string) => {
    if (onSelectCoin) {
      onSelectCoin(coinId);
    }
  };
  
  return (
    <Card>
      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Coin</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right hidden md:table-cell">24h Change</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Volume</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Market Cap</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {coins.map(coin => (
                <TableRow 
                  key={coin.id} 
                  onClick={() => handleRowClick(coin.id)} 
                  className={`cursor-pointer hover:bg-muted ${selectedCoinId === coin.id ? 'bg-muted/50' : ''}`}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {coin.image && (
                        <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                      )}
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right font-medium">
                    ${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </TableCell>
                  
                  <TableCell className="text-right hidden md:table-cell">
                    <Badge variant={coin.changePercent >= 0 ? "outline" : "destructive"} className="font-medium">
                      {coin.changePercent >= 0 ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(coin.changePercent).toFixed(2)}%
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-right text-muted-foreground hidden lg:table-cell">
                    ${coin.volume ? (coin.volume / 1000000).toFixed(2) + 'M' : 'N/A'}
                  </TableCell>
                  
                  <TableCell className="text-right text-muted-foreground hidden lg:table-cell">
                    ${coin.marketCap ? (coin.marketCap / 1000000000).toFixed(2) + 'B' : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="text-xs text-muted-foreground text-right p-2">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePrices;
