import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { startPriceMonitoring } from "@/services/priceMonitoring";
import { CoinOption } from '@/types/trading';
import RealTimePriceChart from './RealTimePriceChart';
import RealTimePrices from './RealTimePrices';
import RealTimeTrader from './RealTimeTrader';
import RealTimePortfolioPerformance from './RealTimePortfolioPerformance';

const RealTimeTrading: React.FC = () => {
  const [marketData, setMarketData] = useState<CoinOption[]>([
    { 
      id: "bitcoin", 
      name: "Bitcoin", 
      symbol: "BTC", 
      price: 61245.32,
      priceChange: 1200,
      changePercent: 2.3,
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      volume: 28000000000,
      marketCap: 1180000000000,
      value: "BTC" // Adding value to match updated type
    },
    { 
      id: "ethereum", 
      name: "Ethereum", 
      symbol: "ETH", 
      price: 3010.45,
      priceChange: -120,
      changePercent: -1.5,
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      volume: 15000000000,
      marketCap: 360000000000,
      value: "ETH" // Adding value to match updated type
    },
    { 
      id: "solana", 
      name: "Solana", 
      symbol: "SOL", 
      price: 121.33,
      priceChange: 3.56,
      changePercent: 3.1,
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      volume: 5200000000,
      marketCap: 90000000000,
      value: "SOL" // Adding value to match updated type
    },
    { 
      id: "cardano", 
      name: "Cardano", 
      symbol: "ADA", 
      price: 0.45,
      priceChange: -0.02,
      changePercent: -2.6,
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      volume: 890000000,
      marketCap: 24000000000,
      value: "ADA" // Adding value to match updated type
    },
    { 
      id: "ripple", 
      name: "XRP", 
      symbol: "XRP", 
      price: 0.61,
      priceChange: 0.01,
      changePercent: 1.8,
      image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      volume: 2400000000,
      marketCap: 32000000000,
      value: "XRP" // Adding value to match updated type
    },
    { 
      id: "dogecoin", 
      name: "Dogecoin", 
      symbol: "DOGE", 
      price: 0.138,
      priceChange: -0.004,
      changePercent: -2.1,
      image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
      volume: 1900000000,
      marketCap: 18000000000,
      value: "DOGE" // Adding value to match updated type
    }
  ]);
  
  const [selectedCoinId, setSelectedCoinId] = useState<string>("bitcoin");
  
  useEffect(() => {
    const coinIds = marketData.map(coin => coin.id);
    
    const stopMonitoring = startPriceMonitoring(
      coinIds,
      (updatedCoins) => {
        setMarketData(updatedCoins);
      },
      3000 // Update every 3 seconds
    );
    
    return () => stopMonitoring();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Trading</CardTitle>
        <CardDescription>
          Trade cryptocurrencies based on real-time market data and analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="prices">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="prices">Market Prices</TabsTrigger>
            <TabsTrigger value="chart">Price Chart</TabsTrigger>
            <TabsTrigger value="trader">Trader</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prices">
            <RealTimePrices 
              initialCoins={marketData}
              onSelectCoin={(coinId) => setSelectedCoinId(coinId)}
              selectedCoinId={selectedCoinId}
            />
          </TabsContent>
          
          <TabsContent value="chart">
            <RealTimePriceChart 
              coins={marketData} 
              selectedCoinId={selectedCoinId}
              onSelectCoin={(coinId) => setSelectedCoinId(coinId)}
            />
          </TabsContent>
          
          <TabsContent value="trader">
            <RealTimeTrader
              marketData={marketData}
              selectedCoinId={selectedCoinId}
              onSelectCoin={(coinId) => setSelectedCoinId(coinId)}
            />
          </TabsContent>
          
          <TabsContent value="portfolio">
            <RealTimePortfolioPerformance />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RealTimeTrading;
