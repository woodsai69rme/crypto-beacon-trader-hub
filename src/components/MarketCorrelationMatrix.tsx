
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchMarketCorrelationData, fetchTopCryptoData } from '@/services/cryptoService';
import { CoinOption } from '@/types/trading';
import { Loader2 } from 'lucide-react';

interface MarketCorrelationMatrixProps {
  maxCoins?: number;
  refreshInterval?: number;
}

const MarketCorrelationMatrix: React.FC<MarketCorrelationMatrixProps> = ({
  maxCoins = 10,
  refreshInterval = 300000 // 5 minutes
}) => {
  const [coins, setCoins] = useState<CoinOption[]>([]);
  const [correlationMatrix, setCorrelationMatrix] = useState<number[][]>([]);
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeframe, setTimeframe] = useState<string>('30d');
  
  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, maxCoins]);
  
  useEffect(() => {
    if (selectedCoins.length >= 2) {
      fetchCorrelationData();
    }
  }, [selectedCoins, timeframe]);
  
  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      const data = await fetchTopCryptoData(maxCoins);
      setCoins(data);
      
      // Default to top 5 coins if none selected
      if (selectedCoins.length === 0) {
        const defaultCoins = data.slice(0, 5).map(coin => coin.id);
        setSelectedCoins(defaultCoins);
      }
    } catch (error) {
      console.error('Error fetching coin data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCorrelationData = async () => {
    setIsLoading(true);
    
    try {
      const matrix = await fetchMarketCorrelationData(selectedCoins);
      setCorrelationMatrix(matrix);
    } catch (error) {
      console.error('Error fetching correlation data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCoinSelection = (coinId: string) => {
    if (selectedCoins.includes(coinId)) {
      // Remove coin if already selected
      setSelectedCoins(prev => prev.filter(id => id !== coinId));
    } else {
      // Add coin if not at max limit
      if (selectedCoins.length < 10) {
        setSelectedCoins(prev => [...prev, coinId]);
      }
    }
  };
  
  const getColorForCorrelation = (value: number): string => {
    // Color scale from red (negative correlation) to green (positive correlation)
    if (value === 1) return 'bg-green-500 text-white'; // Perfect positive correlation
    if (value > 0.8) return 'bg-green-400 text-white';
    if (value > 0.5) return 'bg-green-300';
    if (value > 0.2) return 'bg-green-200';
    if (value > -0.2) return 'bg-gray-200'; // Low correlation
    if (value > -0.5) return 'bg-red-200';
    if (value > -0.8) return 'bg-red-300';
    return 'bg-red-400 text-white'; // Strong negative correlation
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Market Correlation Analysis</CardTitle>
        <CardDescription>
          Analyze price correlation between different cryptocurrencies
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <Select
            value={timeframe}
            onValueChange={setTimeframe}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="text-sm ml-auto text-muted-foreground">
            {selectedCoins.length} currencies selected (max 10)
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (selectedCoins.length === 0 || correlationMatrix.length === 0) ? (
          <div className="flex items-center justify-center h-56">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {coins.map((coin) => (
                <button
                  key={coin.id}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCoins.includes(coin.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  onClick={() => handleCoinSelection(coin.id)}
                >
                  {coin.symbol}
                </button>
              ))}
            </div>
            
            {selectedCoins.length >= 2 && correlationMatrix.length > 0 ? (
              <div className="overflow-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border"></th>
                      {selectedCoins.map((coinId) => {
                        const coin = coins.find(c => c.id === coinId);
                        return (
                          <th key={coinId} className="p-2 border font-medium text-center">
                            {coin?.symbol || coinId}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCoins.map((rowCoinId, rowIndex) => {
                      const rowCoin = coins.find(c => c.id === rowCoinId);
                      return (
                        <tr key={rowCoinId}>
                          <td className="p-2 border font-medium">
                            {rowCoin?.symbol || rowCoinId}
                          </td>
                          {selectedCoins.map((colCoinId, colIndex) => {
                            const value = correlationMatrix[rowIndex]?.[colIndex] || 0;
                            return (
                              <td 
                                key={`${rowCoinId}-${colCoinId}`} 
                                className={`p-2 border text-center ${getColorForCorrelation(value)}`}
                              >
                                {value.toFixed(2)}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : selectedCoins.length < 2 ? (
              <div className="text-center p-8 bg-muted rounded-md">
                <p className="text-muted-foreground">
                  Please select at least 2 currencies to view correlation data
                </p>
              </div>
            ) : null}
            
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Interpreting Correlation Values:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>1.00: Perfect positive correlation (prices move identically)</li>
                <li>0.50-0.99: Strong positive correlation</li>
                <li>0.00-0.49: Weak positive correlation</li>
                <li>-0.49-0.00: Weak negative correlation</li>
                <li>-0.99--0.50: Strong negative correlation</li>
                <li>-1.00: Perfect negative correlation (prices move opposite)</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketCorrelationMatrix;
