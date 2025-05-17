
import React from 'react';
import { RealTimePricesProps, CoinOption } from '@/types/trading';

// Update component to match the RealTimePricesProps interface
const RealTimePrices: React.FC<RealTimePricesProps> = ({ 
  coins = [], 
  refreshInterval, // keep this prop even though we're not using it in this component
  onSelectCoin,
  selectedCoinId,
  isLoading,
  initialCoins
}) => {
  // Use initialCoins if provided, otherwise use coins
  const displayCoins = initialCoins || coins;
  
  return (
    <div>
      {isLoading ? (
        <div>Loading price data...</div>
      ) : (
        <div>
          {displayCoins?.map(coin => (
            <div 
              key={coin.id} 
              onClick={() => onSelectCoin && onSelectCoin(coin.id)}
              className={`cursor-pointer ${selectedCoinId === coin.id ? 'bg-accent' : ''}`}
            >
              {coin.name} ({coin.symbol}): {coin.price}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RealTimePrices;
