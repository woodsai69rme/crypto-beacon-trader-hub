
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, TrendingUp, RefreshCw } from 'lucide-react';
import { PortfolioAsset } from '@/types/trading';

const RealTimePortfolioTracker: React.FC = () => {
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalChange, setTotalChange] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Mock portfolio data
  const mockAssets: PortfolioAsset[] = [
    {
      coinId: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0.25,
      price: 61250.50,
      priceAUD: 91875.75,
      change24h: 2.45,
      value: 15312.63,
      valueAUD: 22968.94,
      allocation: 45.2
    },
    {
      coinId: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 3.8,
      price: 3420.80,
      priceAUD: 5131.20,
      change24h: -1.25,
      value: 12999.04,
      valueAUD: 19498.56,
      allocation: 38.4
    },
    {
      coinId: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      amount: 25.5,
      price: 220.15,
      priceAUD: 330.23,
      change24h: 8.92,
      value: 5613.83,
      valueAUD: 8420.74,
      allocation: 16.4
    }
  ];

  useEffect(() => {
    setAssets(mockAssets);
    calculateTotals(mockAssets);
  }, []);

  const calculateTotals = (assetList: PortfolioAsset[]) => {
    const total = assetList.reduce((sum, asset) => sum + asset.valueAUD, 0);
    const weightedChange = assetList.reduce((sum, asset) => {
      return sum + (asset.change24h * asset.allocation / 100);
    }, 0);
    
    setTotalValue(total);
    setTotalChange(weightedChange);
  };

  const refreshPortfolio = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const updatedAssets = mockAssets.map(asset => ({
        ...asset,
        price: asset.price * (1 + (Math.random() - 0.5) * 0.02),
        priceAUD: asset.priceAUD * (1 + (Math.random() - 0.5) * 0.02),
        change24h: asset.change24h + (Math.random() - 0.5) * 2
      }));
      setAssets(updatedAssets);
      calculateTotals(updatedAssets);
      setIsLoading(false);
    }, 1000);
  };

  const formatCurrency = (value: number, currency = 'AUD') => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Portfolio Overview</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshPortfolio}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground">Total Portfolio Value</p>
            </div>
            <div className="flex items-center">
              {totalChange >= 0 ? (
                <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={`font-medium ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(totalChange)}
              </span>
              <span className="text-xs text-muted-foreground ml-1">24h</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {assets.map((asset) => (
          <Card key={asset.coinId} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-bold">{asset.symbol}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{asset.name}</h3>
                    <p className="text-sm text-muted-foreground">{asset.amount} {asset.symbol}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(asset.valueAUD)}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(asset.priceAUD)} per {asset.symbol}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={asset.change24h >= 0 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {asset.change24h >= 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {formatPercentage(asset.change24h)}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {asset.allocation.toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RealTimePortfolioTracker;
