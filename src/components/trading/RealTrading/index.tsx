
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RealTimePrices from './RealTimePrices';
import { fetchTopCryptoData } from '@/services/cryptoService';
import { CoinOption } from '@/types/trading';

const RealTrading = () => {
  const [activeTab, setActiveTab] = useState('watchlist');
  const [isLoading, setIsLoading] = useState(true);
  const [marketData, setMarketData] = useState<CoinOption[]>([]);
  const [selectedCoinId, setSelectedCoinId] = useState<string>('bitcoin');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTopCryptoData(20);
        setMarketData(data);
        if (data.length > 0 && !selectedCoinId) {
          setSelectedCoinId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up polling interval
    const interval = setInterval(fetchData, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);
  
  const handleSelectCoin = (coinId: string) => {
    setSelectedCoinId(coinId);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Real-Time Trading</CardTitle>
        <CardDescription>
          Monitor market prices and practice trading with virtual funds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="trade">Trade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="watchlist">
            <RealTimePrices 
              initialCoins={marketData}
              selectedCoinId={selectedCoinId}
              onSelectCoin={handleSelectCoin}
              refreshInterval={15000} // 15 seconds
            />
          </TabsContent>
          
          <TabsContent value="trade">
            <div className="text-center p-8">
              <p className="text-lg">Trading functionality coming soon!</p>
              <p className="text-muted-foreground">Practice trading with paper money</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RealTrading;
