
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CryptoData } from '@/types/trading';

interface PriceCorrelationChartProps {
  historicalPrices: Record<string, number[]>;
  selectedCoin: CryptoData;
  coins: CryptoData[];
  onCoinSelect: (coin: CryptoData) => void;
}

export const PriceCorrelationChart: React.FC<PriceCorrelationChartProps> = ({
  historicalPrices,
  selectedCoin,
  coins,
  onCoinSelect
}) => {
  const [comparisonCoins, setComparisonCoins] = useState<string[]>(['ethereum']);
  
  const addComparisonCoin = (coinId: string) => {
    if (!comparisonCoins.includes(coinId)) {
      setComparisonCoins([...comparisonCoins, coinId]);
    }
  };
  
  const removeComparisonCoin = (coinId: string) => {
    setComparisonCoins(comparisonCoins.filter(id => id !== coinId));
  };
  
  // Generate labels for x-axis (days)
  const labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
  
  // Generate chart data
  const chartData = {
    labels,
    datasets: [
      // Selected coin dataset
      {
        label: selectedCoin.name,
        data: historicalPrices[selectedCoin.id] || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        borderWidth: 2,
        tension: 0.1
      },
      // Comparison coin datasets
      ...comparisonCoins.map((coinId, index) => {
        const coin = coins.find(c => c.id === coinId);
        const colorSet = [
          { border: 'rgb(255, 99, 132)', background: 'rgba(255, 99, 132, 0.1)' }, // Red
          { border: 'rgb(54, 162, 235)', background: 'rgba(54, 162, 235, 0.1)' }, // Blue
          { border: 'rgb(255, 206, 86)', background: 'rgba(255, 206, 86, 0.1)' }, // Yellow
          { border: 'rgb(153, 102, 255)', background: 'rgba(153, 102, 255, 0.1)' }, // Purple
          { border: 'rgb(255, 159, 64)', background: 'rgba(255, 159, 64, 0.1)' }  // Orange
        ];
        
        return {
          label: coin?.name || coinId,
          data: historicalPrices[coinId] || [],
          borderColor: colorSet[index % colorSet.length].border,
          backgroundColor: colorSet[index % colorSet.length].background,
          borderWidth: 2,
          tension: 0.1
        };
      })
    ]
  };
  
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Price Correlation with ${selectedCoin.name}`
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Line data={chartData} options={options} />
        </CardContent>
      </Card>
      
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium">Compare with:</span>
        <Select
          onValueChange={addComparisonCoin}
          value=""
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Add coin..." />
          </SelectTrigger>
          <SelectContent>
            {coins
              .filter(coin => coin.id !== selectedCoin.id && !comparisonCoins.includes(coin.id))
              .map(coin => (
                <SelectItem key={coin.id} value={coin.id}>
                  {coin.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {comparisonCoins.map(coinId => {
            const coin = coins.find(c => c.id === coinId);
            return (
              <div
                key={coinId}
                className="px-2 py-1 rounded-full bg-secondary text-xs flex items-center gap-1"
              >
                <span>{coin?.name}</span>
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() => removeComparisonCoin(coinId)}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
