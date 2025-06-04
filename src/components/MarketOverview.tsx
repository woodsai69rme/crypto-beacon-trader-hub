
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import RealTimePrices from './trading/RealTimePrices';
import { CoinOption } from '@/types/trading';

const MarketOverview: React.FC = () => {
  const [selectedCoinId, setSelectedCoinId] = useState<string>("bitcoin");

  // Define symbols array for RealTimePrices component
  const symbols = ["BTC", "ETH", "SOL", "ADA"];

  const handleSelectCoin = (coinId: string) => {
    setSelectedCoinId(coinId);
  };

  const handlePriceUpdate = (symbol: string, price: number) => {
    console.log(`Price update for ${symbol}: ${price}`);
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
            symbols={symbols}
            selectedCoinId={selectedCoinId}
            onSelectCoin={handleSelectCoin}
            onPriceUpdate={handlePriceUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketOverview;
