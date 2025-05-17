
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import RealTimePrices from './trading/RealTimePrices';
import { CoinOption } from '@/types/trading';
import { fetchTopCryptoData } from '@/services/enhancedCryptoApi';
import { toast } from '@/components/ui/use-toast';

const MarketOverview: React.FC = () => {
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [coins, setCoins] = useState<CoinOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadCoins = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTopCryptoData(4);
        // Convert CryptoData to CoinOption format
        const coinOptions: CoinOption[] = data.map(crypto => ({
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol,
          price: crypto.currentPrice,
          priceChange: crypto.priceChangePercentage24h * crypto.currentPrice / 100,
          changePercent: crypto.priceChangePercentage24h,
          image: `https://assets.coingecko.com/coins/images/1/large/${crypto.id}.png`,
          volume: crypto.totalVolume,
          marketCap: crypto.marketCap,
          value: crypto.symbol.toLowerCase(),
          label: `${crypto.name} (${crypto.symbol})`
        }));
        setCoins(coinOptions);
      } catch (error) {
        console.error('Error loading crypto data:', error);
        toast({
          title: 'Failed to load market data',
          description: 'Could not retrieve the latest cryptocurrency prices.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCoins();
  }, []);
  
  const handleSelectCoin = (coinId: string) => {
    setSelectedCoinId(coinId);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RealTimePrices 
            coins={coins}
            refreshInterval={60000}
            onSelectCoin={handleSelectCoin}
            selectedCoinId={selectedCoinId || ''}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketOverview;
