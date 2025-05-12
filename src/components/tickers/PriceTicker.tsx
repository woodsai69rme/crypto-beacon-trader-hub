
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { fetchCryptoData } from '@/services/cryptoService';
import { toast } from '@/hooks/use-toast';

interface CryptoTicker {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercentage: number;
}

interface PriceTickerProps {
  direction?: 'left' | 'right';
  speed?: number;
  autoPause?: boolean;
  position?: 'top' | 'bottom';
  tickDuration?: number;
  className?: string;
}

const PriceTicker: React.FC<PriceTickerProps> = ({
  direction = 'left',
  speed = 30,
  autoPause = true,
  position = 'top',
  tickDuration = 5000,
  className = ''
}) => {
  const [tickers, setTickers] = useState<CryptoTicker[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadTickers = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCryptoData();
        
        const formattedTickers = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          symbol: item.symbol.toUpperCase(),
          price: item.current_price,
          change: item.price_change_24h,
          changePercentage: item.price_change_percentage_24h
        }));
        
        setTickers(formattedTickers);
      } catch (error) {
        console.error('Error fetching price data:', error);
        toast({
          title: "Data Fetch Error",
          description: "Failed to load ticker data. Using mock data instead.",
          variant: "destructive",
        });
        
        // Set mock data
        setTickers(mockTickers);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTickers();
    const interval = setInterval(loadTickers, tickDuration);
    
    return () => {
      clearInterval(interval);
    };
  }, [tickDuration]);
  
  const handleMouseEnter = () => {
    if (autoPause) {
      setIsPaused(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (autoPause) {
      setIsPaused(false);
    }
  };
  
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };
  
  if (isLoading) {
    return (
      <div className={`w-full py-2 ${className}`}>
        <div className="flex items-center justify-center h-6">
          <div className="animate-pulse w-full max-w-md h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  const tickerAnimationStyle = {
    animationPlayState: isPaused ? 'paused' : 'running',
    animationDuration: `${100 / speed}s`,
  };
  
  const positionClasses = {
    top: 'top-0',
    bottom: 'bottom-0',
  };
  
  return (
    <div 
      className={`w-full overflow-hidden border-y py-2 bg-background fixed ${positionClasses[position]} z-50 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style>
        {`
          @keyframes tickerAnimation {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          
          .ticker-wrapper {
            white-space: nowrap;
            animation: tickerAnimation linear infinite;
            display: inline-block;
            animation-direction: ${direction === 'right' ? 'reverse' : 'normal'};
          }
        `}
      </style>
      
      <div className="ticker-container relative">
        <div 
          className="ticker-wrapper"
          style={tickerAnimationStyle}
        >
          {tickers.map((ticker, index) => (
            <span key={ticker.id} className="inline-block px-4">
              <span className="font-medium">{ticker.symbol}</span>
              <span className="text-muted-foreground mx-1">${ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className={`${getChangeColor(ticker.changePercentage)}`}>
                {ticker.changePercentage >= 0 ? '+' : ''}{ticker.changePercentage.toFixed(2)}%
              </span>
              {index < tickers.length - 1 && <span className="ml-3 text-muted-foreground">|</span>}
            </span>
          ))}
        </div>
        
        <div 
          className="ticker-wrapper"
          style={{
            ...tickerAnimationStyle,
            marginLeft: '20px'
          }}
        >
          {tickers.map((ticker, index) => (
            <span key={`dup-${ticker.id}`} className="inline-block px-4">
              <span className="font-medium">{ticker.symbol}</span>
              <span className="text-muted-foreground mx-1">${ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className={`${getChangeColor(ticker.changePercentage)}`}>
                {ticker.changePercentage >= 0 ? '+' : ''}{ticker.changePercentage.toFixed(2)}%
              </span>
              {index < tickers.length - 1 && <span className="ml-3 text-muted-foreground">|</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mock data for fallback
const mockTickers: CryptoTicker[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 61240.52, change: 1250.28, changePercentage: 2.08 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3521.85, change: 125.62, changePercentage: 3.7 },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: 142.72, change: 8.56, changePercentage: 6.38 },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.58, change: 0.02, changePercentage: 3.12 },
  { id: 'ripple', name: 'XRP', symbol: 'XRP', price: 0.54, change: 0.008, changePercentage: 1.48 },
  { id: 'binancecoin', name: 'Binance Coin', symbol: 'BNB', price: 584.26, change: -2.54, changePercentage: -0.43 },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: 7.86, change: 0.32, changePercentage: 4.25 },
];

export default PriceTicker;
