
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CoinOption } from '@/types/trading';

interface RealTimePortfolioProps {
  // Add any props here
}

const RealTimePortfolio: React.FC<RealTimePortfolioProps> = () => {
  const [portfolio, setPortfolio] = useState<CoinOption[]>([
    { 
      id: "bitcoin", 
      name: "Bitcoin", 
      symbol: "BTC", 
      price: 61245.32,
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      priceChange: 1200,
      changePercent: 2.3,
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
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      priceChange: -120,
      changePercent: -1.5,
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
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      priceChange: 3.56,
      changePercent: 3.1,
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
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      priceChange: -0.02,
      changePercent: -2.6,
      volume: 890000000,
      marketCap: 24000000000,
      value: "ADA",
      label: "Cardano (ADA)"
    },
    {
      id: "ripple",
      name: "XRP",
      symbol: "XRP",
      price: 0.57,
      image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      priceChange: 0.01,
      changePercent: 1.8,
      volume: 2400000000,
      marketCap: 32000000000,
      value: "XRP",
      label: "XRP (XRP)"
    },
    {
      id: "dogecoin",
      name: "Dogecoin",
      symbol: "DOGE",
      price: 0.14,
      image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
      priceChange: -0.004,
      changePercent: -2.1,
      volume: 1900000000,
      marketCap: 18000000000,
      value: "DOGE",
      label: "Dogecoin (DOGE)"
    }
  ]);
  
  const [holdings, setHoldings] = useState<{[key: string]: number}>({
    "bitcoin": 0.5,
    "ethereum": 3.2,
    "solana": 25,
    "cardano": 1000
  });

  // Calculate portfolio value
  const getPortfolioValue = () => {
    return portfolio.reduce((total, coin) => {
      const amount = holdings[coin.id] || 0;
      return total + (coin.price * amount);
    }, 0);
  };

  // Calculate 24h change
  const getPortfolioDailyChange = () => {
    return portfolio.reduce((total, coin) => {
      const amount = holdings[coin.id] || 0;
      const percentChange = coin.changePercent || 0;
      return total + (coin.price * amount * percentChange / 100);
    }, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-2xl font-bold">${getPortfolioValue().toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
          <div className={`text-sm ${getPortfolioDailyChange() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {getPortfolioDailyChange() >= 0 ? '▲' : '▼'} ${Math.abs(getPortfolioDailyChange()).toLocaleString(undefined, { maximumFractionDigits: 2 })} (24h)
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm font-medium">Assets</div>
          <div className="divide-y divide-border">
            {portfolio.map(coin => {
              const amount = holdings[coin.id] || 0;
              const value = coin.price * amount;
              const allocation = value / getPortfolioValue() * 100;
              
              return (
                <div key={coin.id} className="py-3 flex items-center">
                  <div className="flex items-center flex-1">
                    <div className="w-8 h-8 mr-3">
                      <img src={coin.image} alt={coin.name} className="w-full h-full" />
                    </div>
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-sm text-muted-foreground">{amount} {coin.symbol}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div>${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    <div className="text-sm text-muted-foreground">{allocation.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePortfolio;
