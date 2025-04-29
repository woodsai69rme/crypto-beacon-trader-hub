
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, ArrowDown, Bell, BellOff, RefreshCw, Search, Plus } from "lucide-react";
import { CoinOption, WatchlistItem } from '@/types/trading';
import { toast } from "@/components/ui/use-toast";

type SortField = 'name' | 'price' | 'change';
type SortOrder = 'asc' | 'desc';

const Watchlist = () => {
  // Sample data
  const initialWatchlist: WatchlistItem[] = [
    {
      id: "1",
      coinId: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 61450.23,
      priceChangePercentage24h: 2.3,
      addedAt: new Date().toISOString(),
      alertSettings: {
        highPrice: 65000,
        lowPrice: 58000,
        percentageChangeThreshold: 5,
        enabled: true
      }
    },
    {
      id: "2",
      coinId: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: 3045.67,
      priceChangePercentage24h: -1.2,
      addedAt: new Date().toISOString(),
      alertSettings: {
        highPrice: 3200,
        lowPrice: 2800,
        percentageChangeThreshold: 5,
        enabled: true
      }
    },
    {
      id: "3",
      coinId: "solana",
      name: "Solana",
      symbol: "SOL",
      price: 143.22,
      priceChangePercentage24h: 4.8,
      addedAt: new Date().toISOString()
    },
    {
      id: "4",
      coinId: "ripple",
      name: "XRP",
      symbol: "XRP",
      price: 0.57,
      priceChangePercentage24h: 0.9,
      addedAt: new Date().toISOString()
    },
    {
      id: "5",
      coinId: "cardano",
      name: "Cardano",
      symbol: "ADA",
      price: 0.45,
      priceChangePercentage24h: -2.1,
      addedAt: new Date().toISOString(),
      alertSettings: {
        highPrice: 0.55,
        percentageChangeThreshold: 10,
        enabled: false
      }
    }
  ];
  
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(initialWatchlist);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"all" | "alerts">("all");
  
  useEffect(() => {
    // Simulate initial data loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // You could refresh price data here
    }, 500);
  }, []);
  
  // Refresh price data with random values
  const refreshPrices = () => {
    setLoading(true);
    
    setTimeout(() => {
      const updatedWatchlist = watchlist.map(item => {
        const priceChange = (Math.random() * 6) - 3; // Random change between -3% and +3%
        const newPrice = item.price * (1 + (priceChange / 100));
        
        // Check for alerts
        if (item.alertSettings?.enabled) {
          if (
            (item.alertSettings.highPrice && newPrice >= item.alertSettings.highPrice) ||
            (item.alertSettings.lowPrice && newPrice <= item.alertSettings.lowPrice) ||
            (item.alertSettings.percentageChangeThreshold && 
             Math.abs(priceChange) >= item.alertSettings.percentageChangeThreshold)
          ) {
            // Show toast alert
            toast({
              title: "Price Alert",
              description: `${item.symbol} price ${priceChange > 0 ? "up" : "down"} to $${newPrice.toFixed(2)}`,
              variant: priceChange > 0 ? "default" : "destructive",
            });
          }
        }
        
        return {
          ...item,
          price: newPrice,
          priceChangePercentage24h: priceChange
        };
      });
      
      setWatchlist(updatedWatchlist);
      setLoading(false);
    }, 1000);
  };
  
  // Sort and filter the watchlist
  const filteredAndSortedWatchlist = React.useMemo(() => {
    let filtered = watchlist.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (view === "alerts") {
      filtered = filtered.filter(item => item.alertSettings?.enabled);
    }
    
    return filtered.sort((a, b) => {
      if (sortField === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === 'price') {
        return sortOrder === 'asc'
          ? a.price - b.price
          : b.price - a.price;
      } else {
        return sortOrder === 'asc'
          ? a.priceChangePercentage24h - b.priceChangePercentage24h
          : b.priceChangePercentage24h - a.priceChangePercentage24h;
      }
    });
  }, [watchlist, searchTerm, sortField, sortOrder, view]);
  
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  const toggleAlert = (id: string) => {
    setWatchlist(watchlist.map(item => {
      if (item.id === id) {
        if (item.alertSettings) {
          return {
            ...item,
            alertSettings: {
              ...item.alertSettings,
              enabled: !item.alertSettings.enabled
            }
          };
        } else {
          return {
            ...item,
            alertSettings: {
              highPrice: item.price * 1.05,
              lowPrice: item.price * 0.95,
              percentageChangeThreshold: 5,
              enabled: true
            }
          };
        }
      }
      return item;
    }));
  };
  
  const addRandomCoin = () => {
    const sampleCoins: CoinOption[] = [
      { id: "polkadot", name: "Polkadot", symbol: "DOT", price: 5.78, value: "polkadot", label: "Polkadot" },
      { id: "avalanche", name: "Avalanche", symbol: "AVAX", price: 35.67, value: "avalanche", label: "Avalanche" },
      { id: "chainlink", name: "Chainlink", symbol: "LINK", price: 15.23, value: "chainlink", label: "Chainlink" },
      { id: "polygon", name: "Polygon", symbol: "MATIC", price: 0.89, value: "polygon", label: "Polygon" },
      { id: "uniswap", name: "Uniswap", symbol: "UNI", price: 7.45, value: "uniswap", label: "Uniswap" },
    ];
    
    // Find a coin not already in the watchlist
    const availableCoins = sampleCoins.filter(
      coin => !watchlist.some(item => item.coinId === coin.id)
    );
    
    if (availableCoins.length === 0) {
      toast({
        title: "No more coins available",
        description: "You've added all available sample coins to your watchlist",
        variant: "destructive",
      });
      return;
    }
    
    const randomCoin = availableCoins[Math.floor(Math.random() * availableCoins.length)];
    
    const newItem: WatchlistItem = {
      id: Date.now().toString(),
      coinId: randomCoin.id,
      name: randomCoin.name,
      symbol: randomCoin.symbol,
      price: randomCoin.price,
      priceChangePercentage24h: (Math.random() * 10) - 5, // Random between -5% and +5%
      addedAt: new Date().toISOString()
    };
    
    setWatchlist([...watchlist, newItem]);
    
    toast({
      title: "Coin Added",
      description: `${randomCoin.name} has been added to your watchlist`,
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle>Watchlist</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={view} onValueChange={(value) => setView(value as "all" | "alerts")}>
            <SelectTrigger className="h-8 w-[100px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="alerts">Alerts</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={refreshPrices}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coins..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="ml-2 whitespace-nowrap" onClick={addRandomCoin}>
            <Plus className="h-4 w-4 mr-1" /> Add Coin
          </Button>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer" 
                  onClick={() => toggleSort('name')}
                >
                  Coin {sortField === 'name' && (
                    sortOrder === 'asc' ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-right" 
                  onClick={() => toggleSort('price')}
                >
                  Price {sortField === 'price' && (
                    sortOrder === 'asc' ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-right" 
                  onClick={() => toggleSort('change')}
                >
                  24h Change {sortField === 'change' && (
                    sortOrder === 'asc' ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />
                  )}
                </TableHead>
                <TableHead className="w-[50px]">Alert</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedWatchlist.length > 0 ? (
                filteredAndSortedWatchlist.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.symbol}</div>
                      <div className="text-xs text-muted-foreground">{item.name}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${item.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={item.priceChangePercentage24h >= 0 ? "outline" : "destructive"} className={
                        item.priceChangePercentage24h >= 0 ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : ""
                      }>
                        {item.priceChangePercentage24h >= 0 ? "+" : ""}
                        {item.priceChangePercentage24h.toFixed(2)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => toggleAlert(item.id)}
                      >
                        {item.alertSettings?.enabled ? (
                          <Bell className="h-4 w-4 text-primary" />
                        ) : (
                          <BellOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    {searchTerm ? "No coins match your search" : "Your watchlist is empty"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Watchlist;
