
import { useState, useEffect } from 'react';
import { TradingAccount, Trade } from '@/types/trading';

export const useTradingAccounts = () => {
  // Load accounts from localStorage or initialize with default account
  const [accounts, setAccounts] = useState<TradingAccount[]>(() => {
    try {
      const savedAccounts = localStorage.getItem('tradingAccounts');
      if (savedAccounts) {
        return JSON.parse(savedAccounts);
      }
    } catch (error) {
      console.error('Error loading trading accounts:', error);
    }
    
    // Default paper trading account
    return [{
      id: 'default-paper',
      name: 'Paper Trading Account',
      balance: 10000,
      currency: 'USD',
      trades: [],
      createdAt: new Date().toISOString(),
      initialBalance: 10000,
      isActive: true,
      address: '0x0000000000000000000000000000000000000000', // Default placeholder address
      network: 'paper',  // This indicates it's a paper trading account
      assets: []
    }];
  });

  // Save to localStorage when accounts change
  useEffect(() => {
    try {
      localStorage.setItem('tradingAccounts', JSON.stringify(accounts));
    } catch (error) {
      console.error('Error saving trading accounts:', error);
    }
  }, [accounts]);

  const addAccount = (account: Partial<TradingAccount>) => {
    const newAccount: TradingAccount = {
      id: `account-${Date.now()}`,
      name: account.name || 'New Account',
      balance: account.balance || 0,
      currency: account.currency || 'USD',
      trades: account.trades || [],
      createdAt: new Date().toISOString(),
      initialBalance: account.initialBalance || account.balance || 0,
      isActive: true,
      address: account.address || '0x0000000000000000000000000000000000000000',
      network: account.network || 'paper',
      assets: account.assets || []
    };
    
    setAccounts(prevAccounts => [...prevAccounts, newAccount]);
    return newAccount;
  };

  const updateAccount = (id: string, updates: Partial<TradingAccount>) => {
    setAccounts(prevAccounts => 
      prevAccounts.map(account => 
        account.id === id ? { ...account, ...updates } : account
      )
    );
  };

  const removeAccount = (id: string) => {
    setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== id));
  };

  const getAccountById = (id: string) => {
    return accounts.find(account => account.id === id);
  };

  const addTradeToAccount = (accountId: string, trade: Trade) => {
    setAccounts(prevAccounts => 
      prevAccounts.map(account => {
        if (account.id !== accountId) return account;
        
        // Add the trade
        const updatedTrades = [...(account.trades || []), trade];
        
        // Update balance based on trade
        let balanceChange = 0;
        if (trade.type === 'buy') {
          balanceChange = -trade.totalValue;
        } else if (trade.type === 'sell') {
          balanceChange = trade.totalValue;
        }
        
        const updatedBalance = account.balance + balanceChange;
        
        return {
          ...account,
          trades: updatedTrades,
          balance: updatedBalance
        };
      })
    );
  };

  return {
    accounts,
    addAccount,
    updateAccount,
    removeAccount,
    getAccountById,
    addTradeToAccount
  };
};

export default useTradingAccounts;
