
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CoinOption, Trade, TradingAccount } from '@/types/trading';

// Sample coin data
const initialCoins: CoinOption[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    price: 65000,
    value: 'bitcoin',
    priceChange: 2.5,
    changePercent: 2.5,
    marketCap: 1250000000000,
    volume: 35000000000
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    price: 3500,
    value: 'ethereum',
    priceChange: 1.2,
    changePercent: 1.2,
    marketCap: 420000000000,
    volume: 15000000000
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    price: 140,
    value: 'solana',
    priceChange: 3.8,
    changePercent: 3.8,
    marketCap: 62000000000,
    volume: 4800000000
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    price: 0.45,
    value: 'cardano',
    priceChange: -0.5,
    changePercent: -0.5,
    marketCap: 16000000000,
    volume: 500000000
  },
  {
    id: 'xrp',
    name: 'XRP',
    symbol: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    price: 0.56,
    value: 'xrp',
    priceChange: 1.1,
    changePercent: 1.1,
    marketCap: 31000000000,
    volume: 1200000000
  }
];

interface TradingContextType {
  coins: CoinOption[];
  trades: Trade[];
  accounts: TradingAccount[];
  selectedAccount: TradingAccount | null;
  addTrade: (trade: Trade) => void;
  updateTrade: (id: string, updates: Partial<Trade>) => void;
  deleteTrade: (id: string) => void;
  selectedCoin: CoinOption | null;
  setSelectedCoin: (coin: CoinOption | null) => void;
  refreshCoins: () => void;
}

const TradingContext = createContext<TradingContextType>({
  coins: [],
  trades: [],
  accounts: [],
  selectedAccount: null,
  addTrade: () => {},
  updateTrade: () => {},
  deleteTrade: () => {},
  selectedCoin: null,
  setSelectedCoin: () => {},
  refreshCoins: () => {}
});

export const TradingProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [coins, setCoins] = useState<CoinOption[]>(initialCoins);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinOption | null>(null);
  
  // Sample account
  const initialAccount: TradingAccount = {
    id: 'demo-account',
    name: 'Demo Trading Account',
    address: '0x1234...5678',
    balance: 10000,
    currency: 'USD',
    network: 'ethereum',
    isActive: true,
    initialBalance: 10000,
    assets: [
      {
        coinId: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        quantity: 0.05,
        averagePrice: 65000,
        currentPrice: 65000
      },
      {
        coinId: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        quantity: 1.5,
        averagePrice: 3200,
        currentPrice: 3500
      }
    ]
  };
  
  const [accounts, setAccounts] = useState<TradingAccount[]>([initialAccount]);
  const [selectedAccount, setSelectedAccount] = useState<TradingAccount | null>(initialAccount);
  
  // Function to add a new trade
  const addTrade = (trade: Trade) => {
    setTrades(prevTrades => [...prevTrades, trade]);
  };
  
  // Function to update an existing trade
  const updateTrade = (id: string, updates: Partial<Trade>) => {
    setTrades(prevTrades => prevTrades.map(trade => 
      trade.id === id ? { ...trade, ...updates } : trade
    ));
  };
  
  // Function to delete a trade
  const deleteTrade = (id: string) => {
    setTrades(prevTrades => prevTrades.filter(trade => trade.id !== id));
  };
  
  // Function to refresh coin prices
  const refreshCoins = () => {
    // In a real app, this would fetch fresh data from an API
    setCoins(prevCoins => prevCoins.map(coin => ({
      ...coin,
      price: coin.price * (1 + (Math.random() * 0.04 - 0.02)), // Random price change ±2%
      priceChange: Math.random() * 5 - 2.5, // Random price change between -2.5% and 2.5%
      changePercent: Math.random() * 5 - 2.5
    })));
  };
  
  // Auto-refresh prices every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(refreshCoins, 30000);
    return () => clearInterval(intervalId);
  }, []);
  
  // Initial coin selection
  useEffect(() => {
    if (coins.length > 0 && !selectedCoin) {
      setSelectedCoin(coins[0]);
    }
  }, [coins, selectedCoin]);
  
  return (
    <TradingContext.Provider value={{
      coins,
      trades,
      accounts,
      selectedAccount,
      addTrade,
      updateTrade,
      deleteTrade,
      selectedCoin,
      setSelectedCoin,
      refreshCoins
    }}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTradingContext = () => useContext(TradingContext);
