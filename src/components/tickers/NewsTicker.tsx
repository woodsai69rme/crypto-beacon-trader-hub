
import React, { useRef, useState, useEffect } from 'react';
import { NewsTickerProps } from '@/types/trading';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const NewsTicker: React.FC<NewsTickerProps> = ({
  items,
  speed = 30,
  direction = 'left',
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
    // We use the speed setting to adjust this value (0.1 to 1 pixels per frame for news)
    const step = (speed / 100) * (direction === 'left' ? 1 : -1);
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
  }, [speed, direction, isPaused, items]);
  
  // Auto-pause when hovering
  useEffect(() => {
    if (isHovered && !isPaused) {
      setIsPaused(true);
    } else if (!isHovered && isPaused) {
      setIsPaused(false);
    }
  }, [isHovered, isPaused]);
  
  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };
  
  return (
    <div 
      className={`bg-muted/30 border-y px-2 py-1 flex items-center relative ${className}`}
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
          {items.map((item) => (
            <a 
              key={item.id} 
              href={item.url} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mx-6 text-sm hover:underline"
            >
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium mr-2">
                {item.source}
              </span>
              <span>{item.title}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                {formatRelativeTime(item.timestamp)}
              </span>
            </a>
          ))}
          
          {/* Duplicate items to create continuous loop */}
          {items.map((item) => (
            <a 
              key={`dup-${item.id}`} 
              href={item.url} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mx-6 text-sm hover:underline"
            >
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium mr-2">
                {item.source}
              </span>
              <span>{item.title}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                {formatRelativeTime(item.timestamp)}
              </span>
            </a>
          ))}
        </div>
      </div>
      
      {/* Fade effect for edges */}
      <div className="absolute left-16 top-0 bottom-0 w-10 bg-gradient-to-r from-background/50 to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-background/50 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default NewsTicker;
