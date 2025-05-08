
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "lucide-react";
import CorrelationAnalysis from './CorrelationAnalysis';
import CorrelationMatrix from './CorrelationMatrix';
import PriceCorrelationChart from './PriceCorrelationChart';
import { mockCryptoData } from './mockData';
import { CryptoData } from '@/types/trading';

const MarketCorrelations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('scatter');
  const [timeframe, setTimeframe] = useState<string>('7d');
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  
  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll use mock data
    const formattedData: CryptoData[] = mockCryptoData.map(coin => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      price: coin.price,
      priceChange: coin.priceChange,
      changePercent: coin.changePercent,
      priceChangePercentage: coin.changePercent, // Map to correct property
      marketCap: coin.marketCap,
      volume: coin.volume,
      circulatingSupply: coin.circulatingSupply || 0,
      rank: coin.rank
    }));
    
    setCryptoData(formattedData);
  }, [timeframe]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Market Correlations
        </CardTitle>
        <CardDescription>Analyze correlations between different markets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="scatter">Scatter Plot</TabsTrigger>
              <TabsTrigger value="matrix">Correlation Matrix</TabsTrigger>
              <TabsTrigger value="price">Price Correlation</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <TabsContent value="scatter" className="mt-0">
          <CorrelationAnalysis data={cryptoData} />
          <div className="text-xs text-muted-foreground text-center mt-4">
            Scatter plot shows relationship between market cap and trading volume
          </div>
        </TabsContent>
        
        <TabsContent value="matrix" className="mt-0">
          <CorrelationMatrix data={cryptoData} />
          <div className="text-xs text-muted-foreground text-center mt-4">
            Correlation matrix shows price movement relationships between assets
          </div>
        </TabsContent>
        
        <TabsContent value="price" className="mt-0">
          <PriceCorrelationChart data={cryptoData} />
          <div className="text-xs text-muted-foreground text-center mt-4">
            Price correlation chart shows how prices move together over time
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default MarketCorrelations;
