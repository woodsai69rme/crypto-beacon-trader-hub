
import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsTickerProps } from '@/types/trading';

const NewsTicker: React.FC<NewsTickerProps> = ({
  items = [],
  speed = 30,
  direction = 'left',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [tickerWidth, setTickerWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  
  useEffect(() => {
    if (tickerRef.current && containerRef.current) {
      setTickerWidth(tickerRef.current.offsetWidth);
      setContainerWidth(containerRef.current.offsetWidth);
    }
    
    const handleResize = () => {
      if (tickerRef.current && containerRef.current) {
        setTickerWidth(tickerRef.current.offsetWidth);
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [items]);
  
  const directionValue = direction === 'left' ? -1 : 1;
  const duration = Math.max(tickerWidth / speed * 10, 10);
  
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`w-full bg-muted overflow-hidden border-y ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={tickerRef}
        className="flex items-center whitespace-nowrap"
        style={{
          transform: `translateX(${directionValue === -1 ? 0 : -tickerWidth}px)`,
          animation: `${isPaused ? 'paused' : 'running'} ${duration}s linear infinite`,
          animationName: 'ticker-slide',
        }}
      >
        {items.map((item, index) => (
          <a
            key={`${item.id}-${index}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-1.5 mx-3 hover:bg-secondary/50 rounded transition-colors"
          >
            <span className="font-semibold text-foreground">{item.source}:</span>
            <span className="ml-2 text-foreground/80 mr-2">{item.title}</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>
        ))}
      </div>
      
      <style>
        {`
          @keyframes ticker-slide {
            0% {
              transform: translateX(${directionValue === -1 ? containerWidth : -tickerWidth}px);
            }
            100% {
              transform: translateX(${directionValue === -1 ? -tickerWidth : containerWidth}px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default NewsTicker;
