
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, RefreshCw, TrendingUp, TrendingDown, Clock, Filter } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";
import { toast } from "@/components/ui/use-toast";
import { startSimulatedPriceUpdates } from "@/services/websocketService";

interface PortfolioAsset {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  price: number;
  priceAUD?: number;
  value: number;
  allocation: number;
  change24h: number;
  lastUpdated: string;
}

const RealTimePortfolio = () => {
  const { activeCurrency, formatValue } = useCurrencyConverter();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [totalValue, setTotalValue] = useState<number>(25640.87);
  const [dayChange, setDayChange] = useState<number>(512.42);
  const [dayChangePercent, setDayChangePercent] = useState<number>(2.04);
  
  const [assets, setAssets] = useState<PortfolioAsset[]>([
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      amount: 0.125,
      price: 94638.61,
      priceAUD: 144595.05,
      value: 11829.83,
      allocation: 46.14,
      change24h: 2.73,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      amount: 2.5,
      price: 3052.74,
      priceAUD: 4661.44,
      value: 7631.85,
      allocation: 29.76,
      change24h: -0.68,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      amount: 25,
      price: 152.87,
      priceAUD: 233.56,
      value: 3821.75,
      allocation: 14.9,
      change24h: 4.23,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      amount: 5000,
      price: 0.45,
      priceAUD: 0.69,
      value: 2250,
      allocation: 8.78,
      change24h: -1.35,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "polkadot",
      name: "Polkadot",
      symbol: "DOT",
      amount: 42.5,
      price: 6.45,
      priceAUD: 9.85,
      value: 274.13,
      allocation: 1.07,
      change24h: 0.91,
      lastUpdated: new Date().toISOString(),
    },
  ]);

  // Effect to start the simulated price updates
  useEffect(() => {
    if (!autoRefresh) return;

    const initialPrices = assets.map(asset => ({
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      price: asset.price,
      priceAUD: asset.priceAUD
    }));

    const stopSimulation = startSimulatedPriceUpdates(initialPrices, (updatedPrices) => {
      // Update assets with new prices
      const updatedAssets = assets.map(asset => {
        const updatedPriceInfo = updatedPrices.find(p => p.id === asset.id);
        if (updatedPriceInfo) {
          const newPrice = updatedPriceInfo.price;
          const newPriceAUD = updatedPriceInfo.priceAUD;
          const newValue = asset.amount * newPrice;
          const priceChange = ((newPrice - asset.price) / asset.price) * 100;
          
          return {
            ...asset,
            price: newPrice,
            priceAUD: newPriceAUD,
            value: newValue,
            change24h: asset.change24h + (Math.random() * 0.4 - 0.2), // Slightly adjust the 24h change for realism
            lastUpdated: new Date().toISOString()
          };
        }
        return asset;
      });

      // Calculate new total value and allocations
      const newTotalValue = updatedAssets.reduce((sum, asset) => sum + asset.value, 0);
      const assetsWithUpdatedAllocations = updatedAssets.map(asset => ({
        ...asset,
        allocation: (asset.value / newTotalValue) * 100
      }));

      // Update state
      setAssets(assetsWithUpdatedAllocations);
      setTotalValue(newTotalValue);
      setLastUpdated(new Date());
      
      // Calculate day change based on updated assets (simplified for demo)
      const newDayChange = assetsWithUpdatedAllocations.reduce(
        (sum, asset) => sum + (asset.value * asset.change24h / 100),
        0
      );
      setDayChange(newDayChange);
      setDayChangePercent((newDayChange / newTotalValue) * 100);
    });

    return () => {
      stopSimulation();
    };
  }, [autoRefresh, assets]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate a manual refresh with slight delay
    setTimeout(() => {
      const updatedAssets = assets.map(asset => {
        // Randomly adjust prices slightly for demo
        const priceChange = (Math.random() * 2 - 1) / 100; // -1% to +1%
        const newPrice = asset.price * (1 + priceChange);
        const newValue = asset.amount * newPrice;
        
        return {
          ...asset,
          price: newPrice,
          priceAUD: newPrice * 1.53, // Simplified conversion
          value: newValue,
          lastUpdated: new Date().toISOString()
        };
      });
      
      // Recalculate total value and allocations
      const newTotalValue = updatedAssets.reduce((sum, asset) => sum + asset.value, 0);
      const assetsWithUpdatedAllocations = updatedAssets.map(asset => ({
        ...asset,
        allocation: (asset.value / newTotalValue) * 100
      }));
      
      setAssets(assetsWithUpdatedAllocations);
      setTotalValue(newTotalValue);
      setLastUpdated(new Date());
      setIsRefreshing(false);
      
      toast({
        title: "Portfolio Refreshed",
        description: "Latest market prices have been applied to your portfolio",
        variant: "default",
      });
    }, 1000);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Real-Time Portfolio
            </CardTitle>
            <CardDescription>
              Live updates of your cryptocurrency holdings
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManualRefresh}
            disabled={isRefreshing || autoRefresh}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Portfolio Value</div>
            <div className="text-2xl font-bold">{formatValue(totalValue)}</div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground mb-1">24h Change</div>
            <div className={`flex items-center text-lg font-medium ${dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {dayChange >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {formatValue(Math.abs(dayChange))} ({dayChangePercent >= 0 ? '+' : ''}{dayChangePercent.toFixed(2)}%)
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          {assets.map((asset) => (
            <div key={asset.id} className="mb-4">
              <div className="flex justify-between mb-1">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mr-2">
                    {asset.symbol.charAt(0)}
                  </div>
                  <span className="font-medium">{asset.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {formatValue(asset.value)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {asset.amount} {asset.symbol}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-1.5">
                <Progress value={asset.allocation} className="h-1.5" />
                <span className="text-xs text-muted-foreground ml-2 w-10 text-right">
                  {asset.allocation.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex justify-between text-xs">
                <div className="text-muted-foreground">
                  {formatValue(activeCurrency === 'AUD' && asset.priceAUD ? asset.priceAUD : asset.price)} per {asset.symbol}
                </div>
                <div className={asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t flex justify-between">
        <div className="flex items-center gap-2">
          <Switch 
            checked={autoRefresh}
            onCheckedChange={setAutoRefresh}
            id="auto-refresh"
          />
          <label htmlFor="auto-refresh" className="text-sm font-medium cursor-pointer">
            Live Updates
          </label>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default RealTimePortfolio;
