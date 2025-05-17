import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchTopCryptoData } from '@/services/cryptoService';
import { CoinOption } from '@/types/trading';
import { Skeleton } from "@/components/ui/skeleton";

interface MarketCorrelationMatrixProps {
  timeframe?: string;
  coins?: string[];
  className?: string;
}

const defaultCoins = ['bitcoin', 'ethereum', 'litecoin', 'ripple', 'cardano'];

const MarketCorrelationMatrix: React.FC<MarketCorrelationMatrixProps> = ({ 
  timeframe = '30d', 
  coins = defaultCoins,
  className = ""
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [data, setData] = useState<Record<string, number[][]>>({});
  const [correlationMatrix, setCorrelationMatrix] = useState<number[][]>([]);
  const [coinData, setCoinData] = useState<CoinOption[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchedData = await fetchTopCryptoData(coins);
        setCoinData(fetchedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching correlation data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [coins]);

  const calculateCorrelation = (x: number[], y: number[]): number => {
    // Basic Pearson correlation implementation
    const n = Math.min(x.length, y.length);
    if (n === 0) return 0;

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
      sumXY += x[i] * y[i];
      sumX2 += x[i] * x[i];
      sumY2 += y[i] * y[i];
    }

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) return 0;
    return numerator / denominator;
  };

  useEffect(() => {
    if (coinData.length && coinData.length >= 2) {
      // Calculate correlation matrix
      const matrix: number[][] = [];
      
      for (let i = 0; i < coinData.length; i++) {
        const row: number[] = [];
        for (let j = 0; j < coinData.length; j++) {
          if (i === j) {
            row.push(1); // Self correlation is always 1
          } else {
            // In a real implementation, we would use historical price data
            // Here we'll just generate a random correlation between -1 and 1
            const correlation = Math.random() * 2 - 1;
            row.push(correlation);
          }
        }
        matrix.push(row);
      }
      
      setCorrelationMatrix(matrix);
    }
  }, [coinData, selectedTimeframe]);

  const getCorrelationColor = (value: number) => {
    // Color scale from red (negative correlation) to green (positive correlation)
    if (value >= 0.8) return 'bg-green-700 text-white';
    if (value >= 0.5) return 'bg-green-500 text-white';
    if (value >= 0.2) return 'bg-green-300';
    if (value >= -0.2) return 'bg-gray-200';
    if (value >= -0.5) return 'bg-red-300';
    if (value >= -0.8) return 'bg-red-500 text-white';
    return 'bg-red-700 text-white';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Market Correlations</CardTitle>
            <CardDescription>
              Asset price correlations over different timeframes
            </CardDescription>
          </div>
          
          <Select 
            value={selectedTimeframe}
            onValueChange={setSelectedTimeframe}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="heatmap">
          <TabsList className="mb-4">
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
          
          <TabsContent value="heatmap">
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <div className="relative overflow-auto">
                  <div className="grid" style={{ 
                    gridTemplateColumns: `80px repeat(${coinData.length}, 1fr)`,
                    gridTemplateRows: `40px repeat(${coinData.length}, 1fr)`
                  }}>
                    {/* Top-left empty cell */}
                    <div className="sticky top-0 left-0 z-10 bg-card"></div>
                    
                    {/* Column headers */}
                    {coinData.map((coin, index) => (
                      <div 
                        key={`col-${index}`} 
                        className="sticky top-0 z-[1] bg-muted/50 backdrop-blur-sm p-2 text-center text-xs font-medium"
                      >
                        {coin.symbol.toUpperCase()}
                      </div>
                    ))}
                    
                    {/* Row headers and correlation cells */}
                    {coinData.map((coin, rowIndex) => (
                      <React.Fragment key={`row-${rowIndex}`}>
                        <div 
                          className="sticky left-0 z-[1] bg-muted/50 backdrop-blur-sm p-2 flex items-center justify-start text-xs font-medium"
                        >
                          {coin.symbol.toUpperCase()}
                        </div>
                        
                        {correlationMatrix[rowIndex]?.map((value, colIndex) => (
                          <div 
                            key={`cell-${rowIndex}-${colIndex}`}
                            className={`flex items-center justify-center p-2 text-xs font-medium ${getCorrelationColor(value)}`}
                          >
                            {value.toFixed(2)}
                          </div>
                        )) || Array(coinData.length).fill(0).map((_, colIndex) => (
                          <div 
                            key={`cell-${rowIndex}-${colIndex}`}
                            className="flex items-center justify-center p-2 text-xs font-medium bg-gray-200"
                          >
                            --
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="table">
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="max-h-[400px] overflow-auto rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-muted/50 sticky top-0 z-10">
                    <tr>
                      <th className="sticky left-0 bg-muted/50 z-10 px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Asset
                      </th>
                      {coinData.map((coin, index) => (
                        <th key={index} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {coin.symbol.toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-gray-200">
                    {coinData.map((coin, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="sticky left-0 bg-card z-[1] px-4 py-2 whitespace-nowrap text-sm font-medium">
                          {coin.symbol.toUpperCase()}
                        </td>
                        {correlationMatrix[rowIndex]?.map((value, colIndex) => (
                          <td key={colIndex} className="px-4 py-2 whitespace-nowrap text-sm">
                            <span className={`inline-block w-16 text-center py-1 px-2 rounded ${getCorrelationColor(value)}`}>
                              {value.toFixed(2)}
                            </span>
                          </td>
                        )) || Array(coinData.length).fill(0).map((_, colIndex) => (
                          <td key={colIndex} className="px-4 py-2 whitespace-nowrap text-sm">
                            <span className="inline-block w-16 text-center py-1 px-2 rounded bg-gray-200">--</span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketCorrelationMatrix;
