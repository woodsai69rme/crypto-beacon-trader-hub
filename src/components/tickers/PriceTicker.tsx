
import React, { useState, useEffect, useRef } from 'react';
import { ArrowTrendingUp, ArrowTrendingDown } from 'lucide-react';
import { useUI } from '@/contexts/UIContext';
import { CoinOption } from '@/types/trading';

interface PriceTickerProps {
  coins: CoinOption[];
  speed?: number;
  position?: 'top' | 'bottom';
  onSelectCoin?: (coinId: string) => void;
  className?: string;
}

export const PriceTicker = ({ 
  coins,
  speed,
  position = 'top',
  onSelectCoin,
  className
}: PriceTickerProps) => {
  const [hoveredCoin, setHoveredCoin] = useState<string | null>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const { tickerSettings } = useUI();
  
  const isEnabled = tickerSettings.enabled !== false;
  const tickerSpeed = speed || tickerSettings.speed || 40;
  const tickerDirection = tickerSettings.direction || 'left';
  const shouldAutoPause = tickerSettings.autoPause !== false;
  
  const [isPaused, setIsPaused] = useState(false);
  
  // Pause animation on hover if autoPause is enabled
  useEffect(() => {
    if (!shouldAutoPause || !tickerRef.current) return;
    
    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);
    
    tickerRef.current.addEventListener('mouseenter', handleMouseEnter);
    tickerRef.current.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      if (tickerRef.current) {
        tickerRef.current.removeEventListener('mouseenter', handleMouseEnter);
        tickerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [shouldAutoPause]);
  
  if (!isEnabled || !coins || coins.length === 0) {
    return null;
  }
  
  const handleCoinClick = (coinId: string) => {
    if (onSelectCoin) {
      onSelectCoin(coinId);
    }
  };
  
  // Calculate animation duration based on content length and speed
  const tickerItems = coins.length * 2; // Double the items for seamless looping
  const animationDuration = (tickerItems * 10) / (tickerSpeed / 10);
  
  return (
    <div 
      className={`w-full overflow-hidden relative bg-background border-b dark:border-gray-800 ${
        position === 'bottom' ? 'border-t border-b-0' : 'border-b'
      } ${className || ''}`}
      ref={tickerRef}
    >
      <style jsx global>
        {`
          @keyframes tickerAnimation {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          
          .ticker-content {
            display: flex;
            animation: tickerAnimation ${animationDuration}s linear infinite;
            animation-direction: ${tickerDirection === 'right' ? 'reverse' : 'normal'};
          }
          
          .ticker-content.paused {
            animation-play-state: paused;
          }
          
          .ticker-item {
            white-space: nowrap;
            padding: 0 20px;
            display: flex;
            align-items: center;
            transition: background-color 0.2s;
          }
          
          .ticker-item:hover {
            background-color: rgba(0, 0, 0, 0.05);
            cursor: pointer;
          }
          
          .dark .ticker-item:hover {
            background-color: rgba(255, 255, 255, 0.05);
          }
        `}
      </style>
      
      <div className={`ticker-content ${isPaused ? 'paused' : ''}`}>
        {/* First set of items */}
        {coins.map((coin) => (
          <div 
            key={`ticker-1-${coin.id}`}
            className="ticker-item"
            onClick={() => handleCoinClick(coin.id)}
            onMouseEnter={() => setHoveredCoin(coin.id)}
            onMouseLeave={() => setHoveredCoin(null)}
          >
            {coin.image && (
              <img 
                src={coin.image} 
                alt={coin.name} 
                className="w-5 h-5 mr-2" 
              />
            )}
            <div className="flex items-center">
              <span className="font-medium mr-1.5">{coin.symbol}</span>
              <span className="text-sm hidden md:inline mr-2 text-muted-foreground">{coin.name}</span>
              <span className="font-medium">
                ${coin.price?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
              <span className={`ml-1.5 flex items-center ${
                (coin.changePercent || 0) >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {(coin.changePercent || 0) >= 0 ? (
                  <ArrowTrendingUp size={14} className="mr-0.5" />
                ) : (
                  <ArrowTrendingDown size={14} className="mr-0.5" />
                )}
                {Math.abs(coin.changePercent || 0).toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
        
        {/* Duplicate set for seamless looping */}
        {coins.map((coin) => (
          <div 
            key={`ticker-2-${coin.id}`}
            className="ticker-item"
            onClick={() => handleCoinClick(coin.id)}
            onMouseEnter={() => setHoveredCoin(coin.id)}
            onMouseLeave={() => setHoveredCoin(null)}
          >
            {coin.image && (
              <img 
                src={coin.image} 
                alt={coin.name}
                className="w-5 h-5 mr-2"
              />
            )}
            <div className="flex items-center">
              <span className="font-medium mr-1.5">{coin.symbol}</span>
              <span className="text-sm hidden md:inline mr-2 text-muted-foreground">{coin.name}</span>
              <span className="font-medium">
                ${coin.price?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
              <span className={`ml-1.5 flex items-center ${
                (coin.changePercent || 0) >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {(coin.changePercent || 0) >= 0 ? (
                  <ArrowTrendingUp size={14} className="mr-0.5" />
                ) : (
                  <ArrowTrendingDown size={14} className="mr-0.5" />
                )}
                {Math.abs(coin.changePercent || 0).toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTicker;
