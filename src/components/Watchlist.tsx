
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, StarOff, ArrowUpRight, ArrowDownRight, Plus, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { fetchCryptoData } from "@/services/enhancedCryptoApi";
import { CryptoData, WatchlistItem } from "@/types/trading";
import { useCurrency } from "@/contexts/CurrencyContext";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { convert, formatValue, activeCurrency } = useCurrency();
  
  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("crypto-watchlist");
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (e) {
        console.error("Error parsing saved watchlist:", e);
      }
    } else {
      // Add default items to watchlist
      setWatchlist([
        {
          id: "bitcoin",
          symbol: "btc",
          name: "Bitcoin",
          image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
          current_price: 58000,
          market_cap: 1100000000000,
          market_cap_rank: 1,
          price_change_percentage_24h: 2.1,
          priceChangePercentage24h: 2.1
        },
        {
          id: "ethereum",
          symbol: "eth",
          name: "Ethereum",
          image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
          current_price: 3500,
          market_cap: 420000000000,
          market_cap_rank: 2,
          price_change_percentage_24h: 2.9,
          priceChangePercentage24h: 2.9
        }
      ]);
    }
  }, []);
  
  // Save watchlist to localStorage when it changes
  useEffect(() => {
    if (watchlist.length > 0) {
      localStorage.setItem("crypto-watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist]);
  
  // Refresh watchlist data
  const refreshWatchlist = async () => {
    if (watchlist.length === 0) return;
    
    setIsLoading(true);
    try {
      const data = await fetchCryptoData(50);
      
      // Update existing watchlist items with fresh data
      const updatedWatchlist = watchlist.map(item => {
        const freshData = data.find(coin => coin.id === item.id);
        if (freshData) {
          return {
            id: freshData.id,
            symbol: freshData.symbol,
            name: freshData.name,
            image: freshData.image,
            current_price: freshData.current_price,
            market_cap: freshData.market_cap,
            market_cap_rank: freshData.market_cap_rank,
            price_change_percentage_24h: freshData.price_change_percentage_24h,
            priceChangePercentage24h: freshData.price_change_percentage_24h
          };
        }
        return item;
      });
      
      setWatchlist(updatedWatchlist);
      toast({
        title: "Watchlist updated",
        description: "Latest prices have been fetched",
      });
    } catch (error) {
      console.error("Error refreshing watchlist:", error);
      toast({
        title: "Update failed",
        description: "Could not refresh watchlist data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addToWatchlist = async (coinId: string) => {
    // Check if already in watchlist
    if (watchlist.some(item => item.id === coinId)) {
      toast({
        title: "Already in watchlist",
        description: "This coin is already in your watchlist",
        variant: "default",
      });
      return;
    }
    
    try {
      const data = await fetchCryptoData(50);
      const coin = data.find(c => c.id === coinId);
      
      if (coin) {
        const newWatchlistItem: WatchlistItem = {
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          image: coin.image,
          current_price: coin.current_price,
          market_cap: coin.market_cap,
          market_cap_rank: coin.market_cap_rank,
          price_change_percentage_24h: coin.price_change_percentage_24h,
          priceChangePercentage24h: coin.price_change_percentage_24h
        };
        
        setWatchlist(prev => [...prev, newWatchlistItem]);
        toast({
          title: "Added to watchlist",
          description: `${coin.name} has been added to your watchlist`,
        });
      } else {
        toast({
          title: "Coin not found",
          description: "Could not find the requested coin",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      toast({
        title: "Error",
        description: "Could not add coin to watchlist",
        variant: "destructive",
      });
    }
  };
  
  const removeFromWatchlist = (coinId: string) => {
    setWatchlist(prev => prev.filter(item => item.id !== coinId));
    toast({
      title: "Removed from watchlist",
      description: "The coin has been removed from your watchlist",
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Watchlist
          </CardTitle>
          <CardDescription>
            Track your favorite cryptocurrencies
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addToWatchlist("solana")}
            title="Add Solana for demo"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Demo
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={refreshWatchlist}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {watchlist.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <StarOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Your watchlist is empty</p>
            <p className="text-sm mt-1">Add coins to track their prices</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-2 py-2 px-3 text-xs font-medium text-muted-foreground">
              <div className="col-span-2">Coin</div>
              <div className="text-right">Rank</div>
              <div className="text-right">Price</div>
              <div className="text-right">24h</div>
              <div className="text-right">Market Cap</div>
              <div className="text-center">Action</div>
            </div>
            
            {watchlist.map((coin) => {
              const priceInCurrency = convert(coin.current_price, "USD", activeCurrency);
              const marketCapInCurrency = convert(coin.market_cap, "USD", activeCurrency);
              
              const isPriceUp = (coin.price_change_percentage_24h || 0) >= 0;
              
              return (
                <div 
                  key={coin.id}
                  className="grid grid-cols-7 gap-2 py-3 px-3 items-center bg-card rounded-lg border border-border/40"
                >
                  {/* Coin */}
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                      <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-medium">{coin.symbol.toUpperCase()}</div>
                      <div className="text-xs text-muted-foreground">{coin.name}</div>
                    </div>
                  </div>
                  
                  {/* Rank */}
                  <div className="text-right">
                    <Badge variant="outline" className="border-muted">#{coin.market_cap_rank}</Badge>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right font-medium">
                    {formatValue(priceInCurrency)}
                  </div>
                  
                  {/* 24h change */}
                  <div className={`text-right ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
                    <span className="inline-flex items-center">
                      {isPriceUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                      {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
                    </span>
                  </div>
                  
                  {/* Market Cap */}
                  <div className="text-right text-muted-foreground">
                    {formatValue(marketCapInCurrency)}
                  </div>
                  
                  {/* Action */}
                  <div className="flex justify-center">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeFromWatchlist(coin.id)}
                    >
                      <StarOff className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Watchlist;
