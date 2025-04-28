
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronUp, ChevronDown, Activity, ArrowUpDown } from "lucide-react";
import { startPriceMonitoring } from "@/services/priceMonitoring";
import { CoinOption } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

interface RealTimePricesProps {
  initialCoins: CoinOption[];
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
}

const RealTimePrices: React.FC<RealTimePricesProps> = ({ initialCoins, selectedCoinId, onSelectCoin }) => {
  const [coins, setCoins] = useState<CoinOption[]>(initialCoins);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [view, setView] = useState<string>("all");
  const [latestUpdates, setLatestUpdates] = useState<{ id: string, timestamp: number }[]>([]);
  
  useEffect(() => {
    const stopMonitoring = startPriceMonitoring(
      initialCoins.map(coin => coin.id),
      (updatedCoins) => {
        setCoins(current => {
          const updatedList = current.map(coin => {
            const updatedCoin = updatedCoins.find(c => c.id === coin.id);
            if (!updatedCoin) return coin;
            
            const priceChange = updatedCoin.price - coin.price;
            const changePercent = (priceChange / coin.price) * 100;
            
            setLatestUpdates(prev => {
              const newUpdates = prev.filter(u => u.id !== coin.id);
              return [...newUpdates, { id: coin.id, timestamp: Date.now() }]
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 10);
            });
            
            return {
              ...coin,
              ...updatedCoin,
              priceChange,
              changePercent
            };
          });
          
          return updatedList;
        });
      },
      5000
    );
    
    toast({
      title: "Real-Time Updates Active",
      description: "Prices will update every 5 seconds"
    });
    
    return () => stopMonitoring();
  }, [initialCoins]);
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      toggleSortDirection();
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };
  
  const sortedCoins = [...coins].sort((a, b) => {
    let compareResult = 0;
    
    switch (sortBy) {
      case "name":
        compareResult = a.name.localeCompare(b.name);
        break;
      case "price":
        compareResult = a.price - b.price;
        break;
      case "symbol":
        compareResult = a.symbol.localeCompare(b.symbol);
        break;
      default:
        compareResult = 0;
    }
    
    return sortDirection === "asc" ? compareResult : -compareResult;
  });
  
  const filteredCoins = view === "all" 
    ? sortedCoins 
    : sortedCoins.filter(coin => latestUpdates.some(update => update.id === coin.id));
  
  const isRecent = (coinId: string): boolean => {
    const update = latestUpdates.find(u => u.id === coinId);
    if (!update) return false;
    return Date.now() - update.timestamp < 5000;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time Market Prices
          </CardTitle>
          <Badge variant="outline" className="animate-pulse">LIVE</Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={view} onValueChange={setView} className="mb-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="all">All Coins</TabsTrigger>
            <TabsTrigger value="updated">Recent Updates</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="rounded-md border">
          <div className="grid grid-cols-4 p-2 bg-muted/50 text-sm font-medium">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Name
              {sortBy === "name" && (
                <ArrowUpDown className="ml-1 h-3 w-3" />
              )}
            </div>
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => handleSort("symbol")}
            >
              Symbol
              {sortBy === "symbol" && (
                <ArrowUpDown className="ml-1 h-3 w-3" />
              )}
            </div>
            <div 
              className="flex items-center cursor-pointer text-right justify-end"
              onClick={() => handleSort("price")}
            >
              Price
              {sortBy === "price" && (
                <ArrowUpDown className="ml-1 h-3 w-3" />
              )}
            </div>
            <div className="text-right">Change</div>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {filteredCoins.length > 0 ? (
              filteredCoins.map((coin) => {
                const recent = isRecent(coin.id);
                const priceChangeClass = (coin.priceChange || 0) > 0 
                  ? "text-green-500" 
                  : (coin.priceChange || 0) < 0 
                    ? "text-red-500" 
                    : "";
                
                return (
                  <div 
                    key={coin.id}
                    className={`grid grid-cols-4 p-2 border-t ${
                      recent ? "bg-green-500/5" : ""
                    } transition-colors ${
                      selectedCoinId === coin.id ? "bg-muted" : ""
                    } ${
                      onSelectCoin ? "cursor-pointer hover:bg-muted/50" : ""
                    }`}
                    onClick={() => onSelectCoin?.(coin.id)}
                  >
                    <div>{coin.name}</div>
                    <div>{coin.symbol}</div>
                    <div className={`text-right ${priceChangeClass} ${recent ? "font-medium" : ""}`}>
                      ${coin.price.toFixed(2)}
                    </div>
                    <div className="flex items-center justify-end">
                      {(coin.priceChange || 0) > 0 ? (
                        <span className="flex items-center text-green-500">
                          <ChevronUp className="h-4 w-4 mr-1" />
                          {Math.abs(coin.changePercent || 0).toFixed(2)}%
                        </span>
                      ) : (coin.priceChange || 0) < 0 ? (
                        <span className="flex items-center text-red-500">
                          <ChevronDown className="h-4 w-4 mr-1" />
                          {Math.abs(coin.changePercent || 0).toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0.00%</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No coins available
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePrices;
