
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CoinOption, RealTimePricesProps } from '@/types/trading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchTopCryptoData } from '@/services/api/coinGeckoService';
import { toast } from '@/components/ui/use-toast';

const RealTimePrices: React.FC<RealTimePricesProps> = ({ 
  coins = [], 
  refreshInterval = 60000, // Set default to 1 minute to avoid rate limiting
  onSelectCoin,
  selectedCoinId
}) => {
  const [cryptoData, setCryptoData] = useState<CoinOption[]>(coins);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // Set initial data if provided
    if (coins && coins.length > 0) {
      setCryptoData(coins);
      setIsLoading(false);
    } else {
      fetchData();
    }

    // Setup interval for refreshing data
    const intervalId = setInterval(fetchData, refreshInterval);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTopCryptoData(20);
      if (data && data.length > 0) {
        setCryptoData(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching price data:', error);
      toast({
        title: "Failed to fetch data",
        description: "Could not retrieve the latest cryptocurrency prices. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
      }).format(price);
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatPercentage = (percentage: number) => {
    if (percentage === undefined || percentage === null) return 'N/A';
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const handleRowClick = (coinId: string) => {
    if (onSelectCoin) {
      onSelectCoin(coinId);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Real-Time Prices</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && cryptoData.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Asset</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
                  <TableHead className="text-right">Market Cap</TableHead>
                  <TableHead className="text-right">24h Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cryptoData.map((coin) => (
                  <TableRow 
                    key={coin.id}
                    onClick={() => handleRowClick(coin.id)}
                    className={`cursor-pointer hover:bg-muted ${selectedCoinId === coin.id ? 'bg-muted' : ''}`}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {coin.image && (
                          <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                        )}
                        <div>
                          <div>{coin.name}</div>
                          <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPrice(coin.price)}
                    </TableCell>
                    <TableCell 
                      className={`text-right ${
                        coin.changePercent > 0 
                          ? 'text-green-500' 
                          : coin.changePercent < 0 
                            ? 'text-red-500' 
                            : ''
                      }`}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {coin.changePercent > 0 ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : coin.changePercent < 0 ? (
                          <ArrowDown className="w-4 h-4" />
                        ) : null}
                        {formatPercentage(coin.changePercent)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {coin.marketCap ? 
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          notation: 'compact',
                          maximumFractionDigits: 2
                        }).format(coin.marketCap) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {coin.volume ? 
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          notation: 'compact',
                          maximumFractionDigits: 1
                        }).format(coin.volume) : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {isLoading && cryptoData.length > 0 && (
          <div className="flex justify-center items-center mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
        
        {!isLoading && cryptoData.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            No cryptocurrency data available. Please try again later.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimePrices;
