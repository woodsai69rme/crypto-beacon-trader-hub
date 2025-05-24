
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TradingAccount, Trade, PortfolioAsset, CoinOption, SupportedCurrency } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

interface TradingContextType {
  activeAccount: TradingAccount | null;
  setActiveAccount: (account: TradingAccount | null) => void;
  accounts: TradingAccount[];
  addAccount: (account: TradingAccount) => void;
  updateAccount: (accountId: string, updates: Partial<TradingAccount>) => void;
  addTrade: (accountId: string, trade: Trade) => void;
  account: TradingAccount | null;
  coins: CoinOption[] | null;
  activeCurrency: SupportedCurrency;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const useTradingContext = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTradingContext must be used within a TradingProvider');
  }
  return context;
};

// Create alias for backward compatibility
export const useTrading = useTradingContext;

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeAccount, setActiveAccount] = useState<TradingAccount | null>(null);
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [coins, setCoins] = useState<CoinOption[] | null>(null);
  const [activeCurrency, setActiveCurrency] = useState<SupportedCurrency>('AUD');

  // Initialize with a default account
  useEffect(() => {
    const defaultAccount: TradingAccount = {
      id: 'default-account-1',
      name: 'Main Portfolio',
      trades: [],
      balance: 10000,
      currency: 'AUD',
      createdAt: new Date().toISOString(),
      assets: [
        {
          coinId: 'bitcoin',
          symbol: 'BTC',
          name: 'Bitcoin',
          amount: 0.5,
          price: 58352.12,
          value: 29176.06,
          allocation: 60,
          change24h: 1245.32,
          changePercent24h: 2.18,
          priceChange: 1245.32
        },
        {
          coinId: 'ethereum',
          symbol: 'ETH', 
          name: 'Ethereum',
          amount: 3.2,
          price: 3105.78,
          value: 9938.5,
          allocation: 40,
          change24h: 65.43,
          changePercent24h: 2.15,
          priceChange: 65.43
        }
      ]
    };

    setAccounts([defaultAccount]);
    setActiveAccount(defaultAccount);
  }, []);

  const addAccount = (account: TradingAccount) => {
    setAccounts(prev => [...prev, account]);
  };

  const updateAccount = (accountId: string, updates: Partial<TradingAccount>) => {
    setAccounts(prev => 
      prev.map(account => 
        account.id === accountId ? { ...account, ...updates } : account
      )
    );
    
    if (activeAccount?.id === accountId) {
      setActiveAccount(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const addTrade = (accountId: string, trade: Trade) => {
    updateAccount(accountId, {
      trades: [...(accounts.find(a => a.id === accountId)?.trades || []), trade]
    });
  };

  return (
    <TradingContext.Provider value={{
      activeAccount,
      setActiveAccount,
      accounts,
      addAccount,
      updateAccount,
      addTrade,
      account: activeAccount,
      coins,
      activeCurrency
    }}>
      {children}
    </TradingContext.Provider>
  );
};
