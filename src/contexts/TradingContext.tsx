
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CoinOption, Trade, TradingAccount } from '@/types/trading';

// Sample coin data
const DEFAULT_COINS: CoinOption[] = [
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
    marketCap: 1200000000000,
    volume: 35000000000
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    price: 3500,
    value: 'ethereum',
    label: 'Ethereum (ETH)',
    priceChange: -1.2,
    changePercent: -1.2,
    marketCap: 420000000000,
    volume: 18000000000
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    price: 140,
    value: 'solana',
    label: 'Solana (SOL)',
    priceChange: 5.3,
    changePercent: 5.3,
    marketCap: 56000000000,
    volume: 4200000000
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
    price: 0.45,
    value: 'cardano',
    label: 'Cardano (ADA)',
    priceChange: -0.8,
    changePercent: -0.8,
    marketCap: 15000000000,
    volume: 780000000
  },
  {
    id: 'ripple',
    name: 'XRP',
    symbol: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
    price: 0.56,
    value: 'ripple',
    label: 'XRP (XRP)',
    priceChange: 0.2,
    changePercent: 0.2,
    marketCap: 30000000000,
    volume: 1500000000
  }
];

const DEFAULT_ACCOUNT: TradingAccount = {
  id: 'default',
  name: 'Paper Trading Account',
  balance: 10000,
  currency: 'USD',
  trades: [],
  initialBalance: 10000,
  isActive: true,
  address: '0x0000000000000000000000000000000000000000',
  network: 'paper',
  assets: []
};

interface TradingContextType {
  coins: CoinOption[];
  trades: Trade[];
  selectedCoin: CoinOption | null;
  setCoin: (coin: CoinOption) => void;
  setCoins: (coins: CoinOption[]) => void;
  addTrade: (trade: Trade) => void;
  account: TradingAccount;
  activeCurrency: string;
  toggleCurrency: (currency: string) => void;
}

const TradingContext = createContext<TradingContextType>({
  coins: DEFAULT_COINS,
  trades: [],
  selectedCoin: null,
  setCoin: () => {},
  setCoins: () => {},
  addTrade: () => {},
  account: DEFAULT_ACCOUNT,
  activeCurrency: 'USD',
  toggleCurrency: () => {}
});

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<CoinOption[]>(DEFAULT_COINS);
  const [selectedCoin, setSelectedCoin] = useState<CoinOption | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [account, setAccount] = useState<TradingAccount>(DEFAULT_ACCOUNT);
  const [activeCurrency, setActiveCurrency] = useState('USD');
  
  // Load trades from localStorage
  useEffect(() => {
    try {
      const savedTrades = localStorage.getItem('trades');
      if (savedTrades) {
        setTrades(JSON.parse(savedTrades));
      }
      
      const savedAccount = localStorage.getItem('tradingAccount');
      if (savedAccount) {
        setAccount(JSON.parse(savedAccount));
      }
    } catch (error) {
      console.error('Error loading trades or account:', error);
    }
  }, []);
  
  // Save trades to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('trades', JSON.stringify(trades));
    } catch (error) {
      console.error('Error saving trades:', error);
    }
  }, [trades]);
  
  // Save account to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('tradingAccount', JSON.stringify(account));
    } catch (error) {
      console.error('Error saving account:', error);
    }
  }, [account]);
  
  const setCoin = (coin: CoinOption) => setSelectedCoin(coin);
  
  const addTrade = (trade: Trade) => {
    setTrades(prev => [...prev, trade]);
    
    // Update account balance based on trade
    const updatedAccount = { ...account };
    if (trade.type === 'buy') {
      updatedAccount.balance -= trade.totalValue || 0;
    } else {
      updatedAccount.balance += trade.totalValue || 0;
    }
    setAccount(updatedAccount);
  };

  const toggleCurrency = (currency: string) => {
    setActiveCurrency(currency);
  };
  
  return (
    <TradingContext.Provider 
      value={{
        coins,
        trades,
        selectedCoin,
        setCoin,
        setCoins,
        addTrade,
        account,
        activeCurrency,
        toggleCurrency
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTradingContext = () => useContext(TradingContext);

export default TradingContext;
