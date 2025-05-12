
import React, { useState, useEffect } from 'react';
import { CoinOption } from '@/types/trading';
import { useUI } from '@/contexts/UIContext';
import { cn } from '@/lib/utils';

interface PriceTickerProps {
  coins: CoinOption[];
  speed?: number;
  direction?: 'left' | 'right';
}

const PriceTicker: React.FC<PriceTickerProps> = ({ 
  coins,
  speed,
  direction = 'left' 
}) => {
  const { tickerSettings } = useUI();
  const [isPaused, setIsPaused] = useState(false);
  
  // Use provided props or default to settings
  const tickerSpeed = speed || tickerSettings.speed;
  const tickerDirection = direction || tickerSettings.direction;
  
  // Calculate animation duration based on speed and content length
  // Slower speed = longer duration = slower movement
  const baseSpeed = 30; // base speed in seconds
  const contentLength = coins.length * 200; // rough estimate of content width
  const animationDuration = baseSpeed * (1 / (tickerSpeed / 40)) * (contentLength / 1000);
  
  const handleMouseEnter = () => {
    if (tickerSettings.autoPause) {
      setIsPaused(true);
    }
  };
  
  const handleMouseLeave = () => {
    setIsPaused(false);
  };
  
  return (
    <div 
      className="w-full bg-background border-y border-border overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={cn(
          "flex items-center whitespace-nowrap py-2 animate-scroll",
          isPaused && "animation-play-state-paused"
        )}
        style={{
          animationDuration: `${animationDuration}s`,
          animationDirection: tickerDirection === 'right' ? 'reverse' : 'normal'
        }}
      >
        {coins.map((coin, index) => (
          <React.Fragment key={`${coin.id}-${index}`}>
            <div className="flex items-center space-x-2 mx-4">
              {coin.image && (
                <div className="w-5 h-5 flex-shrink-0">
                  <img src={coin.image} alt={coin.symbol} className="w-full h-full" />
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <span className="font-medium">{coin.symbol.toUpperCase()}</span>
                <span className="text-muted-foreground hidden md:inline-block max-w-32 truncate">{coin.name}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span className="font-medium">${coin.price.toLocaleString(undefined, { 
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                })}</span>
                <span className={`text-xs ${coin.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {coin.changePercent >= 0 ? '▲' : '▼'} {Math.abs(coin.changePercent).toFixed(2)}%
                </span>
              </div>
            </div>
            
            <div className="h-4 border-r border-border mx-2" />
          </React.Fragment>
        ))}
        
        {/* Duplicate items to create seamless loop */}
        {coins.slice(0, 5).map((coin, index) => (
          <React.Fragment key={`${coin.id}-dup-${index}`}>
            <div className="flex items-center space-x-2 mx-4">
              {coin.image && (
                <div className="w-5 h-5 flex-shrink-0">
                  <img src={coin.image} alt={coin.symbol} className="w-full h-full" />
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <span className="font-medium">{coin.symbol.toUpperCase()}</span>
                <span className="text-muted-foreground hidden md:inline-block max-w-32 truncate">{coin.name}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span className="font-medium">${coin.price.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                })}</span>
                <span className={`text-xs ${coin.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {coin.changePercent >= 0 ? '▲' : '▼'} {Math.abs(coin.changePercent).toFixed(2)}%
                </span>
              </div>
            </div>
            
            <div className="h-4 border-r border-border mx-2" />
          </React.Fragment>
        ))}
      </div>
      
      {/* Add CSS for animation */}
      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${coins.length * 200}px); }
        }
        
        .animate-scroll {
          animation: scroll linear infinite;
        }
        
        .animation-play-state-paused {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default PriceTicker;
