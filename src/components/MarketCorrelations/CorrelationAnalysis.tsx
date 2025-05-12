
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CryptoData } from '@/types/trading';
import { generateCorrelationMatrix, mockCryptoData } from './mockData';

interface CorrelationAnalysisProps {
  initialCoinId?: string;
  timeframe?: string;
}

const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({
  initialCoinId = 'bitcoin',
  timeframe = '30d',
}) => {
  const [selectedCoin, setSelectedCoin] = useState(initialCoinId);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [isLoading, setIsLoading] = useState(false);
  const [correlatedCoins, setCorrelatedCoins] = useState<{ coin: CryptoData; correlation: number }[]>([]);
  const [negativelyCorrelatedCoins, setNegativelyCorrelatedCoins] = useState<{ coin: CryptoData; correlation: number }[]>([]);

  const fetchCorrelations = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from an API
      // Here we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate correlation data
      const allCoins = mockCryptoData;
      const correlationMatrix = generateCorrelationMatrix(
        allCoins.reduce((acc, coin) => ({ 
          ...acc, 
          [coin.id]: Array(30).fill(0).map(() => Math.random() * 1000 + 20000) 
        }), {})
      );
      
      // Find correlations for selected coin
      const selectedCoinCorrelations = Object.entries(correlationMatrix[selectedCoin] || {})
        .filter(([coinId]) => coinId !== selectedCoin)
        .map(([coinId, correlation]) => {
          const foundCoin = allCoins.find(c => c.id === coinId);
          // Ensure the coin is found and has all required properties
          return foundCoin ? {
            coin: foundCoin,
            correlation
          } : null;
        })
        .filter(item => item !== null) as { coin: CryptoData; correlation: number }[]; 
      
      // Sort by correlation strength
      const positiveCorrelations = selectedCoinCorrelations
        .filter(item => item.correlation > 0)
        .sort((a, b) => b.correlation - a.correlation)
        .slice(0, 5);
        
      const negativeCorrelations = selectedCoinCorrelations
        .filter(item => item.correlation < 0)
        .sort((a, b) => a.correlation - b.correlation)
        .slice(0, 5);
      
      setCorrelatedCoins(positiveCorrelations);
      setNegativelyCorrelatedCoins(negativeCorrelations);
    } catch (error) {
      console.error('Error fetching correlations:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCorrelations();
  }, [selectedCoin, selectedTimeframe]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Correlation Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Select value={selectedCoin} onValueChange={setSelectedCoin}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select coin" />
              </SelectTrigger>
              <SelectContent>
                {mockCryptoData.map((coin) => (
                  <SelectItem key={coin.id} value={coin.id}>
                    {coin.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={fetchCorrelations} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Highest Positive Correlation</h4>
              <div className="space-y-2">
                {correlatedCoins.map((item) => (
                  <div key={item.coin.id} className="flex justify-between items-center p-2 bg-background border rounded-md">
                    <div className="flex items-center">
                      {item.coin.image && (
                        <img 
                          src={item.coin.image} 
                          alt={item.coin.name} 
                          className="w-5 h-5 mr-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <span>{item.coin.name}</span>
                    </div>
                    <span className="text-green-500 font-medium">
                      {(item.correlation * 100).toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Highest Negative Correlation</h4>
              <div className="space-y-2">
                {negativelyCorrelatedCoins.map((item) => (
                  <div key={item.coin.id} className="flex justify-between items-center p-2 bg-background border rounded-md">
                    <div className="flex items-center">
                      {item.coin.image && (
                        <img 
                          src={item.coin.image} 
                          alt={item.coin.name} 
                          className="w-5 h-5 mr-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <span>{item.coin.name}</span>
                    </div>
                    <span className="text-destructive font-medium">
                      {(item.correlation * 100).toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              Correlation coefficient measures how two assets move in relation to each other.
              <br />
              100% means perfect positive correlation, -100% means perfect negative correlation.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationAnalysis;
