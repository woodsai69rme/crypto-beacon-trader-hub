
import React, { useState, useEffect } from 'react';
import { CoinOption } from '@/types/trading';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Sample mock data - Replace with real API call in production
const mockCoins: CoinOption[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 65000,
    priceChange: 1500,
    changePercent: 2.3,
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    value: 'bitcoin',
    label: 'Bitcoin (BTC)'
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3500,
    priceChange: -120,
    changePercent: -3.3,
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    value: 'ethereum',
    label: 'Ethereum (ETH)'
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 142,
    priceChange: 5.7,
    changePercent: 4.2,
    image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    value: 'solana',
    label: 'Solana (SOL)'
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.45,
    priceChange: 0.02,
    changePercent: 4.7,
    image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
    value: 'cardano',
    label: 'Cardano (ADA)'
  }
];

// Function to simulate fetching data - Replace with real API call
const fetchCryptoData = async (): Promise<CoinOption[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data with slightly modified prices
  return mockCoins.map(coin => ({
    ...coin,
    price: coin.price * (1 + (Math.random() * 0.02 - 0.01)),
    priceChange: coin.priceChange * (1 + (Math.random() * 0.1 - 0.05)),
    changePercent: coin.changePercent * (1 + (Math.random() * 0.1 - 0.05))
  }));
};

// Function to convert API data to CoinOption format
const convertToCoinOptions = (data: any[]): CoinOption[] => {
  // This is a placeholder that would normally transform API data
  return mockCoins;
};

interface RealTimePricesProps {
  refreshInterval?: number;
  maxCoins?: number;
  onSelectCoin?: (coinId: string) => void;
}

const RealTimePrices: React.FC<RealTimePricesProps> = ({
  refreshInterval = 5000,
  maxCoins = 4,
  onSelectCoin
}) => {
  const [coins, setCoins] = useState<CoinOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchCryptoData();
      setCoins(data.slice(0, maxCoins));
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching crypto data:', err);
      setError('Failed to fetch latest price data');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
    
    const intervalId = setInterval(fetchData, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval, maxCoins]);
  
  const handleRefresh = () => {
    fetchData();
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 4 : 2
    }).format(value);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Real-Time Prices</CardTitle>
          <CardDescription>
            Last updated: {formatTime(lastUpdated)}
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      
      <CardContent>
        {error ? (
          <div className="py-4 text-center text-red-500">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            {isLoading && coins.length === 0 ? (
              Array.from({ length: maxCoins }).map((_, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <Skeleton className="h-8 w-8 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16 mt-1" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-12 mt-1 ml-auto" />
                  </div>
                </div>
              ))
            ) : (
              coins.map((coin) => (
                <div
                  key={coin.id}
                  className="flex items-center justify-between py-2 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 rounded-md px-2"
                  onClick={() => onSelectCoin && onSelectCoin(coin.id)}
                >
                  <div className="flex items-center">
                    {coin.image && (
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="h-8 w-8 rounded-full mr-3"
                      />
                    )}
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {coin.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(coin.price)}
                    </div>
                    <div
                      className={`text-sm flex items-center justify-end ${
                        coin.changePercent >= 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {coin.changePercent >= 0 ? (
                        <ArrowUpIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3 mr-1" />
                      )}
                      {coin.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimePrices;
