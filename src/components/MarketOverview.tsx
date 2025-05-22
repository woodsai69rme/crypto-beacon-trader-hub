
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import RealTimePrices from './trading/RealTimePrices';
import { CoinOption } from '@/types/trading';

const initialCoins: CoinOption[] = [
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
    value: "BTC",
    label: "Bitcoin (BTC)" 
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
    value: "ETH",
    label: "Ethereum (ETH)"
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
    value: "SOL",
    label: "Solana (SOL)"
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
    value: "ADA",
    label: "Cardano (ADA)"
  }
];

const MarketOverview: React.FC = () => {
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
          <RealTimePrices initialCoins={initialCoins} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketOverview;
