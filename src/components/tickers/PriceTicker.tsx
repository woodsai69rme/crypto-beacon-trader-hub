
import React, { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, PauseCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CoinOption } from "@/types/trading";
import { Tooltip } from "@/components/ui/tooltip";

interface PriceTickerProps {
  coins: CoinOption[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  variant?: 'default' | 'minimal';
}

// Define CSS keyframes for the ticker animation
const tickerLeftKeyframes = `
@keyframes ticker-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
`;

const tickerRightKeyframes = `
@keyframes ticker-right {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }
}
`;

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
  
  // Add keyframes to document head
  useEffect(() => {
    // Create style element if it doesn't exist yet
    let styleElement = document.getElementById('ticker-keyframes');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'ticker-keyframes';
      document.head.appendChild(styleElement);
    }
    
    // Set the keyframes
    styleElement.textContent = tickerLeftKeyframes + tickerRightKeyframes;
    
    return () => {
      // Clean up
      if (styleElement && document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);
  
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
                  className="w-5 h-5 mr-2 rounded-full flex-shrink-0"
                />
              )}
              <div className="flex items-center">
                <span className="font-medium mr-1.5 whitespace-nowrap">{coin.symbol.toUpperCase()}</span>
                <span className="text-xs text-muted-foreground hidden sm:inline-block">
                  ({coin.name})
                </span>
              </div>
              <span className="mx-2 text-muted-foreground">/</span>
              <span className="font-mono truncate">
                ${coin.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6
                })}
              </span>
              {/* Percentage change */}
              <span className={cn(
                "ml-2 text-sm whitespace-nowrap",
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
