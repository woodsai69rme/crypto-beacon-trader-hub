
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CryptoData } from '@/types/trading';

interface CorrelationHeatmapProps {
  correlationData: number[][];
  coins: CryptoData[];
  onCoinSelect: (coin: CryptoData) => void;
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  correlationData,
  coins,
  onCoinSelect
}) => {
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);

  // Helper function to get color based on correlation value
  const getCorrelationColor = (value: number): string => {
    if (value > 0) {
      return `rgba(0, 128, 0, ${0.1 + value * 0.9})`;
    } else {
      return `rgba(220, 53, 69, ${0.1 + Math.abs(value) * 0.9})`;
    }
  };

  // Calculate cell size based on available coins
  const cellSize = 60;
  const margin = 60;
  const width = coins.length * cellSize + margin;
  const height = coins.length * cellSize + margin;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="text-sm mb-2">
          <p>Hover over cells to see correlation values. Click to select assets.</p>
        </div>
        <div className="flex justify-center">
          <svg width={width} height={height} className="overflow-visible">
            {/* X-axis labels */}
            {coins.map((coin, i) => (
              <g key={`x-${i}`} transform={`translate(${margin + i * cellSize}, 0)`}>
                <text
                  x={cellSize / 2}
                  y={margin - 10}
                  textAnchor="middle"
                  fontSize="12"
                  className="fill-current"
                >
                  {coin.symbol}
                </text>
              </g>
            ))}

            {/* Y-axis labels */}
            {coins.map((coin, i) => (
              <g key={`y-${i}`} transform={`translate(0, ${margin + i * cellSize})`}>
                <text
                  x={margin - 10}
                  y={cellSize / 2}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  fontSize="12"
                  className="fill-current cursor-pointer"
                  onClick={() => onCoinSelect(coin)}
                >
                  {coin.symbol}
                </text>
              </g>
            ))}

            {/* Heatmap cells */}
            {correlationData.map((row, i) => (
              <React.Fragment key={`row-${i}`}>
                {row.map((value, j) => (
                  <rect
                    key={`cell-${i}-${j}`}
                    x={margin + j * cellSize}
                    y={margin + i * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill={getCorrelationColor(value)}
                    stroke="rgba(255,255,255,0.1)"
                    onMouseEnter={() => setHoveredCell([i, j])}
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() => onCoinSelect(coins[j])}
                    style={{ cursor: 'pointer' }}
                    rx={2}
                  />
                ))}
              </React.Fragment>
            ))}

            {/* Hover tooltip */}
            {hoveredCell && (
              <g transform={`translate(${margin + hoveredCell[1] * cellSize + cellSize / 2}, ${margin + hoveredCell[0] * cellSize + cellSize / 2})`}>
                <rect
                  x={-40}
                  y={-30}
                  width={80}
                  height={25}
                  fill="rgba(0,0,0,0.8)"
                  rx={4}
                />
                <text
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="#fff"
                  fontSize="12"
                  fontWeight="bold"
                  y={-17}
                >
                  {`${coins[hoveredCell[0]].symbol} → ${coins[hoveredCell[1]].symbol}`}
                </text>
                <text
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="#fff"
                  fontSize="12"
                  y={-2}
                >
                  {`${correlationData[hoveredCell[0]][hoveredCell[1]].toFixed(2)}`}
                </text>
              </g>
            )}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationHeatmap;
