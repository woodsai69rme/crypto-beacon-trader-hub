
import React from 'react';
import { Card } from "@/components/ui/card";
import { CryptoData } from '@/types/trading';
import { getCorrelationColor } from './utils';

interface CorrelationMatrixProps {
  correlationMatrix: Record<string, Record<string, number>>;
  cryptoData: CryptoData[];
  onSelectCell?: (coin1: string, coin2: string) => void;
}

const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({
  correlationMatrix,
  cryptoData,
  onSelectCell
}) => {
  // Get the ordered list of coin IDs from the cryptoData
  const coinIds = cryptoData.map(coin => coin.id);
  
  // Create a map of coin IDs to symbols for the axis labels
  const coinSymbolMap = cryptoData.reduce((map, coin) => {
    map[coin.id] = coin.symbol.toUpperCase();
    return map;
  }, {} as Record<string, string>);
  
  const handleCellClick = (coin1: string, coin2: string) => {
    if (onSelectCell && coin1 !== coin2) {
      onSelectCell(coin1, coin2);
    }
  };
  
  return (
    <Card className="p-4 overflow-auto">
      <div className="text-center font-medium mb-4">Correlation Matrix</div>
      
      <div className="relative min-w-max">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="p-2 font-normal text-muted-foreground"></th>
              {coinIds.map(coinId => (
                <th key={coinId} className="p-2 font-normal text-muted-foreground">
                  {coinSymbolMap[coinId]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coinIds.map(coin1 => (
              <tr key={coin1}>
                <td className="p-2 font-normal text-muted-foreground">
                  {coinSymbolMap[coin1]}
                </td>
                {coinIds.map(coin2 => {
                  const correlation = correlationMatrix[coin1]?.[coin2] || 0;
                  return (
                    <td
                      key={coin2}
                      className={`p-0 text-center ${coin1 !== coin2 ? 'cursor-pointer hover:opacity-80' : ''}`}
                      onClick={() => handleCellClick(coin1, coin2)}
                      title={`${coinSymbolMap[coin1]} to ${coinSymbolMap[coin2]}: ${(correlation * 100).toFixed(2)}%`}
                    >
                      <div
                        className="w-10 h-10 flex items-center justify-center text-xs text-white"
                        style={{
                          backgroundColor: getCorrelationColor(correlation),
                          opacity: coin1 === coin2 ? 0.7 : 1
                        }}
                      >
                        {(correlation * 100).toFixed(0)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-4 flex justify-center items-center gap-1 text-xs text-muted-foreground">
          <div className="w-3 h-3" style={{ backgroundColor: getCorrelationColor(-1) }}></div>
          <span>-100%</span>
          <div className="w-16 h-3 bg-gradient-to-r from-red-700 via-neutral-500 to-blue-700"></div>
          <span>+100%</span>
          <div className="w-3 h-3" style={{ backgroundColor: getCorrelationColor(1) }}></div>
        </div>
      </div>
    </Card>
  );
};

export default CorrelationMatrix;
