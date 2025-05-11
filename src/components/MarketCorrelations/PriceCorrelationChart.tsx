
import React, { useState, useEffect } from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { capitalizeFirstLetter } from '@/lib/utils';

interface PriceData {
  date: string;
  [key: string]: string | number;
}

interface PriceCorrelationChartProps {
  coinA: string;
  coinB: string;
  prices: PriceData[];
  correlationScore: number;
}

const PriceCorrelationChart: React.FC<PriceCorrelationChartProps> = ({
  coinA,
  coinB,
  prices,
  correlationScore
}) => {
  const [normalized, setNormalized] = useState<boolean>(true);
  const [normalizedPrices, setNormalizedPrices] = useState<PriceData[]>([]);
  
  useEffect(() => {
    if (prices.length === 0) return;
    
    // Calculate normalization factors
    const firstDataPoint = prices[0];
    const coinAStart = parseFloat(firstDataPoint[coinA] as string) || 0;
    const coinBStart = parseFloat(firstDataPoint[coinB] as string) || 0;
    
    // Normalize data
    const normalized = prices.map(point => {
      const coinAValue = parseFloat(point[coinA] as string) || 0;
      const coinBValue = parseFloat(point[coinB] as string) || 0;
      
      return {
        ...point,
        [`${coinA}_normalized`]: coinAStart > 0 ? (coinAValue / coinAStart) * 100 : 0,
        [`${coinB}_normalized`]: coinBStart > 0 ? (coinBValue / coinBStart) * 100 : 0
      };
    });
    
    setNormalizedPrices(normalized);
  }, [prices, coinA, coinB]);
  
  const getCorrelationColor = () => {
    const absCorr = Math.abs(correlationScore);
    if (absCorr > 0.7) {
      return correlationScore > 0 ? 'text-green-600' : 'text-red-600';
    } else if (absCorr > 0.3) {
      return correlationScore > 0 ? 'text-green-500' : 'text-red-500';
    }
    return 'text-gray-500';
  };
  
  const getCorrelationText = () => {
    const absCorr = Math.abs(correlationScore);
    if (absCorr > 0.7) {
      return correlationScore > 0 ? 'Strong positive' : 'Strong negative';
    } else if (absCorr > 0.3) {
      return correlationScore > 0 ? 'Moderate positive' : 'Moderate negative';
    }
    return 'Weak/No';
  };

  const toggleNormalization = () => {
    setNormalized(!normalized);
  };
  
  const renderChartContent = () => {
    const displayData = normalized ? normalizedPrices : prices;
    const yAxisKeys = normalized 
      ? [`${coinA}_normalized`, `${coinB}_normalized`] 
      : [coinA, coinB];
    
    const yAxisLabels = normalized
      ? [`${capitalizeFirstLetter(coinA)} (normalized)`, `${capitalizeFirstLetter(coinB)} (normalized)`]
      : [capitalizeFirstLetter(coinA), capitalizeFirstLetter(coinB)];
    
    if (displayData.length === 0) {
      return <div className="flex justify-center items-center h-64">Loading data...</div>;
    }
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={displayData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip formatter={(value: any, name: string) => {
            return normalized
              ? [`${value.toFixed(2)}%`, name]
              : [`$${value.toFixed(2)}`, name];
          }} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={yAxisKeys[0]}
            name={yAxisLabels[0]}
            stroke="#8884d8"
            dot={false}
            activeDot={{ r: 8 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={yAxisKeys[1]}
            name={yAxisLabels[1]}
            stroke="#82ca9d"
            dot={false}
            activeDot={{ r: 8 }}
          />
          {normalized && <ReferenceLine y={100} stroke="#666" strokeDasharray="3 3" />}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          Price Correlation: {capitalizeFirstLetter(coinA)} vs {capitalizeFirstLetter(coinB)}
        </h3>
        <button 
          onClick={toggleNormalization}
          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm"
        >
          {normalized ? 'Show Absolute Prices' : 'Show Normalized'}
        </button>
      </div>
      
      <div className="flex items-center mb-4">
        <div className="text-sm mr-4">
          Correlation: <span className={`font-bold ${getCorrelationColor()}`}>
            {correlationScore.toFixed(2)}
          </span>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
          {getCorrelationText()} correlation
        </div>
      </div>
      
      {renderChartContent()}
    </div>
  );
};

export default PriceCorrelationChart;
