
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CoinOption, Trade, TradingAccount } from '@/types/trading';

// Define mock data for initial coins
const initialCoins: CoinOption[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    price: 65000,
    value: 'bitcoin',
    label: 'Bitcoin (BTC)',
    priceChange: 2.5,
    changePercent: 2.5,
    marketCap: 1260000000000,
    volume: 45000000000
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    price: 3500,
    value: 'ethereum',
    label: 'Ethereum (ETH)',
    priceChange: 5.2,
    changePercent: 5.2,
    marketCap: 420000000000,
    volume: 25000000000
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    price: 140,
    value: 'solana',
    label: 'Solana (SOL)',
    priceChange: -1.8,
    changePercent: -1.8,
    marketCap: 63000000000,
    volume: 8000000000
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
    price: 0.45,
    value: 'cardano',
    label: 'Cardano (ADA)',
    priceChange: 0.3,
    changePercent: 0.3,
    marketCap: 16000000000,
    volume: 500000000
  },
  {
    id: 'ripple',
    name: 'XRP',
    symbol: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
    price: 0.56,
    value: 'ripple',
    label: 'XRP (XRP)',
    priceChange: 1.2,
    changePercent: 1.2,
    marketCap: 31000000000,
    volume: 1800000000
  }
];

// Define mock data for initial account
const initialAccount: TradingAccount = {
  id: 'demo-account',
  name: 'Demo Trading Account',
  balance: 10000,
  currency: 'USD',
  address: '0x0000000000000000000000000000000000000000',
  network: 'demo',
  isActive: true,
  initialBalance: 10000,
  assets: [
    {
      coinId: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      quantity: 0.05,
      averagePrice: 50000,
      currentPrice: 65000,
    },
    {
      coinId: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      quantity: 1.5,
      averagePrice: 3000,
      currentPrice: 3500,
    }
  ]
};

// Trading context type definition
interface TradingContextType {
  coins: CoinOption[];
  trades: Trade[];
  account?: TradingAccount;
  activeCurrency?: string;
  addTrade: (trade: Trade) => void;
  removeTrade: (id: string) => void;
  clearTrades: () => void;
  setCoinPrice: (coinId: string, newPrice: number) => void;
}

// Create the context with a default value
const TradingContext = createContext<TradingContextType>({
  coins: [],
  trades: [],
  addTrade: () => {},
  removeTrade: () => {},
  clearTrades: () => {},
  setCoinPrice: () => {},
});

// Custom hook to use the trading context
export const useTradingContext = () => useContext(TradingContext);

// Provider component
interface TradingProviderProps {
  children: ReactNode;
}

export const TradingProvider = ({ children }: TradingProviderProps) => {
  const [coins, setCoins] = useState<CoinOption[]>(initialCoins);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [account, setAccount] = useState<TradingAccount>(initialAccount);
  const activeCurrency = 'USD';

  // Load saved trades from localStorage
  useEffect(() => {
    const savedTrades = localStorage.getItem('trades');
    if (savedTrades) {
      try {
        setTrades(JSON.parse(savedTrades));
      } catch (error) {
        console.error('Failed to parse saved trades', error);
      }
    }
  }, []);

  // Save trades to localStorage when they change
  useEffect(() => {
    localStorage.setItem('trades', JSON.stringify(trades));
  }, [trades]);

  // Add a new trade
  const addTrade = (trade: Trade) => {
    setTrades(prev => [...prev, trade]);
  };

  // Remove a trade by ID
  const removeTrade = (id: string) => {
    setTrades(prev => prev.filter(trade => trade.id !== id));
  };

  // Clear all trades
  const clearTrades = () => {
    setTrades([]);
  };

  // Update coin price
  const setCoinPrice = (coinId: string, newPrice: number) => {
    setCoins(prev => 
      prev.map(coin => 
        coin.id === coinId ? { ...coin, price: newPrice } : coin
      )
    );
  };

  return (
    <TradingContext.Provider value={{ 
      coins, 
      trades, 
      account, 
      activeCurrency,
      addTrade, 
      removeTrade, 
      clearTrades,
      setCoinPrice
    }}>
      {children}
    </TradingContext.Provider>
  );
};
