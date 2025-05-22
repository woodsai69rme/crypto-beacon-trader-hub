
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis, Tooltip, ZAxis, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { CryptoData } from '@/types/trading';
import { calculateCorrelations } from "@/lib/correlationUtils";

// Mock data for demonstration purposes
const mockCryptoData: CryptoData[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 50000, priceChange: 1000, marketCap: 950000000000, volume: 30000000000, changePercent: 2 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3000, priceChange: 100, marketCap: 350000000000, volume: 20000000000, changePercent: 3.2 },
  { id: "ripple", name: "XRP", symbol: "XRP", price: 0.5, priceChange: 0.02, marketCap: 25000000000, volume: 5000000000, changePercent: 4 },
  { id: "cardano", name: "Cardano", symbol: "ADA", price: 1.2, priceChange: 0.05, marketCap: 40000000000, volume: 3000000000, changePercent: 4.1 },
  { id: "solana", name: "Solana", symbol: "SOL", price: 150, priceChange: 7, marketCap: 45000000000, volume: 7000000000, changePercent: 5 },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", price: 20, priceChange: 1, marketCap: 20000000000, volume: 2000000000, changePercent: 5 },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.2, priceChange: 0.01, marketCap: 30000000000, volume: 4000000000, changePercent: -1 },
  { id: "avalanche", name: "Avalanche", symbol: "AVAX", price: 80, priceChange: 3, marketCap: 22000000000, volume: 3000000000, changePercent: 3.8 },
  { id: "chainlink", name: "Chainlink", symbol: "LINK", price: 18, priceChange: 0.7, marketCap: 9000000000, volume: 1500000000, changePercent: 3.9 },
  { id: "litecoin", name: "Litecoin", symbol: "LTC", price: 150, priceChange: 5, marketCap: 11000000000, volume: 2000000000, changePercent: 3.3 },
];

interface CorrelationAnalysisProps {
  cryptoData?: CryptoData[];
  timeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
}

const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({
  cryptoData = mockCryptoData,
  timeframe = "7d",
  onTimeframeChange,
}) => {
  const [selectedCoins, setSelectedCoins] = useState<string[]>(["bitcoin", "ethereum"]);
  const [correlationData, setCorrelationData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [correlationMetric, setCorrelationMetric] = useState<"price" | "volume" | "marketCap">("price");

  const filteredCryptoData = cryptoData.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedCoins.length > 0 && cryptoData.length > 0) {
      const newCorrelationData = calculateCorrelations(cryptoData, selectedCoins, correlationMetric);
      setCorrelationData(newCorrelationData);
    }
  }, [selectedCoins, cryptoData, correlationMetric]);

  const handleCoinToggle = (coinId: string) => {
    if (selectedCoins.includes(coinId)) {
      setSelectedCoins(selectedCoins.filter(id => id !== coinId));
    } else {
      setSelectedCoins([...selectedCoins, coinId]);
    }
  };

  const handleTimeframeChange = (value: string) => {
    if (onTimeframeChange) {
      onTimeframeChange(value);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Correlation Analysis</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <Select defaultValue={timeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue={correlationMetric} onValueChange={(value) => setCorrelationMetric(value as "price" | "volume" | "marketCap")}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price Correlation</SelectItem>
              <SelectItem value="volume">Volume Correlation</SelectItem>
              <SelectItem value="marketCap">Market Cap Correlation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <XAxis type="number" dataKey="x" name="Coin 1" domain={[-1, 1]} />
                  <YAxis type="number" dataKey="y" name="Coin 2" domain={[-1, 1]} />
                  <ZAxis type="number" range={[50, 400]} dataKey="z" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter name="Correlations" data={correlationData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search coins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-2"
              />
            </div>
            
            <div className="max-h-[320px] overflow-y-auto pr-2">
              {filteredCryptoData.map(coin => (
                <div key={coin.id} className="mb-2">
                  <Button
                    variant={selectedCoins.includes(coin.id) ? "default" : "outline"}
                    onClick={() => handleCoinToggle(coin.id)}
                    className="w-full justify-start"
                  >
                    <div className="flex items-center">
                      {coin.image && <img src={coin.image} alt={coin.name} className="w-5 h-5 mr-2" />}
                      <span>{coin.name} ({coin.symbol})</span>
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationAnalysis;
