
import React, { useEffect, useState } from 'react';
import { NewsTickerProps } from '@/types/trading';
import { cn } from '@/lib/utils';

const NewsTicker: React.FC<NewsTickerProps> = ({
  items,
  speed = 50,
  direction = 'left',
  className
}) => {
  const [isPaused, setIsPaused] = useState(false);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div 
      className={cn("overflow-hidden bg-muted/30 border-y", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`flex whitespace-nowrap ${isPaused ? '' : 'animate-scroll'}`}>
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center px-8 py-2 text-sm">
            <span className="font-medium mr-2">{item.source}:</span>
            <span className="text-muted-foreground">{item.title}</span>
            {item.sentiment && (
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                item.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                item.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.sentiment}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
