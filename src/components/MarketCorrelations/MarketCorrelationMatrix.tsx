
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { fetchTopCryptoData } from '@/services/api/coinGeckoService';
import { CoinOption } from '@/types/trading';
import { toast } from '@/components/ui/use-toast';
import { RefreshCw } from 'lucide-react';

// Helper function to calculate correlation coefficient between two arrays
function calculateCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;
  
  // Calculate means
  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate sum of products of deviations
  let sumProducts = 0;
  let sumSquaredDeviationsX = 0;
  let sumSquaredDeviationsY = 0;
  
  for (let i = 0; i < n; i++) {
    const deviationX = x[i] - xMean;
    const deviationY = y[i] - yMean;
    
    sumProducts += deviationX * deviationY;
    sumSquaredDeviationsX += deviationX * deviationX;
    sumSquaredDeviationsY += deviationY * deviationY;
  }
  
  // Avoid division by zero
  if (sumSquaredDeviationsX === 0 || sumSquaredDeviationsY === 0) {
    return 0;
  }
  
  // Calculate correlation coefficient
  return sumProducts / (Math.sqrt(sumSquaredDeviationsX) * Math.sqrt(sumSquaredDeviationsY));
}

// Generate mock price history for each coin
function generatePriceHistory(coins: CoinOption[], days = 30): Record<string, number[]> {
  const result: Record<string, number[]> = {};
  
  coins.forEach(coin => {
    const priceHistory: number[] = [];
    let price = coin.price;
    
    // Start with current price and work backwards
    for (let i = 0; i < days; i++) {
      priceHistory.unshift(price);
      
      // Generate price movement based on volatility (using market cap as a proxy)
      const volatility = 1000000000 / (coin.marketCap || 1000000000);
      const changePercent = (Math.random() - 0.5) * volatility * 100;
      price = price / (1 + changePercent / 100);
    }
    
    result[coin.id] = priceHistory;
  });
  
  return result;
}

// Generate correlation matrix from historical prices
function generateCorrelationMatrix(historicalPrices: Record<string, number[]>): Record<string, Record<string, number>> {
  const coinIds = Object.keys(historicalPrices);
  const matrix: Record<string, Record<string, number>> = {};
  
  coinIds.forEach(coin1 => {
    matrix[coin1] = {};
    
    coinIds.forEach(coin2 => {
      if (coin1 === coin2) {
        matrix[coin1][coin2] = 1; // Self correlation is always 1
      } else {
        const prices1 = historicalPrices[coin1];
        const prices2 = historicalPrices[coin2];
        
        matrix[coin1][coin2] = calculateCorrelation(prices1, prices2);
      }
    });
  });
  
  return matrix;
}

interface MarketCorrelationMatrixProps {
  maxCoins?: number;
}

const MarketCorrelationMatrix: React.FC<MarketCorrelationMatrixProps> = ({ maxCoins = 10 }) => {
  const [coins, setCoins] = useState<CoinOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [correlationMatrix, setCorrelationMatrix] = useState<Record<string, Record<string, number>>>({});
  const [timeframe, setTimeframe] = useState<string>("30");
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Fetch top coins by market cap
      const topCoins = await fetchTopCryptoData(maxCoins);
      setCoins(topCoins);
      
      // Select top 5 coins by default
      const defaultSelected = topCoins.slice(0, 5).map(coin => coin.id);
      setSelectedCoins(defaultSelected);
      
      // Generate historical price data and correlation matrix
      // Note: In a real app, this would call an API for actual historical data
      const historicalPrices = generatePriceHistory(topCoins, parseInt(timeframe));
      const matrix = generateCorrelationMatrix(historicalPrices);
      setCorrelationMatrix(matrix);
    } catch (error) {
      console.error("Error fetching correlation data:", error);
      toast({
        title: "Failed to load market correlation data",
        description: "Could not retrieve the necessary data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [maxCoins, timeframe]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
  };
  
  const handleCoinToggle = (coinId: string) => {
    setSelectedCoins(prev => {
      if (prev.includes(coinId)) {
        return prev.filter(id => id !== coinId);
      } else {
        if (prev.length >= 10) {
          toast({
            title: "Maximum coins reached",
            description: "You can select up to 10 coins for correlation analysis.",
            variant: "default",
          });
          return prev;
        }
        return [...prev, coinId];
      }
    });
  };
  
  // Get correlation color based on value
  const getCorrelationColor = (value: number): string => {
    if (value >= 0.8) return "bg-green-500 text-white";
    if (value >= 0.5) return "bg-green-300";
    if (value >= 0.2) return "bg-green-100";
    if (value >= -0.2) return "bg-gray-100";
    if (value >= -0.5) return "bg-red-100";
    if (value >= -0.8) return "bg-red-300";
    return "bg-red-500 text-white";
  };
  
  // Filter matrix to only show selected coins
  const filteredMatrix = Object.keys(correlationMatrix)
    .filter(coinId => selectedCoins.includes(coinId))
    .reduce((filtered, coinId) => {
      filtered[coinId] = {};
      Object.keys(correlationMatrix[coinId])
        .filter(relatedCoinId => selectedCoins.includes(relatedCoinId))
        .forEach(relatedCoinId => {
          filtered[coinId][relatedCoinId] = correlationMatrix[coinId][relatedCoinId];
        });
      return filtered;
    }, {} as Record<string, Record<string, number>>);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Market Correlation Matrix</CardTitle>
            <CardDescription>
              Visualize the correlation between different cryptocurrencies
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={timeframe}
              onValueChange={handleTimeframeChange}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
                <SelectItem value="365">1 Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={fetchData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {coins.map(coin => (
                <Button 
                  key={coin.id}
                  variant={selectedCoins.includes(coin.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCoinToggle(coin.id)}
                  className="flex items-center gap-1"
                >
                  {coin.image && (
                    <img src={coin.image} alt={coin.name} className="w-4 h-4 rounded-full" />
                  )}
                  <span>{coin.symbol}</span>
                </Button>
              ))}
            </div>
            
            {selectedCoins.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border"></th>
                      {selectedCoins.map(coinId => {
                        const coin = coins.find(c => c.id === coinId);
                        return (
                          <th key={coinId} className="p-2 border text-center font-medium">
                            <div className="flex flex-col items-center">
                              {coin?.image && (
                                <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full mb-1" />
                              )}
                              {coin?.symbol}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCoins.map(coinId1 => {
                      const coin = coins.find(c => c.id === coinId1);
                      return (
                        <tr key={coinId1}>
                          <td className="p-2 border font-medium">
                            <div className="flex items-center gap-2">
                              {coin?.image && (
                                <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
                              )}
                              {coin?.symbol}
                            </div>
                          </td>
                          {selectedCoins.map(coinId2 => {
                            const correlation = filteredMatrix[coinId1]?.[coinId2] || 0;
                            return (
                              <td 
                                key={`${coinId1}-${coinId2}`} 
                                className={`p-2 border text-center ${getCorrelationColor(correlation)}`}
                                title={`Correlation between ${coinId1} and ${coinId2}`}
                              >
                                {correlation === 1 ? "1.00" : correlation.toFixed(2)}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-10 text-muted-foreground">
                Please select at least one cryptocurrency to view correlations
              </div>
            )}
            
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium mb-1">Correlation Strength:</p>
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 inline-block bg-green-500"></span>
                  <span>Strong Positive (0.8 to 1.0)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 inline-block bg-green-300"></span>
                  <span>Moderate Positive (0.5 to 0.8)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 inline-block bg-green-100"></span>
                  <span>Weak Positive (0.2 to 0.5)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 inline-block bg-gray-100"></span>
                  <span>No Correlation (-0.2 to 0.2)</span>
                </div>
              </div>
              <div>
                <p className="font-medium mb-1">Interpretation:</p>
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 inline-block bg-red-100"></span>
                  <span>Weak Negative (-0.5 to -0.2)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 inline-block bg-red-300"></span>
                  <span>Moderate Negative (-0.8 to -0.5)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 inline-block bg-red-500"></span>
                  <span>Strong Negative (-1.0 to -0.8)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketCorrelationMatrix;
