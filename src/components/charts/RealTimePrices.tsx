
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import CryptoSearch from '@/components/CryptoSearch';
import { CoinOption } from '@/types/trading';

interface RealTimePricesProps {
  initialCoins?: CoinOption[];
}

const RealTimePrices: React.FC<RealTimePricesProps> = ({ initialCoins = [] }) => {
  const [coins, setCoins] = useState<CoinOption[]>(initialCoins);
  
  const handleAddCoin = (coin: CoinOption) => {
    if (!coins.some(c => c.id === coin.id)) {
      setCoins([...coins, coin]);
    }
  };
  
  const handleRemoveCoin = (coinId: string) => {
    setCoins(coins.filter(coin => coin.id !== coinId));
  };
  
  return (
    <div className="space-y-4">
      <CryptoSearch 
        onSelectCoin={handleAddCoin}
        placeholder="Search for cryptocurrencies..."
        className="mb-4"
      />
      
      {coins.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Search and add cryptocurrencies to track their prices</p>
        </div>
      ) : (
        <div className="space-y-2">
          {coins.map(coin => (
            <div 
              key={coin.id}
              className="flex items-center justify-between p-3 bg-card rounded-lg border"
            >
              <div className="flex items-center gap-3">
                {coin.image && (
                  <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                )}
                <div>
                  <h3 className="font-semibold">{coin.symbol.toUpperCase()}</h3>
                  <p className="text-sm text-muted-foreground">{coin.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-mono font-medium">${coin.price.toLocaleString()}</p>
                  <p className={`text-sm flex items-center ${
                    (coin.changePercent || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {(coin.changePercent || 0) >= 0 ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(coin.changePercent || 0).toFixed(2)}%
                  </p>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveCoin(coin.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RealTimePrices;
