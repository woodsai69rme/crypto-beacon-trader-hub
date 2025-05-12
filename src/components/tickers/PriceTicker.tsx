
import React, { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, PauseCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CoinOption } from "@/types/trading";

interface PriceTickerProps {
  coins: CoinOption[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  variant?: 'default' | 'minimal';
}

const PriceTicker: React.FC<PriceTickerProps> = ({ 
  coins, 
  speed = 30, 
  direction = 'left',
  className,
  variant = 'default'
}) => {
  const tickerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentDirection, setCurrentDirection] = useState<'left' | 'right'>(direction);
  
  useEffect(() => {
    if (!tickerRef.current || coins.length === 0 || isPaused) return;
    
    const tickerContent = tickerRef.current;
    const animationName = `ticker-${currentDirection}`;
    
    // Reset animation
    tickerContent.style.animation = 'none';
    tickerContent.offsetHeight; // Trigger reflow
    
    // Apply animation with dynamic speed
    const animationDuration = `${coins.length * speed}s`;
    tickerContent.style.animation = `${animationName} ${animationDuration} linear infinite`;
    
    return () => {
      if (tickerContent) {
        tickerContent.style.animation = 'none';
      }
    };
  }, [coins, speed, isPaused, currentDirection]);

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  const changeDirection = () => {
    setCurrentDirection(prev => prev === 'left' ? 'right' : 'left');
  };
  
  if (coins.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      "relative overflow-hidden h-12 bg-background/30 backdrop-blur-md border-y", 
      className
    )}>
      {variant === 'default' && (
        <div className="absolute top-1/2 left-2 z-10 -translate-y-1/2 space-x-1 flex opacity-70 hover:opacity-100 transition-opacity">
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
            {currentDirection === 'left' ? 
              <ArrowUp className="h-4 w-4 rotate-90" /> : 
              <ArrowUp className="h-4 w-4 -rotate-90" />}
          </Button>
        </div>
      )}
      
      <div className={cn(
        "ticker-container whitespace-nowrap h-full flex items-center",
        isPaused && "animation-paused"
      )}>
        <div 
          ref={tickerRef}
          className="ticker-content inline-flex items-center h-full"
        >
          {[...coins, ...coins].map((coin, index) => (
            <div 
              key={`${coin.id}-${index}`}
              className="ticker-item inline-flex items-center px-4 h-full hover:bg-accent/50 transition-colors border-r border-border/30"
            >
              {coin.image && (
                <img 
                  src={coin.image} 
                  alt={coin.name} 
                  className="w-5 h-5 mr-2 rounded-full"
                />
              )}
              <span className="font-medium">{coin.symbol.toUpperCase()}</span>
              <span className="mx-1 text-muted-foreground">/</span>
              <span className="font-mono">
                ${coin.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6
                })}
              </span>
              {/* Percentage change */}
              <span className={cn(
                "ml-2 text-sm",
                coin.priceChange > 0 ? "text-crypto-green" : "text-crypto-red"
              )}>
                {coin.priceChange > 0 ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />}
                {Math.abs(coin.priceChange).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceTicker;
