
import React from 'react';
import { CoinOption } from '@/types/trading';

export interface RealTimePricesProps {
  coins?: CoinOption[]; 
  refreshInterval?: number;
  onSelectCoin?: (coinId: string) => void;
  selectedCoinId?: string;
  isLoading?: boolean;
  initialCoins?: CoinOption[];
}

const RealTimePrices: React.FC<RealTimePricesProps> = ({ 
  coins = [], 
  refreshInterval,
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

