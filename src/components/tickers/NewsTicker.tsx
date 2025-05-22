
import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, PauseCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NewsTickerProps } from "@/types/trading";

const NewsTicker: React.FC<NewsTickerProps> = ({ 
  items = [], // Provide default empty array
  speed = 30, 
  direction = 'left',
  className 
}) => {
  const tickerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentDirection, setCurrentDirection] = useState<'left' | 'right'>(direction);
  
  // Guard against undefined items early
  const safeItems = items || [];
  
  useEffect(() => {
    if (!tickerRef.current || safeItems.length === 0 || isPaused) return;
    
    const tickerContent = tickerRef.current;
    const animationName = `ticker-${currentDirection}`;
    
    // Reset animation
    tickerContent.style.animation = 'none';
    tickerContent.offsetHeight; // Trigger reflow
    
    // Apply animation with dynamic speed
    const animationDuration = `${safeItems.length * speed}s`;
    tickerContent.style.animation = `${animationName} ${animationDuration} linear infinite`;
    
    return () => {
      if (tickerContent) {
        tickerContent.style.animation = 'none';
      }
    };
  }, [safeItems, speed, isPaused, currentDirection]);

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  const changeDirection = () => {
    setCurrentDirection(prev => prev === 'left' ? 'right' : 'left');
  };
  
  // Guard against empty items
  if (safeItems.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
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
          {[...safeItems, ...safeItems].map((item, index) => (
            <a 
              key={`${item.id}-${index}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ticker-item inline-block px-4 py-2 hover:bg-accent/50 transition-colors"
            >
              <span className="font-semibold text-primary">{item.source}</span>
              <span className="mx-2">•</span>
              <span>{item.title}</span>
              <span className="ml-2 text-sm text-muted-foreground">{new Date(item.timestamp).toLocaleDateString()}</span>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${(safeItems.length || 1) * 300}px); }
        }

        @keyframes ticker-right {
          0% { transform: translateX(-${(safeItems.length || 1) * 300}px); }
          100% { transform: translateX(0); }
        }

        .ticker-content {
          animation: ticker-${currentDirection} ${(safeItems.length || 1) * speed}s linear infinite;
        }

        .animation-paused {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
