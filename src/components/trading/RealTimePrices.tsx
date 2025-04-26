
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { startSimulatedPriceUpdates } from "@/services/websocketService";
import { CoinOption } from "@/types/trading";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";

interface RealTimePricesProps {
  title?: string;
  description?: string;
  initialCoins: CoinOption[];
}

const RealTimePrices: React.FC<RealTimePricesProps> = ({ 
  title = "Real-Time Prices", 
  description = "Live cryptocurrency price updates", 
  initialCoins 
}) => {
  const [coins, setCoins] = useState<CoinOption[]>(initialCoins);
  const [priceChanges, setPriceChanges] = useState<Record<string, {
    isUp: boolean;
    percentage: number;
    updatedAt: number;
  }>>({});
  
  const { activeCurrency, formatValue } = useCurrencyConverter();
  
  // Start simulated price updates
  useEffect(() => {
    const stopSimulation = startSimulatedPriceUpdates(initialCoins, (updatedCoins) => {
      // Calculate price changes compared to previous update
      const newPriceChanges: Record<string, {
        isUp: boolean;
        percentage: number;
        updatedAt: number;
      }> = {};
      
      updatedCoins.forEach((coin) => {
        const previousCoin = coins.find(c => c.id === coin.id);
        if (previousCoin) {
          const priceDiff = coin.price - previousCoin.price;
          const percentage = (priceDiff / previousCoin.price) * 100;
          
          newPriceChanges[coin.id] = {
            isUp: priceDiff >= 0,
            percentage: Math.abs(percentage),
            updatedAt: Date.now()
          };
        }
      });
      
      setCoins(updatedCoins);
      setPriceChanges(prev => ({...prev, ...newPriceChanges}));
    });
    
    return () => {
      stopSimulation();
    };
  }, [initialCoins]);
  
  // Animation timeout for price changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Filter out old price changes (older than 2 seconds)
      const now = Date.now();
      const filteredChanges = Object.entries(priceChanges).reduce((acc, [coinId, change]) => {
        if (now - change.updatedAt < 2000) {
          acc[coinId] = change;
        }
        return acc;
      }, {} as Record<string, {
        isUp: boolean;
        percentage: number;
        updatedAt: number;
      }>);
      
      setPriceChanges(filteredChanges);
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [priceChanges]);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>Live</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coins.map((coin) => {
              const priceChange = priceChanges[coin.id];
              const priceClassName = priceChange 
                ? priceChange.isUp 
                  ? "text-green-600 transition-colors duration-1000" 
                  : "text-red-600 transition-colors duration-1000"
                : "";
              
              // Simulate 24h change (for demo)
              const dayChange = Math.random() * 20 - 10; // -10% to +10%
              const dayChangeColor = dayChange >= 0 ? "text-green-600" : "text-red-600";
              
              return (
                <TableRow key={coin.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        {coin.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={`text-right font-medium ${priceClassName}`}>
                    {formatValue(activeCurrency === 'AUD' && coin.priceAUD ? coin.priceAUD : coin.price)}
                  </TableCell>
                  <TableCell className={`text-right ${dayChangeColor}`}>
                    <div className="flex items-center justify-end gap-1">
                      {dayChange >= 0 ? 
                        <TrendingUp className="h-3 w-3" /> : 
                        <TrendingDown className="h-3 w-3" />
                      }
                      <span>{dayChange.toFixed(2)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RealTimePrices;
