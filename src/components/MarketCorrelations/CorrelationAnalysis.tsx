
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CryptoData } from '@/types/trading';
import { findStrongestCorrelations } from './utils';

interface CorrelationAnalysisProps {
  correlationMatrix: Record<string, Record<string, number>>;
  cryptoData: CryptoData[];
  selectedCoinId: string;
  onSelectPair?: (coin1: string, coin2: string) => void;
}

const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({
  correlationMatrix,
  cryptoData,
  selectedCoinId,
  onSelectPair
}) => {
  const [positiveCorrelations, setPositiveCorrelations] = useState<{ coin: CryptoData; correlation: number }[]>([]);
  const [negativeCorrelations, setNegativeCorrelations] = useState<{ coin: CryptoData; correlation: number }[]>([]);
  
  useEffect(() => {
    if (selectedCoinId && correlationMatrix) {
      const allCorrelations = findStrongestCorrelations(correlationMatrix, selectedCoinId, cryptoData, 10);
      
      setPositiveCorrelations(
        allCorrelations
          .filter(item => item.correlation > 0)
          .sort((a, b) => b.correlation - a.correlation)
          .slice(0, 5)
      );
      
      setNegativeCorrelations(
        allCorrelations
          .filter(item => item.correlation < 0)
          .sort((a, b) => a.correlation - b.correlation)
          .slice(0, 5)
      );
    }
  }, [selectedCoinId, correlationMatrix, cryptoData]);
  
  const handleSelectRow = (compareId: string) => {
    if (onSelectPair) {
      onSelectPair(selectedCoinId, compareId);
    }
  };
  
  const selectedCoin = cryptoData.find(coin => coin.id === selectedCoinId);
  
  if (!selectedCoin) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Correlation Analysis: {selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {positiveCorrelations.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Strongest Positive Correlations</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Correlation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positiveCorrelations.map(({ coin, correlation }) => (
                    <TableRow 
                      key={coin.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSelectRow(coin.id)}
                    >
                      <TableCell className="font-medium">{coin.name}</TableCell>
                      <TableCell>{coin.symbol.toUpperCase()}</TableCell>
                      <TableCell className="text-right text-green-600">
                        +{(correlation * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {negativeCorrelations.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Strongest Negative Correlations</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Correlation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {negativeCorrelations.map(({ coin, correlation }) => (
                    <TableRow 
                      key={coin.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSelectRow(coin.id)}
                    >
                      <TableCell className="font-medium">{coin.name}</TableCell>
                      <TableCell>{coin.symbol.toUpperCase()}</TableCell>
                      <TableCell className="text-right text-red-600">
                        {(correlation * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationAnalysis;
