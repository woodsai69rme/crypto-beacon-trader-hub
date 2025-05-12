
import React, { useEffect, useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { fetchTopCryptoData } from '@/services/cryptoService';
import { CoinOption } from '@/types/trading';

interface PriceTickerProps {
  autoScroll?: boolean;
  refreshInterval?: number;
  maxCoins?: number;
}

const PriceTicker: React.FC<PriceTickerProps> = ({ 
  autoScroll = true, 
  refreshInterval = 30000,
  maxCoins = 10
}) => {
  const [coins, setCoins] = useState<CoinOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTopCryptoData(maxCoins);
        setCoins(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching price data:', error);
        setIsLoading(false);
      }
    };
    
    // Initial fetch
    fetchData();
    
    // Setup interval for refreshing data
    const intervalId = setInterval(fetchData, refreshInterval);
    
    // Cleanup
    return () => clearInterval(intervalId);
  }, [refreshInterval, maxCoins]);
  
  // For auto-scrolling effect
  const [position, setPosition] = useState(0);
  
  useEffect(() => {
    if (!autoScroll || coins.length === 0) return;
    
    const scrollInterval = setInterval(() => {
      setPosition((prev) => (prev + 1) % coins.length);
    }, 3000);
    
    return () => clearInterval(scrollInterval);
  }, [autoScroll, coins.length]);
  
  if (isLoading) {
    return (
      <div className="bg-background border-y py-2 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading price data...</div>
      </div>
    );
  }
  
  return (
    <div className="bg-background border-y py-2 overflow-hidden">
      <div className="flex items-center gap-6 animate-ticker">
        {coins.map((coin) => (
          <div key={coin.id} className="flex items-center gap-2 min-w-fit">
            {coin.image && (
              <img src={coin.image} alt={coin.name} className="h-5 w-5" />
            )}
            <span className="font-medium">{coin.symbol}</span>
            <span className="font-mono">${coin.price.toLocaleString()}</span>
            <span 
              className={`flex items-center text-xs ${
                coin.priceChange >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {coin.priceChange >= 0 ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {Math.abs(coin.priceChange).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTicker;
