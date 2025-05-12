
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Star, Trash2 } from "lucide-react";
import { CoinOption } from '@/types/trading';
import CryptoSearch from '@/components/CryptoSearch';

// Sample initial watchlist data
const initialWatchlist: CoinOption[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 35000, image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', changePercent: 2.5 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 2000, image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', changePercent: -1.2 },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: 150, image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png', changePercent: 5.7 }
];

const WatchlistManager = () => {
  const [watchlist, setWatchlist] = useState<CoinOption[]>(initialWatchlist);
  const [showSearch, setShowSearch] = useState(false);
  
  const handleAddToWatchlist = (coin: CoinOption) => {
    if (!watchlist.some(item => item.id === coin.id)) {
      setWatchlist([...watchlist, coin]);
    }
    setShowSearch(false);
  };
  
  const handleRemoveFromWatchlist = (coinId: string) => {
    setWatchlist(watchlist.filter(coin => coin.id !== coinId));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Your Watchlist</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowSearch(!showSearch)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Coin
        </Button>
      </div>
      
      {showSearch && (
        <div className="p-2 mb-2 bg-muted/50 rounded-md">
          <CryptoSearch 
            onSelectCoin={handleAddToWatchlist} 
            placeholder="Search for coins to add..."
          />
        </div>
      )}
      
      <div className="space-y-2">
        {watchlist.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            Your watchlist is empty. Add coins to track their prices.
          </p>
        ) : (
          watchlist.map(coin => (
            <div 
              key={coin.id} 
              className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center">
                {coin.image && (
                  <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                )}
                <div>
                  <p className="font-medium">{coin.symbol.toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground">{coin.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">${coin.price.toLocaleString()}</p>
                  <p className={`text-xs ${(coin.changePercent || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {(coin.changePercent || 0) >= 0 ? '+' : ''}
                    {coin.changePercent?.toFixed(2)}%
                  </p>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveFromWatchlist(coin.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WatchlistManager;
