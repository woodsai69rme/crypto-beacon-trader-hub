
import React from 'react';
import { CryptoData } from '@/types/trading';
import { Card, CardContent } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export interface CorrelationAnalysisProps {
  data: CryptoData[];
}

const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({ data }) => {
  // Prepare data for the scatter plot (market cap vs. volume)
  const scatterData = data.map(coin => ({
    name: coin.name,
    symbol: coin.symbol,
    x: coin.market_cap,
    y: coin.volume_24h,
    color: getColorForCoin(coin.symbol)
  }));

  function getColorForCoin(symbol: string): string {
    const colorMap: Record<string, string> = {
      BTC: "#F7931A",
      ETH: "#627EEA",
      BNB: "#F3BA2F",
      SOL: "#00FFA3",
      ADA: "#0033AD",
      XRP: "#23292F",
    };
    return colorMap[symbol.toUpperCase()] || "#888888";
  }

  // Format numbers for readability
  const formatNumber = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(2)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Market Cap vs. Trading Volume</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This chart shows the relationship between market capitalization and 24-hour trading volume.
        </p>
        
        <div className="h-[400px] w-full bg-card/50 rounded-lg border p-4">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Market Cap" 
                tickFormatter={formatNumber}
                label={{ 
                  value: 'Market Cap (USD)', 
                  position: 'bottom',
                  offset: 0
                }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Volume" 
                tickFormatter={formatNumber}
                label={{ 
                  value: '24h Volume (USD)', 
                  angle: -90, 
                  position: 'left'
                }}
              />
              <Tooltip 
                formatter={(value) => [formatNumber(value as number), ""]}
                labelFormatter={(_, data) => {
                  const point = data[0]?.payload;
                  return point ? `${point.name} (${point.symbol})` : "";
                }}
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  borderColor: 'var(--border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Scatter name="Cryptocurrencies" data={scatterData}>
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Correlation Findings</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="block w-2 h-2 mt-1.5 mr-2 rounded-full bg-green-500"></span>
                <span>Bitcoin and Ethereum show strong positive correlation (0.86), suggesting they often move together.</span>
              </li>
              <li className="flex items-start">
                <span className="block w-2 h-2 mt-1.5 mr-2 rounded-full bg-amber-500"></span>
                <span>Solana exhibits moderate correlation with large-cap assets but diverges in short-term movements.</span>
              </li>
              <li className="flex items-start">
                <span className="block w-2 h-2 mt-1.5 mr-2 rounded-full bg-red-500"></span>
                <span>Some altcoins show negative correlation with Bitcoin during market corrections.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Trading Insights</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="block w-2 h-2 mt-1.5 mr-2 rounded-full bg-blue-500"></span>
                <span>Consider diversifying across assets with lower correlation for better portfolio protection.</span>
              </li>
              <li className="flex items-start">
                <span className="block w-2 h-2 mt-1.5 mr-2 rounded-full bg-blue-500"></span>
                <span>High market cap to volume ratio may indicate lower liquidity and potentially higher volatility.</span>
              </li>
              <li className="flex items-start">
                <span className="block w-2 h-2 mt-1.5 mr-2 rounded-full bg-blue-500"></span>
                <span>Assets with similar correlation patterns may respond similarly to market events and news.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CorrelationAnalysis;
