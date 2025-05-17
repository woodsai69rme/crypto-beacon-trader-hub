
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchTopCryptoData } from '@/services/cryptoService';
import { CoinOption } from '@/types/trading';

interface MarketCorrelationMatrixProps {
  limit?: number;
}

const MarketCorrelationMatrix: React.FC<MarketCorrelationMatrixProps> = ({ limit = 5 }) => {
  const [coins, setCoins] = useState<CoinOption[]>([]);
  const [correlationData, setCorrelationData] = useState<number[][]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTopCryptoData(limit);
        setCoins(data);
        
        // Generate random correlation data (in a real app this would be calculated)
        const matrix = generateRandomCorrelationMatrix(data.length);
        setCorrelationData(matrix);
      } catch (error) {
        console.error('Error fetching correlation data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [limit]);

  // Helper function to generate a random correlation matrix
  const generateRandomCorrelationMatrix = (size: number): number[][] => {
    const matrix: number[][] = [];
    
    for (let i = 0; i < size; i++) {
      matrix[i] = [];
      for (let j = 0; j < size; j++) {
        if (i === j) {
          // Diagonal should be 1 (perfect correlation with self)
          matrix[i][j] = 1;
        } else if (matrix[j] && matrix[j][i] !== undefined) {
          // Symmetric matrix
          matrix[i][j] = matrix[j][i];
        } else {
          // Random correlation between -1 and 1
          matrix[i][j] = Math.round((Math.random() * 2 - 1) * 100) / 100;
        }
      }
    }
    
    return matrix;
  };

  const getCellColor = (value: number): string => {
    if (value === 1) return 'bg-gray-100';
    if (value > 0.7) return 'bg-green-100';
    if (value > 0.3) return 'bg-green-50';
    if (value > -0.3) return 'bg-gray-50';
    if (value > -0.7) return 'bg-red-50';
    return 'bg-red-100';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asset Correlation Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Correlation Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Asset</TableHead>
                {coins.map((coin) => (
                  <TableHead key={coin.id} className="text-center">
                    {coin.symbol.toUpperCase()}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {coins.map((coin, rowIndex) => (
                <TableRow key={coin.id}>
                  <TableCell className="font-medium">
                    {coin.symbol.toUpperCase()}
                  </TableCell>
                  {correlationData[rowIndex]?.map((value, colIndex) => (
                    <TableCell
                      key={`${rowIndex}-${colIndex}`}
                      className={`text-center ${getCellColor(value)}`}
                    >
                      {value.toFixed(2)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketCorrelationMatrix;
