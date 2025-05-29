
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown } from "lucide-react";
import { mockCryptoData } from './mockData';

interface CorrelationData {
  asset1: string;
  asset2: string;
  correlation: number;
}

const MarketCorrelations: React.FC = () => {
  const [timeframe, setTimeframe] = useState<string>('7d');
  const [correlations, setCorrelations] = useState<CorrelationData[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string>('bitcoin');

  useEffect(() => {
    // Calculate mock correlations
    const generateCorrelations = () => {
      const assets = mockCryptoData.slice(0, 6);
      const newCorrelations: CorrelationData[] = [];

      assets.forEach(asset1 => {
        assets.forEach(asset2 => {
          if (asset1.id !== asset2.id && asset1.id === selectedAsset) {
            // Generate realistic correlation values
            let correlation = Math.random() * 2 - 1; // -1 to 1
            
            // Make some correlations more realistic
            if ((asset1.id === 'bitcoin' && asset2.id === 'ethereum') ||
                (asset1.id === 'ethereum' && asset2.id === 'bitcoin')) {
              correlation = 0.7 + Math.random() * 0.2;
            }
            
            newCorrelations.push({
              asset1: asset1.id,
              asset2: asset2.id,
              correlation: Math.round(correlation * 100) / 100
            });
          }
        });
      });

      setCorrelations(newCorrelations);
    };

    generateCorrelations();
  }, [selectedAsset, timeframe]);

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return correlation > 0 ? 'text-green-600' : 'text-red-600';
    if (abs >= 0.3) return correlation > 0 ? 'text-green-500' : 'text-red-500';
    return 'text-gray-500';
  };

  const getCorrelationStrength = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'Strong';
    if (abs >= 0.3) return 'Moderate';
    return 'Weak';
  };

  const selectedAssetData = mockCryptoData.find(asset => asset.id === selectedAsset);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Market Correlations</h3>
        <div className="flex gap-2">
          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select asset" />
            </SelectTrigger>
            <SelectContent>
              {mockCryptoData.slice(0, 6).map(asset => (
                <SelectItem key={asset.id} value={asset.id}>
                  {asset.name} ({asset.symbol.toUpperCase()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {selectedAssetData?.name} Correlations ({timeframe})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {correlations.map((corr) => {
              const asset2Data = mockCryptoData.find(asset => asset.id === corr.asset2);
              
              return (
                <div key={`${corr.asset1}-${corr.asset2}`} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-semibold">
                      {asset2Data?.symbol.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{asset2Data?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {getCorrelationStrength(corr.correlation)} correlation
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {corr.correlation > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`font-semibold ${getCorrelationColor(corr.correlation)}`}>
                      {corr.correlation > 0 ? '+' : ''}{corr.correlation.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Correlation Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-1 text-xs">
            {mockCryptoData.slice(0, 6).map(asset1 => (
              mockCryptoData.slice(0, 6).map(asset2 => {
                const correlation = asset1.id === asset2.id ? 1 : (Math.random() * 2 - 1);
                const intensity = Math.abs(correlation);
                const bgColor = correlation > 0 
                  ? `rgba(34, 197, 94, ${intensity})` 
                  : `rgba(239, 68, 68, ${intensity})`;
                
                return (
                  <div
                    key={`${asset1.id}-${asset2.id}`}
                    className="aspect-square flex items-center justify-center rounded border"
                    style={{ backgroundColor: bgColor }}
                    title={`${asset1.symbol}/${asset2.symbol}: ${correlation.toFixed(2)}`}
                  >
                    <span className="text-white font-medium">
                      {correlation.toFixed(1)}
                    </span>
                  </div>
                );
              })
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>Assets: {mockCryptoData.slice(0, 6).map(a => a.symbol.toUpperCase()).join(', ')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketCorrelations;
