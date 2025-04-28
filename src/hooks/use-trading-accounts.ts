
import { useState, useEffect, useMemo } from 'react';
import { TradingAccount, Trade } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

export const useTradingAccounts = () => {
  const [accounts, setAccounts] = useState<TradingAccount[]>([
    {
      id: "acc-1",
      name: "Main Trading",
      balance: 10000,
      initialBalance: 5000,
      currency: "USD",
      trades: [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      description: "Main trading account for spot trading",
      type: "spot",
      riskLevel: "medium",
      allowBots: true
    },
    {
      id: "acc-2",
      name: "HODL Account",
      balance: 25000,
      initialBalance: 15000,
      currency: "USD",
      trades: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      description: "Long-term holding account",
      type: "spot",
      riskLevel: "low",
      allowBots: false
    },
    {
      id: "acc-3",
      name: "Bot Trading",
      balance: 5000,
      initialBalance: 5000,
      currency: "USD",
      trades: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
      lastModified: new Date().toISOString(),
      description: "Dedicated account for bot trading",
      type: "spot",
      riskLevel: "high",
      allowBots: true
    }
  ]);

  const [activeAccountId, setActiveAccountId] = useState<string>("acc-1");
  
  const addAccount = (account: TradingAccount) => {
    setAccounts(prev => [...prev, account]);
  };
  
  const createAccount = (accountData: Omit<TradingAccount, 'id' | 'trades' | 'createdAt' | 'lastModified'>) => {
    const newAccount: TradingAccount = {
      ...accountData,
      id: `acc-${uuidv4().substring(0, 8)}`,
      trades: [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    setAccounts(prev => [...prev, newAccount]);
    return newAccount.id;
  };
  
  const updateAccount = (id: string, updates: Partial<TradingAccount>) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === id ? { ...acc, ...updates, lastModified: new Date().toISOString() } : acc
    ));
  };
  
  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
    if (activeAccountId === id) {
      setActiveAccountId(accounts.find(acc => acc.id !== id)?.id || "");
    }
  };
  
  const addTradeToAccount = (accountId: string, trade: Trade) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        const updatedBalance = trade.type === 'buy' 
          ? acc.balance - trade.totalValue 
          : acc.balance + trade.totalValue;
        
        return {
          ...acc,
          trades: [...acc.trades, trade],
          balance: updatedBalance,
          lastModified: new Date().toISOString()
        };
      }
      return acc;
    }));
  };

  const getActiveAccount = (): TradingAccount | undefined => {
    return accounts.find(account => account.id === activeAccountId);
  };
  
  return {
    accounts,
    activeAccountId,
    setActiveAccountId,
    addAccount,
    createAccount,
    updateAccount,
    deleteAccount,
    addTradeToAccount,
    getActiveAccount
  };
};
