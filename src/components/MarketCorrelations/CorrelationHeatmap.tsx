
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CryptoData } from '@/types/trading';
import { getCorrelationColor } from './utils';

interface CorrelationHeatmapProps {
  correlationMatrix: Record<string, Record<string, number>>;
  cryptoData: CryptoData[];
  onSelectPair?: (coin1: string, coin2: string) => void;
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  correlationMatrix,
  cryptoData,
  onSelectPair
}) => {
  // Get all pairs of correlations
  const correlationPairs = [];
  const coinIds = cryptoData.map(coin => coin.id);
  
  for (let i = 0; i < coinIds.length; i++) {
    for (let j = i + 1; j < coinIds.length; j++) {
      const coin1 = coinIds[i];
      const coin2 = coinIds[j];
      const correlation = correlationMatrix[coin1]?.[coin2] || 0;
      
      correlationPairs.push({
        coin1,
        coin2,
        correlation,
        label: `${cryptoData.find(c => c.id === coin1)?.symbol.toUpperCase()} / ${
          cryptoData.find(c => c.id === coin2)?.symbol.toUpperCase()
        }`
      });
    }
  }
  
  // Sort by absolute correlation value
  correlationPairs.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Correlation Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {correlationPairs.map(({ coin1, coin2, correlation, label }) => (
            <div
              key={`${coin1}-${coin2}`}
              className="relative p-2 rounded cursor-pointer hover:opacity-90"
              style={{ backgroundColor: getCorrelationColor(correlation) }}
              onClick={() => onSelectPair && onSelectPair(coin1, coin2)}
            >
              <div className="text-white text-xs font-medium">{label}</div>
              <div className="text-white text-lg font-bold">{(correlation * 100).toFixed(0)}%</div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-center text-muted-foreground">
          Blue indicates positive correlation, red indicates negative correlation
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationHeatmap;
