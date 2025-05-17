import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TradingAccount,
  CoinOption,
  Trade,
  SupportedCurrency,
} from '@/types/trading';

// Mock data for initial state
const mockCoins: CoinOption[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 65000,
    priceChange: 2.5,
    changePercent: 2.5,
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    value: 'bitcoin',
    label: 'Bitcoin (BTC)',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3500,
    priceChange: 3.2,
    changePercent: 3.2,
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    value: 'ethereum',
    label: 'Ethereum (ETH)',
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    price: 150,
    priceChange: -1.8,
    changePercent: -1.8,
    image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    value: 'solana',
    label: 'Solana (SOL)',
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.45,
    priceChange: 1.2,
    changePercent: 1.2,
    image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
    value: 'cardano',
    label: 'Cardano (ADA)',
  },
  {
    id: 'chainlink',
    name: 'Chainlink',
    symbol: 'LINK',
    price: 15.8,
    priceChange: 5.6,
    changePercent: 5.6,
    image: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
    value: 'chainlink',
    label: 'Chainlink (LINK)',
  }
];

const initialAccount: TradingAccount = {
  id: 'default-account',
  name: 'Default Account',
  trades: [
    {
      id: 'trade-1',
      coinId: 'bitcoin',
      coinName: 'Bitcoin',
      coinSymbol: 'BTC',
      type: 'buy',
      amount: 0.05,
      price: 62000,
      totalValue: 3100,
      timestamp: new Date().toISOString(),
      currency: 'USD',
      total: 3100,
    },
    {
      id: 'trade-2',
      coinId: 'ethereum',
      coinName: 'Ethereum',
      coinSymbol: 'ETH',
      type: 'buy',
      amount: 1.2,
      price: 3200,
      totalValue: 3840,
      timestamp: new Date().toISOString(),
      currency: 'USD',
      total: 3840,
    }
  ],
  balance: 25000,
  currency: 'USD',
  createdAt: new Date().toISOString(),
  address: '0x1234567890abcdef1234567890abcdef12345678',
  network: 'Ethereum',
  initialBalance: 25000
};

interface TradingContextType {
  account: TradingAccount | null;
  activeCurrency: SupportedCurrency;
  coins: CoinOption[];
  isLoading: boolean;
  addTrade: (trade: Omit<Trade, 'id' | 'timestamp'>) => void;
  setActiveCurrency: (currency: SupportedCurrency) => void;
  getOwnedCoinAmount: (coinId: string) => number;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [account, setAccount] = useState<TradingAccount | null>(initialAccount);
  const [activeCurrency, setActiveCurrency] = useState<SupportedCurrency>('USD');
  const [coins, setCoins] = useState<CoinOption[]>(mockCoins);
  const [isLoading, setIsLoading] = useState(false);

  const addTrade = (trade: Omit<Trade, 'id' | 'timestamp'>) => {
    if (!account) return;

    const newTrade: Trade = {
      ...trade,
      id: `trade-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setAccount({
      ...account,
      trades: [...account.trades, newTrade],
      balance:
        trade.type === 'buy'
          ? account.balance - trade.totalValue
          : account.balance + trade.totalValue,
    });
  };

  const getOwnedCoinAmount = (coinId: string): number => {
    if (!account) return 0;

    return account.trades.reduce((total, trade) => {
      if (trade.coinId !== coinId) return total;
      return trade.type === 'buy'
        ? total + trade.amount
        : total - trade.amount;
    }, 0);
  };

  // You can add effects to fetch real data here

  return (
    <TradingContext.Provider value={{
      account,
      activeCurrency,
      coins,
      isLoading,
      addTrade,
      setActiveCurrency,
      getOwnedCoinAmount,
    }}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTradingContext = (): TradingContextType => {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTradingContext must be used within a TradingProvider');
  }
  return context;
};
