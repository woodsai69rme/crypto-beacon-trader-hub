import { useState, useEffect } from 'react';
import { useTradingAccounts } from './use-trading-accounts';
import { Trade, CoinOption } from '@/types/trading';

export function useTradingPortfolio() {
  const { accounts, activeAccountId } = useTradingAccounts();
  const [coinData, setCoinData] = useState<CoinOption[]>([
    { 
      id: "bitcoin", 
      name: "Bitcoin", 
      symbol: "BTC", 
      price: 61245.32,
      priceChange: 1200,
      changePercent: 2.3,
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      volume: 28000000000,
      marketCap: 1180000000000
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
      marketCap: 360000000000
    },
    // Add more coins as needed
  ]);

  const [portfolioValue, setPortfolioValue] = useState(0);
  const [holdings, setHoldings] = useState<{ [coinId: string]: number }>({});

  useEffect(() => {
    if (!activeAccountId) {
      setPortfolioValue(0);
      setHoldings({});
      return;
    }

    const activeAccount = accounts.find(account => account.id === activeAccountId);
    if (!activeAccount) {
      setPortfolioValue(0);
      setHoldings({});
      return;
    }

    // Calculate holdings
    const newHoldings: { [coinId: string]: number } = {};
    activeAccount.trades.forEach(trade => {
      if (!newHoldings[trade.coinId]) {
        newHoldings[trade.coinId] = 0;
      }
      if (trade.type === 'buy') {
        newHoldings[trade.coinId] += trade.amount;
      } else {
        newHoldings[trade.coinId] -= trade.amount;
      }
    });
    setHoldings(newHoldings);

    // Calculate portfolio value
    let totalValue = activeAccount.balance;
    Object.entries(newHoldings).forEach(([coinId, amount]) => {
      const coin = coinData.find(c => c.id === coinId);
      if (coin) {
        totalValue += coin.price * amount;
      }
    });
    setPortfolioValue(totalValue);
  }, [accounts, activeAccountId, coinData]);

  const getOwnedCoinAmount = (coinId: string): number => {
    return holdings[coinId] || 0;
  };

  return { portfolioValue, holdings, getOwnedCoinAmount };
}
