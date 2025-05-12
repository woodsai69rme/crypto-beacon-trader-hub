
import React, { useState, useEffect } from 'react';
import { CryptoData } from '@/types/trading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CorrelationAnalysisProps {
  coins: CryptoData[];
  timeframe?: string;
}

const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({ 
  coins, 
  timeframe = '1M' 
}) => {
  const [correlationMatrix, setCorrelationMatrix] = useState<number[][]>([]);
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  
  useEffect(() => {
    // Mock correlation data generation
    if (coins.length > 0) {
      // In a real app, we would calculate actual correlations
      // For now, generate mock data
      const generateCorrelation = () => Math.random() * 2 - 1; // Between -1 and 1
      
      const matrix = coins.map(() => 
        coins.map(() => generateCorrelation())
      );
      
      // Set diagonal to 1 (asset correlates perfectly with itself)
      matrix.forEach((row, i) => {
        row[i] = 1;
      });
      
      setCorrelationMatrix(matrix);
      setSelectedCoins(coins.map(coin => coin.symbol));
    }
  }, [coins, timeframe]);

  // Helper function to determine cell color based on correlation value
  const getCorrelationColor = (value: number) => {
    if (value >= 0.7) return 'bg-green-500/80 text-white';
    if (value >= 0.4) return 'bg-green-500/40';
    if (value >= 0.1) return 'bg-green-500/20';
    if (value > -0.1) return 'bg-gray-100 dark:bg-gray-800';
    if (value > -0.4) return 'bg-red-500/20';
    if (value > -0.7) return 'bg-red-500/40';
    return 'bg-red-500/80 text-white';
  };

  // Create compatible crypto data for display
  const displayCoins = coins.map(coin => {
    // Ensure priceChange field is present, defaulting to 0 if not
    return {
      ...coin,
      priceChange: coin.priceChange || 0
    };
  });

  return (
    <div className="space-y-4">
      <Tabs defaultValue="matrix">
        <TabsList className="mb-4">
          <TabsTrigger value="matrix">Correlation Matrix</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="scatterplot">Scatter Plot</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matrix">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Correlation Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full table-fixed border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border"></th>
                      {displayCoins.map((coin) => (
                        <th key={coin.id} className="p-2 border text-center text-xs font-medium">
                          {coin.symbol}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayCoins.map((coin, rowIdx) => (
                      <tr key={coin.id}>
                        <th className="p-2 border text-left text-xs font-medium">
                          {coin.symbol}
                        </th>
                        {correlationMatrix[rowIdx]?.map((correlation, colIdx) => (
                          <td 
                            key={colIdx} 
                            className={`p-2 border text-center text-xs ${getCorrelationColor(correlation)}`}
                          >
                            {correlation.toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="heatmap">
          <Card>
            <CardContent className="p-6">
              <div className="h-[400px] flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">Correlation heatmap visualization will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scatterplot">
          <Card>
            <CardContent className="p-6">
              <div className="h-[400px] flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">Scatter plot visualization will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This correlation analysis shows the statistical relationship between different cryptocurrency price movements. 
              A coefficient of 1 indicates perfect positive correlation, 0 indicates no correlation, and -1 indicates 
              perfect negative correlation.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium">Key Insights:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Bitcoin and Ethereum show a correlation of {(correlationMatrix[0]?.[1] || 0).toFixed(2)}</li>
                <li>The most negatively correlated assets are generally stablecoins vs volatile cryptocurrencies</li>
                <li>Consider these relationships when building a diversified portfolio</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CorrelationAnalysis;
