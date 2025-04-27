
import { useState, useEffect } from "react";
import { Star, Trash, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { fetchTopCoins } from "../services/cryptoApi";
import { CryptoData } from "../services/cryptoApi";

interface WatchlistItem extends CryptoData {
  isInWatchlist: boolean;
}

const Watchlist = () => {
  const [coins, setCoins] = useState<WatchlistItem[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnlyWatchlist, setShowOnlyWatchlist] = useState(false);
  
  // Load watchlist from localStorage
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("cryptoWatchlist");
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (error) {
        console.error("Failed to load watchlist:", error);
      }
    }
    
    loadCoins();
  }, []);
  
  // Save watchlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cryptoWatchlist", JSON.stringify(watchlist));
  }, [watchlist]);
  
  const loadCoins = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTopCoins(20) as unknown as CryptoData[];
      
      // Mark coins in watchlist
      const coinsWithWatchlist = data.map(coin => ({
        ...coin,
        isInWatchlist: watchlist.includes(coin.id)
      }));
      
      setCoins(coinsWithWatchlist);
    } catch (error) {
      console.error("Failed to load coins:", error);
      toast({
        title: "Error",
        description: "Failed to load cryptocurrency data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleWatchlist = (coinId: string) => {
    if (watchlist.includes(coinId)) {
      setWatchlist(watchlist.filter(id => id !== coinId));
      setCoins(coins.map(coin => 
        coin.id === coinId ? { ...coin, isInWatchlist: false } : coin
      ));
      toast({
        title: "Removed",
        description: "Coin removed from your watchlist",
      });
    } else {
      setWatchlist([...watchlist, coinId]);
      setCoins(coins.map(coin => 
        coin.id === coinId ? { ...coin, isInWatchlist: true } : coin
      ));
      toast({
        title: "Added",
        description: "Coin added to your watchlist",
      });
    }
  };
  
  const displayedCoins = showOnlyWatchlist 
    ? coins.filter(coin => watchlist.includes(coin.id))
    : coins;
  
  return (
    <div className="crypto-card">
      <div className="crypto-card-header">
        <h2 className="text-lg font-bold">Watchlist</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowOnlyWatchlist(!showOnlyWatchlist)}
        >
          {showOnlyWatchlist ? "Show All" : "Show Watchlist"}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {displayedCoins.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>{showOnlyWatchlist ? "Your watchlist is empty." : "No coins available."}</p>
              <p className="mt-1 text-sm">
                {showOnlyWatchlist 
                  ? "Add coins to your watchlist to track them here." 
                  : "Please try again later."}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs text-muted-foreground">
                <tr>
                  <th className="pb-2 pl-2">#</th>
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">24h %</th>
                  <th className="pb-2">Market Cap</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {displayedCoins.map((coin) => {
                  const isPriceUp = (coin.price_change_percentage_24h ?? 0) >= 0;
                  
                  return (
                    <tr key={coin.id} className="border-b border-border hover:bg-crypto-dark-hover">
                      <td className="py-3 pl-2">{coin.market_cap_rank}</td>
                      <td>
                        <div className="flex items-center">
                          {coin.image ? (
                            <img src={coin.image} alt={coin.name} className="mr-2 h-6 w-6 rounded-full" />
                          ) : (
                            <div className="mr-2 h-6 w-6 rounded-full bg-secondary"></div>
                          )}
                          <div>
                            <div className="font-medium">{coin.name}</div>
                            <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td>${coin.current_price.toLocaleString()}</td>
                      <td className={isPriceUp ? "text-crypto-green" : "text-crypto-red"}>
                        <div className="flex items-center">
                          {isPriceUp ? (
                            <ArrowUp className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="mr-1 h-3 w-3" />
                          )}
                          {Math.abs(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
                        </div>
                      </td>
                      <td>${(coin.market_cap / 1000000000).toFixed(2)}B</td>
                      <td>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${
                            coin.isInWatchlist 
                              ? "text-primary hover:text-destructive" 
                              : "text-muted-foreground hover:text-primary"
                          }`}
                          onClick={() => toggleWatchlist(coin.id)}
                        >
                          <Star className="h-4 w-4" fill={coin.isInWatchlist ? "currentColor" : "none"} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
      
      <div className="mt-4 text-center">
        <Button 
          variant="outline"
          size="sm"
          className="text-primary hover:text-primary hover:bg-crypto-dark-hover"
          onClick={loadCoins}
        >
          Refresh Data
        </Button>
      </div>
    </div>
  );
};

export default Watchlist;
