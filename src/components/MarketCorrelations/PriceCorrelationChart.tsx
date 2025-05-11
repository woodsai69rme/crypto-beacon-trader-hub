
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { CryptoData } from '@/types/trading';

interface PriceCorrelationChartProps {
  selectedCoin: CryptoData;
  coins: CryptoData[];
  historicalPrices: Record<string, number[]>;
  onCoinSelect: (coin: CryptoData) => void;
}

export const PriceCorrelationChart: React.FC<PriceCorrelationChartProps> = ({
  selectedCoin,
  coins,
  historicalPrices,
  onCoinSelect
}) => {
  const [displayCoins, setDisplayCoins] = useState<string[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // Colors for different coin lines
  const coinColors: Record<string, string> = {
    bitcoin: '#F7931A',
    ethereum: '#627EEA',
    cardano: '#3CC8C8',
    solana: '#00FFA3',
    binancecoin: '#F3BA2F'
  };

  // Initialize with the selected coin
  useEffect(() => {
    if (selectedCoin && !displayCoins.includes(selectedCoin.id)) {
      setDisplayCoins([selectedCoin.id]);
    }
  }, [selectedCoin]);

  // Update chart data when display coins change
  useEffect(() => {
    if (Object.keys(historicalPrices).length === 0 || displayCoins.length === 0) return;

    // Prepare data for the chart
    const data = [];
    const maxLength = Math.max(...displayCoins.map(coinId => historicalPrices[coinId]?.length || 0));

    for (let i = 0; i < maxLength; i++) {
      const dataPoint: any = { day: i + 1 };

      displayCoins.forEach(coinId => {
        // Get prices and normalize to percentage change from day 0
        const prices = historicalPrices[coinId];
        if (prices && i < prices.length) {
          const basePrice = prices[0];
          const normalizedPrice = ((prices[i] - basePrice) / basePrice) * 100;
          dataPoint[coinId] = normalizedPrice;
        }
      });

      data.push(dataPoint);
    }

    setChartData(data);
  }, [displayCoins, historicalPrices]);

  const toggleCoin = (coinId: string) => {
    setDisplayCoins(prev => 
      prev.includes(coinId) 
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    );
  };

  const handleLegendClick = (coinId: string) => {
    const coin = coins.find(c => c.id === coinId);
    if (coin) {
      onCoinSelect(coin);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        {coins.map(coin => (
          <div key={coin.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`coin-${coin.id}`}
              checked={displayCoins.includes(coin.id)}
              onCheckedChange={() => toggleCoin(coin.id)}
              style={{ accentColor: coinColors[coin.id] || '#888' }}
            />
            <Label 
              htmlFor={`coin-${coin.id}`}
              className="cursor-pointer"
              onClick={() => handleLegendClick(coin.id)}
            >
              {coin.symbol}
            </Label>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Price Movement Correlation (% Change)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" label={{ value: 'Days', position: 'bottom', offset: -10 }} />
                <YAxis 
                  label={{ value: 'Price Change %', angle: -90, position: 'left' }}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)}%`, '']}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right"
                  onClick={(e) => handleLegendClick(e.dataKey)}
                />
                <ReferenceLine y={0} stroke="#888" strokeDasharray="3 3" />
                
                {displayCoins.map(coinId => {
                  const coin = coins.find(c => c.id === coinId);
                  return (
                    <Line
                      key={coinId}
                      type="monotone"
                      dataKey={coinId}
                      name={coin?.symbol || coinId}
                      stroke={coinColors[coinId] || '#888'}
                      activeDot={{ r: 6 }}
                      strokeWidth={coinId === selectedCoin.id ? 2.5 : 1.5}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Chart shows normalized price movement as percentage change from day 0.</p>
            <p>Select coins to compare and click on legend items to focus on a specific asset.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
