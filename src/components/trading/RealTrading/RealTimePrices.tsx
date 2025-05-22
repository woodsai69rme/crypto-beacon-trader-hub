
import React, { useState, useEffect } from 'react';
import { convertToCoinOptions, fetchMultipleCryptoData } from '@/services/cryptoService';
import { CoinOption } from '@/types/trading';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface RealTimePricesProps {
  initialCoins: CoinOption[];
  onSelectCoin?: (coinId: string) => void;
  selectedCoinId?: string;
}

const RealTimePrices: React.FC<RealTimePricesProps> = ({ 
  initialCoins,
  onSelectCoin,
  selectedCoinId
}) => {
  const [coins, setCoins] = useState<CoinOption[]>(initialCoins);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Filter coins based on search query
  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Refresh coin data
  const refreshPrices = async () => {
    setIsRefreshing(true);
    
    try {
      const coinIds = coins.map(coin => coin.id);
      const data = await fetchMultipleCryptoData(coinIds);
      setCoins(convertToCoinOptions(data));
      
      toast({
        title: "Prices Updated",
        description: "Latest market data has been fetched",
      });
    } catch (error) {
      console.error("Error refreshing prices:", error);
      toast({
        title: "Refresh Failed",
        description: "Unable to fetch latest market data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Auto-refresh every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshPrices();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <CardTitle className="text-lg">Market Prices</CardTitle>
            <CardDescription>Real-time cryptocurrency prices</CardDescription>
          </div>
          
          <div className="flex space-x-2">
            <Input
              placeholder="Search coins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-[200px]"
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={refreshPrices} 
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-1">
          {filteredCoins.map(coin => (
            <div
              key={coin.id}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                selectedCoinId === coin.id ? 'bg-muted' : ''
              }`}
              onClick={() => onSelectCoin && onSelectCoin(coin.id)}
            >
              <div className="flex items-center space-x-3">
                {coin.image && (
                  <div className="w-6 h-6 flex-shrink-0">
                    <img src={coin.image} alt={coin.name} className="w-full h-full" />
                  </div>
                )}
                <div>
                  <div className="font-medium">{coin.name}</div>
                  <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-medium">${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                <div className={`text-xs ${(coin.changePercent || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {(coin.changePercent || 0) >= 0 ? '▲' : '▼'} {Math.abs(coin.changePercent || 0).toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
          
          {filteredCoins.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No coins match your search
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePrices;
