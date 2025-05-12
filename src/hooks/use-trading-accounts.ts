
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TradingAccount, Position, Trade } from '@/types/trading';

// Mock data for initial accounts
const defaultAccounts: TradingAccount[] = [
  {
    id: 'default-account-1',
    name: 'Main Trading Account',
    balance: 10000,
    initialBalance: 10000,
    currency: 'USD',
    positions: [],
    trades: [],
    createdAt: new Date().toISOString(),
    performance: {
      daily: 0,
      weekly: 0,
      monthly: 0,
      allTime: 0
    }
  }
];

const useTradingAccounts = () => {
  const [accounts, setAccounts] = useState<TradingAccount[]>(defaultAccounts);
  const [selectedAccount, setSelectedAccount] = useState<TradingAccount>(defaultAccounts[0]);
  
  // Load accounts from local storage on mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem('tradingAccounts');
    if (savedAccounts) {
      try {
        const parsed = JSON.parse(savedAccounts);
        setAccounts(parsed);
        
        // Select the first account
        if (parsed.length > 0) {
          setSelectedAccount(parsed[0]);
        }
      } catch (error) {
        console.error('Failed to parse saved accounts:', error);
      }
    }
  }, []);
  
  // Save accounts to local storage when they change
  useEffect(() => {
    localStorage.setItem('tradingAccounts', JSON.stringify(accounts));
  }, [accounts]);
  
  const createAccount = (name: string, initialBalance: number, currency: string = 'USD'): TradingAccount => {
    const newAccount: TradingAccount = {
      id: uuidv4(),
      name,
      balance: initialBalance,
      initialBalance,
      currency,
      positions: [],
      trades: [],
      createdAt: new Date().toISOString(),
      performance: {
        daily: 0,
        weekly: 0,
        monthly: 0,
        allTime: 0
      }
    };
    
    setAccounts(prev => [...prev, newAccount]);
    return newAccount;
  };
  
  const updateAccount = (accountId: string, updates: Partial<TradingAccount>): void => {
    setAccounts(prev => 
      prev.map(account => 
        account.id === accountId ? { ...account, ...updates } : account
      )
    );
    
    // Update selected account if it's being updated
    if (selectedAccount.id === accountId) {
      setSelectedAccount(prev => ({ ...prev, ...updates }));
    }
  };
  
  const deleteAccount = (accountId: string): void => {
    setAccounts(prev => prev.filter(account => account.id !== accountId));
    
    // If deleting the selected account, select another one
    if (selectedAccount.id === accountId) {
      const remainingAccounts = accounts.filter(account => account.id !== accountId);
      if (remainingAccounts.length > 0) {
        setSelectedAccount(remainingAccounts[0]);
      }
    }
  };
  
  const selectAccount = (accountId: string): void => {
    const account = accounts.find(a => a.id === accountId);
    if (account) {
      setSelectedAccount(account);
    }
  };
  
  const createTrade = (
    accountId: string,
    type: 'buy' | 'sell',
    coinId: string,
    coinName: string,
    coinSymbol: string,
    price: number,
    amount: number
  ): Trade | null => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return null;
    
    const total = price * amount;
    
    // Validate sufficient balance for buys
    if (type === 'buy' && total > account.balance) {
      return null;
    }
    
    // Create trade object
    const trade: Trade = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      type,
      price,
      amount,
      total,
      profit: 0, // Set later for sells
      profitPercentage: 0, // Set later for sells
      coin: coinId,
      coinId,
      coinName,
      coinSymbol,
      currency: account.currency,
      totalValue: total
    };
    
    // Clone account to update
    const updatedAccount = { ...account };
    
    // Update the account balance
    if (type === 'buy') {
      // Reduce balance for buys
      updatedAccount.balance -= total;
      
      // Add or update position
      const existingPosition = account.positions.find(p => p.coinId === coinId);
      
      if (existingPosition) {
        // Update existing position
        const newAmount = existingPosition.amount + amount;
        const newEntryPrice = 
          ((existingPosition.entryPrice * existingPosition.amount) + (price * amount)) / newAmount;
          
        updatedAccount.positions = account.positions.map(p => {
          if (p.coinId === coinId) {
            return {
              ...p,
              amount: newAmount,
              entryPrice: newEntryPrice,
              currentPrice: price,
              value: newAmount * price,
              // No profit/loss calc on buy
              profitLoss: 0,
              profitLossPercentage: 0
            };
          }
          return p;
        });
      } else {
        // Create new position
        const newPosition: Position = {
          id: uuidv4(),
          coinId,
          coinName,
          coinSymbol,
          amount,
          entryPrice: price,
          currentPrice: price,
          value: amount * price,
          profitLoss: 0,
          profitLossPercentage: 0,
          openedAt: new Date().toISOString()
        };
        
        updatedAccount.positions = [...account.positions, newPosition];
      }
    } else {
      // Process sell
      const position = account.positions.find(p => p.coinId === coinId);
      
      if (!position || position.amount < amount) {
        // Can't sell what you don't have
        return null;
      }
      
      // Calculate profit/loss
      const profitLoss = (price - position.entryPrice) * amount;
      const profitPercentage = ((price / position.entryPrice) - 1) * 100;
      
      // Update trade with profit info
      trade.profit = profitLoss;
      trade.profitPercentage = profitPercentage;
      trade.totalValue = total + profitLoss;
      
      // Update account balance
      updatedAccount.balance += total;
      
      // Update position
      const remainingAmount = position.amount - amount;
      
      if (remainingAmount <= 0.000001) {
        // Remove the position if selling all
        updatedAccount.positions = account.positions.filter(p => p.coinId !== coinId);
      } else {
        // Update position with reduced amount
        updatedAccount.positions = account.positions.map(p => {
          if (p.coinId === coinId) {
            return {
              ...p,
              amount: remainingAmount,
              currentPrice: price,
              value: remainingAmount * price,
              profitLoss: (price - p.entryPrice) * remainingAmount,
              profitLossPercentage: ((price / p.entryPrice) - 1) * 100
            };
          }
          return p;
        });
      }
    }
    
    // Add trade to account history
    updatedAccount.trades = [...updatedAccount.trades, trade];
    
    // Calculate performance
    updatedAccount.performance = calculatePerformance(updatedAccount);
    
    // Update the account
    setAccounts(prev => 
      prev.map(a => a.id === accountId ? updatedAccount : a)
    );
    
    // Update selected account if necessary
    if (selectedAccount.id === accountId) {
      setSelectedAccount(updatedAccount);
    }
    
    return trade;
  };
  
  // Helper function to calculate account performance
  const calculatePerformance = (account: TradingAccount) => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const dailyTrades = account.trades.filter(t => new Date(t.timestamp) >= oneDayAgo);
    const weeklyTrades = account.trades.filter(t => new Date(t.timestamp) >= oneWeekAgo);
    const monthlyTrades = account.trades.filter(t => new Date(t.timestamp) >= oneMonthAgo);
    
    const dailyProfit = dailyTrades.reduce((sum, trade) => sum + trade.profit, 0);
    const weeklyProfit = weeklyTrades.reduce((sum, trade) => sum + trade.profit, 0);
    const monthlyProfit = monthlyTrades.reduce((sum, trade) => sum + trade.profit, 0);
    const allTimeProfit = account.balance - account.initialBalance;
    
    const dailyPercent = account.initialBalance > 0 ? (dailyProfit / account.initialBalance) * 100 : 0;
    const weeklyPercent = account.initialBalance > 0 ? (weeklyProfit / account.initialBalance) * 100 : 0;
    const monthlyPercent = account.initialBalance > 0 ? (monthlyProfit / account.initialBalance) * 100 : 0;
    const allTimePercent = account.initialBalance > 0 ? (allTimeProfit / account.initialBalance) * 100 : 0;
    
    return {
      daily: Math.round(dailyPercent * 100) / 100,
      weekly: Math.round(weeklyPercent * 100) / 100,
      monthly: Math.round(monthlyPercent * 100) / 100,
      allTime: Math.round(allTimePercent * 100) / 100
    };
  };
  
  return {
    accounts,
    selectedAccount,
    createAccount,
    updateAccount,
    deleteAccount,
    selectAccount,
    createTrade
  };
};

export default useTradingAccounts;
