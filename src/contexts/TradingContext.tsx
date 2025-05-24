
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TradingAccount, Trade, PortfolioAsset } from '@/types/trading';

interface TradingContextType {
  activeAccount: TradingAccount | null;
  setActiveAccount: (account: TradingAccount | null) => void;
  accounts: TradingAccount[];
  addAccount: (account: TradingAccount) => void;
  updateAccount: (accountId: string, updates: Partial<TradingAccount>) => void;
  addTrade: (accountId: string, trade: Trade) => void;
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
          amount: 0.5,
          price: 58352.12,
          priceChange: 1245.32
        },
        {
          coinId: 'ethereum', 
          amount: 3.2,
          price: 3105.78,
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
      addTrade
    }}>
      {children}
    </TradingContext.Provider>
  );
};
