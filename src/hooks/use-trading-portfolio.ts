
import { useState } from 'react';
import { CoinOption } from '@/types/trading';

export function useTradingPortfolio() {
  // Initial portfolio data
  const [portfolio] = useState<CoinOption[]>([
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
  ]);

  // Mock holdings
  const [holdings] = useState<{[key: string]: number}>({
    "bitcoin": 0.5,
    "ethereum": 3.2,
    "solana": 25,
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

  // Calculate allocation percentages
  const getAllocations = () => {
    const totalValue = getPortfolioValue();
    return portfolio.map(coin => {
      const amount = holdings[coin.id] || 0;
      const value = coin.price * amount;
      return {
        ...coin,
        amount,
        value,
        allocation: (value / totalValue) * 100
      };
    });
  };

  return {
    portfolio,
    holdings,
    portfolioValue: getPortfolioValue(),
    dailyChange: getPortfolioDailyChange(),
    allocations: getAllocations(),
  };
}
