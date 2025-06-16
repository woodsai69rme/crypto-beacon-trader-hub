
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trade, TradingAccount, SupportedCurrency, PortfolioAsset } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

interface TradingContextType {
  accounts: TradingAccount[];
  activeAccount: TradingAccount | null;
  addTrade: (trade: Trade) => void;
  getTotalBalance: () => number;
  createAccount: (accountData: Omit<TradingAccount, 'id' | 'createdAt'>) => string;
  deleteAccount: (accountId: string) => void;
  setActiveAccount: (accountId: string) => void;
}

const TradingContext = createContext<TradingContextType>({
  accounts: [],
  activeAccount: null,
  addTrade: () => {},
  getTotalBalance: () => 0,
  createAccount: () => '',
  deleteAccount: () => {},
  setActiveAccount: () => {},
});

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [activeAccount, setActiveAccountState] = useState<TradingAccount | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('trading-accounts');
    if (stored) {
      const storedAccounts = JSON.parse(stored);
      setAccounts(storedAccounts);
      if (storedAccounts.length > 0) {
        setActiveAccountState(storedAccounts[0]);
      }
    } else {
      // Create default account
      const defaultAccount: TradingAccount = {
        id: uuidv4(),
        name: 'Paper Trading Account',
        balance: 10000,
        currency: 'AUD' as SupportedCurrency,
        trades: [],
        type: 'paper',
        createdAt: new Date().toISOString(),
        assets: [],
        isActive: true
      };
      setAccounts([defaultAccount]);
      setActiveAccountState(defaultAccount);
      localStorage.setItem('trading-accounts', JSON.stringify([defaultAccount]));
    }
  }, []);

  const addTrade = (trade: Trade) => {
    if (!activeAccount) return;

    const updatedAccounts = accounts.map(account => {
      if (account.id === activeAccount.id) {
        const updatedTrades = [...account.trades, trade];
        const updatedBalance = trade.type === 'buy' 
          ? account.balance - trade.totalValue
          : account.balance + trade.totalValue;
        
        return {
          ...account,
          trades: updatedTrades,
          balance: updatedBalance
        };
      }
      return account;
    });

    setAccounts(updatedAccounts);
    setActiveAccountState(updatedAccounts.find(acc => acc.id === activeAccount.id) || null);
    localStorage.setItem('trading-accounts', JSON.stringify(updatedAccounts));
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  const createAccount = (accountData: Omit<TradingAccount, 'id' | 'createdAt'>): string => {
    const newAccount: TradingAccount = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...accountData,
    };

    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    localStorage.setItem('trading-accounts', JSON.stringify(updatedAccounts));
    
    return newAccount.id;
  };

  const deleteAccount = (accountId: string) => {
    const updatedAccounts = accounts.filter(account => account.id !== accountId);
    setAccounts(updatedAccounts);
    
    if (activeAccount?.id === accountId) {
      setActiveAccountState(updatedAccounts.length > 0 ? updatedAccounts[0] : null);
    }
    
    localStorage.setItem('trading-accounts', JSON.stringify(updatedAccounts));
  };

  const setActiveAccount = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      setActiveAccountState(account);
    }
  };

  return (
    <TradingContext.Provider value={{
      accounts,
      activeAccount,
      addTrade,
      getTotalBalance,
      createAccount,
      deleteAccount,
      setActiveAccount
    }}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => useContext(TradingContext);
export const useTradingContext = () => useContext(TradingContext);
