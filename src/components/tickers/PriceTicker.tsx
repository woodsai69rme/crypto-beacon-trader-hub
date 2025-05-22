
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, PauseCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CoinOption } from "@/types/trading";
import { useCurrency } from "@/contexts/CurrencyContext";

interface PriceTickerProps {
  coins: CoinOption[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

const PriceTicker: React.FC<PriceTickerProps> = ({ 
  coins = [], 
  speed = 30,
  direction = 'left',
  className 
}) => {
  const { formatCurrency } = useCurrency();
  const tickerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentDirection, setCurrentDirection] = useState<'left' | 'right'>(direction);
  
  // Handle undefined coins
  const safeCoins = coins || [];
  
  useEffect(() => {
    if (!tickerRef.current || safeCoins.length === 0 || isPaused) return;
    
    const tickerContent = tickerRef.current;
    const animationName = `price-ticker-${currentDirection}`;
    
    // Reset animation
    tickerContent.style.animation = 'none';
    tickerContent.offsetHeight; // Trigger reflow
    
    // Apply animation with dynamic speed
    const animationDuration = `${safeCoins.length * speed}s`;
    tickerContent.style.animation = `${animationName} ${animationDuration} linear infinite`;
    
    return () => {
      if (tickerContent) {
        tickerContent.style.animation = 'none';
      }
    };
  }, [safeCoins, speed, isPaused, currentDirection]);

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  const changeDirection = () => {
    setCurrentDirection(prev => prev === 'left' ? 'right' : 'left');
  };
  
  // Guard against empty coins
  if (safeCoins.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted/30", className)}>
      <div className="absolute top-1/2 left-2 z-10 -translate-y-1/2 space-y-1 flex flex-col opacity-70 hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full bg-background/80 backdrop-blur"
          onClick={togglePause}
        >
          {isPaused ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full bg-background/80 backdrop-blur"
          onClick={changeDirection}
        >
          {currentDirection === 'left' ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
      
      <div 
        className={cn(
          "ticker-container whitespace-nowrap",
          isPaused && "animation-paused"
        )}
      >
        <div 
          ref={tickerRef}
          className="ticker-content inline-flex"
        >
          {[...safeCoins, ...safeCoins].map((coin, index) => (
            <div 
              key={`${coin.id}-${index}`}
              className="ticker-item inline-block px-4 py-2 hover:bg-accent/50 transition-colors"
            >
              <span className="font-semibold">{coin.symbol}</span>
              <span className="mx-2">•</span>
              <span>{formatCurrency(coin.price)}</span>
              <span 
                className={cn(
                  "ml-1",
                  coin.priceChange > 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {coin.priceChange > 0 ? '+' : ''}{coin.priceChange.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes price-ticker-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${(safeCoins.length || 1) * 200}px); }
        }

        @keyframes price-ticker-right {
          0% { transform: translateX(-${(safeCoins.length || 1) * 200}px); }
          100% { transform: translateX(0); }
        }

        .ticker-content {
          animation: price-ticker-${currentDirection} ${(safeCoins.length || 1) * speed}s linear infinite;
        }

        .animation-paused {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
};

export default PriceTicker;
