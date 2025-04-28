
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { ChevronUp, ChevronDown, Star, Trash, Plus, Search } from "lucide-react";
import { WatchlistItem, CryptoData } from '@/types/trading';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('cryptoWatchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    } else {
      // Initialize with default coins if no watchlist exists
      const defaultWatchlist: WatchlistItem[] = [
        {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "BTC",
          image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
          current_price: 61245.32,
          price_change_percentage_24h: 2.3,
          market_cap: 1180000000000,
          market_cap_rank: 1,
          addedAt: new Date().toISOString()
        },
        {
          id: "ethereum",
          name: "Ethereum",
          symbol: "ETH",
          image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
          current_price: 3010.45,
          price_change_percentage_24h: -1.5,
          market_cap: 360000000000,
          market_cap_rank: 2,
          addedAt: new Date().toISOString()
        }
      ];
      setWatchlist(defaultWatchlist);
      localStorage.setItem('cryptoWatchlist', JSON.stringify(defaultWatchlist));
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (watchlist.length > 0) {
      localStorage.setItem('cryptoWatchlist', JSON.stringify(watchlist));
    }
  }, [watchlist]);
  
  // Handle search for coins
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // In a real app, this would be an API call to CoinGecko or similar
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      const mockResults: CryptoData[] = [
        {
          id: "solana",
          symbol: "sol",
          name: "Solana",
          image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
          current_price: 142.87,
          market_cap: 62000000000,
          market_cap_rank: 5,
          price_change_percentage_24h: 6.1
        },
        {
          id: "cardano",
          symbol: "ada",
          name: "Cardano",
          image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
          current_price: 0.45,
          market_cap: 16000000000,
          market_cap_rank: 9,
          price_change_percentage_24h: 2.2
        }
      ];
      
      setSearchResults(mockResults.filter(coin => 
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      setIsLoading(false);
    }, 500);
  };
  
  // Add coin to watchlist
  const addToWatchlist = (coin: CryptoData) => {
    if (watchlist.some(item => item.id === coin.id)) {
      toast({
        title: "Already in Watchlist",
        description: `${coin.name} is already in your watchlist`,
        variant: "destructive"
      });
      return;
    }
    
    const newItem: WatchlistItem = {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      addedAt: new Date().toISOString()
    };
    
    setWatchlist([...watchlist, newItem]);
    setSearchResults([]);
    setSearchQuery('');
    
    toast({
      title: "Added to Watchlist",
      description: `${coin.name} has been added to your watchlist`
    });
  };
  
  // Remove coin from watchlist
  const removeFromWatchlist = (coinId: string) => {
    const coinToRemove = watchlist.find(coin => coin.id === coinId);
    if (!coinToRemove) return;
    
    setWatchlist(watchlist.filter(coin => coin.id !== coinId));
    
    toast({
      title: "Removed from Watchlist",
      description: `${coinToRemove.name} has been removed from your watchlist`
    });
  };
  
  // Format market cap with abbreviation
  const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              Watchlist
            </CardTitle>
            <CardDescription>
              Track your favorite cryptocurrencies
            </CardDescription>
          </div>
          
          <div className="flex">
            <div className="relative">
              <Input
                placeholder="Search coins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-36 sm:w-48"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={handleSearch}
                disabled={isLoading}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-4 border rounded-md p-2">
            <div className="text-sm font-medium mb-2">Search Results</div>
            <div className="space-y-2">
              {searchResults.map((coin) => (
                <div key={coin.id} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center">
                    {coin.image && (
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="h-6 w-6 mr-2"
                      />
                    )}
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-xs text-muted-foreground">{coin.symbol.toUpperCase()}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addToWatchlist(coin)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Watchlist Table */}
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-2">#</th>
                <th className="text-left p-2">Coin</th>
                <th className="text-right p-2">Price</th>
                <th className="text-right p-2">24h</th>
                <th className="text-right p-2 hidden md:table-cell">Market Cap</th>
                <th className="text-right p-2"></th>
              </tr>
            </thead>
            <tbody>
              {watchlist.length > 0 ? (
                watchlist.map((coin) => (
                  <tr key={coin.id} className="border-t hover:bg-muted/30">
                    <td className="p-2">
                      {coin.market_cap_rank ? (
                        <Badge variant="outline">{coin.market_cap_rank}</Badge>
                      ) : (
                        <Badge variant="outline">-</Badge>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center">
                        {coin.image && (
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="h-6 w-6 mr-2"
                          />
                        )}
                        <div>
                          <div className="font-medium">{coin.name}</div>
                          <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-right">
                      ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                    </td>
                    <td className="p-2 text-right">
                      {coin.price_change_percentage_24h !== undefined && (
                        <span className={`flex items-center justify-end ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {coin.price_change_percentage_24h >= 0 ? (
                            <ChevronUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ChevronDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-right hidden md:table-cell">
                      {coin.market_cap && formatMarketCap(coin.market_cap)}
                    </td>
                    <td className="p-2 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => removeFromWatchlist(coin.id)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">
                    No coins in your watchlist yet. Use the search to add some!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Watchlist;
