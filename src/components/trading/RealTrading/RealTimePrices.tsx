
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, RefreshCw, Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { fetchTopCoins } from "@/services/cryptoApi";
import { CoinOption } from "@/types/trading";

interface RealTimePricesProps {
  initialCoins?: CoinOption[];
  onCoinSelect?: (coin: CoinOption) => void;
}

const RealTimePrices: React.FC<RealTimePricesProps> = ({ 
  initialCoins = [],
  onCoinSelect 
}) => {
  const [coins, setCoins] = useState<CoinOption[]>(initialCoins);
  const [isLoading, setIsLoading] = useState(initialCoins.length === 0);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  useEffect(() => {
    if (initialCoins.length === 0) {
      loadCoins();
    }
  }, [initialCoins]);
  
  const loadCoins = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTopCoins(12);
      setCoins(data);
      setLastUpdated(new Date());
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
  
  const handleRefresh = () => {
    loadCoins();
    toast({
      title: "Data Refreshed",
      description: "Latest cryptocurrency prices loaded",
    });
  };
  
  const filteredCoins = searchQuery
    ? coins.filter(coin => 
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : coins;
  
  const handleCoinClick = (coin: CoinOption) => {
    if (onCoinSelect) {
      onCoinSelect(coin);
    }
  };
  
  return (
    <Card className="shadow-md w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Real-Time Prices</CardTitle>
          <Button onClick={handleRefresh} size="icon" variant="ghost">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search coins..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded-md"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredCoins.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground">No coins found</div>
            ) : (
              filteredCoins.map((coin) => {
                const isPriceUp = coin.priceChange && coin.priceChange >= 0;
                
                return (
                  <div
                    key={coin.id}
                    className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleCoinClick(coin)}
                  >
                    <div className="flex items-center">
                      {coin.image && (
                        <img src={coin.image} alt={coin.name} className="h-8 w-8 mr-3 rounded-full" />
                      )}
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">${coin.price.toLocaleString()}</div>
                      {coin.changePercent ? (
                        <div className={`text-xs flex items-center ${isPriceUp ? "text-green-500" : "text-red-500"}`}>
                          {isPriceUp ? (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(coin.changePercent).toFixed(2)}%
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimePrices;
