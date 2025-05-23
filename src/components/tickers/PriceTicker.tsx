
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CoinOption } from '@/types/trading';

interface PriceTickerProps {
  coins: CoinOption[];
  speed?: number;
  direction?: 'left' | 'right';
  autoSpeed?: boolean;
  className?: string;
}

const PriceTicker: React.FC<PriceTickerProps> = ({
  coins,
  speed = 50,
  direction = 'left',
  autoSpeed = true,
  className = ''
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate actual speed: lower value = faster scrolling
  const actualSpeed = 100 - speed; // Invert the scale so higher number = faster
  
  useEffect(() => {
    if (!scrollRef.current || isPaused) return;
    
    // Pixel amount to move for each animation frame
    // We use the speed setting to adjust this value (0.2 to 2 pixels per frame)
    const step = (speed / 50) * (direction === 'left' ? 1 : -1);
    let animationFrameId: number;
    let lastTimestamp: number;
    
    const scroll = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      
      // Only update every ~16ms (60fps) to smooth animation
      if (elapsed > 16) {
        if (scrollRef.current) {
          // Move the scroll position
          scrollRef.current.scrollLeft += step;
          
          // If we've scrolled to the end, reset to start for continuous loop
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          
          if (direction === 'left' && scrollLeft >= scrollWidth - clientWidth) {
            scrollRef.current.scrollLeft = 0;
          } else if (direction === 'right' && scrollLeft <= 0) {
            scrollRef.current.scrollLeft = scrollWidth - clientWidth;
          }
        }
        lastTimestamp = timestamp;
      }
      
      animationFrameId = requestAnimationFrame(scroll);
    };
    
    animationFrameId = requestAnimationFrame(scroll);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, direction, isPaused, coins]);
  
  // Auto-pause when hovering if autoSpeed is enabled
  useEffect(() => {
    if (autoSpeed && isHovered && !isPaused) {
      setIsPaused(true);
    } else if (autoSpeed && !isHovered && isPaused) {
      setIsPaused(false);
    }
  }, [autoSpeed, isHovered, isPaused]);
  
  // Format price change with color and arrow
  const formatPriceChange = (changePercent: number) => {
    const isPositive = changePercent >= 0;
    const color = isPositive ? 'text-green-500' : 'text-red-500';
    
    return (
      <span className={color}>
        {isPositive ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%
      </span>
    );
  };
  
  return (
    <div 
      className={`bg-muted/50 border-y px-2 py-1 flex items-center relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ticker Controls */}
      <div className="absolute left-2 z-10 flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 bg-background/50 backdrop-blur-sm"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isPaused ? 'Play' : 'Pause'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-6 w-6 bg-background/50 backdrop-blur-sm"
                onClick={() => direction === 'left' ? scrollRef.current?.scrollBy(-100, 0) : scrollRef.current?.scrollBy(100, 0)}
              >
                {direction === 'left' ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {direction === 'left' ? 'Move Left' : 'Move Right'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Ticker Content */}
      <div 
        ref={scrollRef} 
        className="overflow-hidden whitespace-nowrap ml-16 scrollbar-hide"
      >
        <div className="inline-block">
          {coins.map((coin) => (
            <span 
              key={coin.id} 
              className="inline-flex items-center mx-4 text-sm"
            >
              {coin.image && (
                <img src={coin.image} alt={coin.name} className="w-5 h-5 mr-1" />
              )}
              <span className="font-medium">{coin.symbol.toUpperCase()}</span>
              <span className="mx-1">${coin.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: coin.price < 1 ? 6 : 2
              })}</span>
              {formatPriceChange(coin.changePercent)}
            </span>
          ))}
          
          {/* Duplicate items to create continuous loop */}
          {coins.map((coin) => (
            <span 
              key={`dup-${coin.id}`} 
              className="inline-flex items-center mx-4 text-sm"
            >
              {coin.image && (
                <img src={coin.image} alt={coin.name} className="w-5 h-5 mr-1" />
              )}
              <span className="font-medium">{coin.symbol.toUpperCase()}</span>
              <span className="mx-1">${coin.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: coin.price < 1 ? 6 : 2
              })}</span>
              {formatPriceChange(coin.changePercent)}
            </span>
          ))}
        </div>
      </div>
      
      {/* Fade effect for edges */}
      <div className="absolute left-16 top-0 bottom-0 w-10 bg-gradient-to-r from-background/50 to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-background/50 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default PriceTicker;
