
import { useState, useEffect } from 'react';
import { TradingAccount } from '@/types/trading';

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
  
  const addAccount = (account: TradingAccount) => {
    setAccounts(prev => [...prev, account]);
  };
  
  const updateAccount = (id: string, updates: Partial<TradingAccount>) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === id ? { ...acc, ...updates, lastModified: new Date().toISOString() } : acc
    ));
  };
  
  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
  };
  
  const addTradeToAccount = (accountId: string, trade: any) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        return {
          ...acc,
          trades: [...acc.trades, trade],
          lastModified: new Date().toISOString()
        };
      }
      return acc;
    }));
  };
  
  return {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    addTradeToAccount
  };
};
