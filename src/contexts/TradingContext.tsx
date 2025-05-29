
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trade, TradingAccount, SupportedCurrency } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

interface TradingContextType {
  accounts: TradingAccount[];
  activeAccount: TradingAccount | null;
  addTrade: (trade: Trade) => void;
  getTotalBalance: () => number;
  createAccount: (name: string) => string;
  setActiveAccount: (accountId: string) => void;
}

const TradingContext = createContext<TradingContextType>({
  accounts: [],
  activeAccount: null,
  addTrade: () => {},
  getTotalBalance: () => 0,
  createAccount: () => '',
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
        assets: []
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

  const createAccount = (name: string): string => {
    const newAccount: TradingAccount = {
      id: uuidv4(),
      name,
      balance: 10000,
      currency: 'AUD' as SupportedCurrency,
      trades: [],
      type: 'paper',
      createdAt: new Date().toISOString(),
      assets: []
    };

    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    localStorage.setItem('trading-accounts', JSON.stringify(updatedAccounts));
    
    return newAccount.id;
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
      setActiveAccount
    }}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => useContext(TradingContext);
