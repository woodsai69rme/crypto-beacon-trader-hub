import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TradingAccount, Position, Trade, AITradingStrategy, BacktestResult } from '@/types/trading';

// Mock data and functions for AI trading
import { mockAIStrategies, mockTradingAccounts } from '@/utils/mockData';
import { runBacktest } from '@/services/strategyBuilderService';

interface AiTradingContextType {
  strategies: AITradingStrategy[];
  tradingAccounts: TradingAccount[];
  selectedAccount: TradingAccount | null;
  selectedStrategy: AITradingStrategy | null;
  backtestResults: BacktestResult | null;
  isBacktesting: boolean;
  
  // Strategy functions
  addStrategy: (strategy: AITradingStrategy) => void;
  updateStrategy: (strategy: AITradingStrategy) => void;
  deleteStrategy: (strategyId: string) => void;
  selectStrategy: (strategyId: string | null) => void;
  
  // Account functions
  addAccount: (account: TradingAccount) => void;
  updateAccount: (account: TradingAccount) => void;
  deleteAccount: (accountId: string) => void;
  selectAccount: (accountId: string | null) => void;
  
  // Trading functions
  executeAiTrade: (strategyId: string, accountId: string) => Promise<Trade | null>;
  runBacktest: (
    strategyId: string, 
    asset: string, 
    timeframe: string, 
    startDate: string, 
    endDate: string
  ) => Promise<BacktestResult>;
  updatePosition: (accountId: string, positionId: string, updates: Partial<Position>) => void;
  closePosition: (accountId: string, positionId: string) => void;
}

const AiTradingContext = createContext<AiTradingContextType | undefined>(undefined);

export const AiTradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [strategies, setStrategies] = useState<AITradingStrategy[]>(mockAIStrategies);
  const [tradingAccounts, setTradingAccounts] = useState<TradingAccount[]>(mockTradingAccounts);
  const [selectedAccount, setSelectedAccount] = useState<TradingAccount | null>(
    mockTradingAccounts.length > 0 ? mockTradingAccounts[0] : null
  );
  const [selectedStrategy, setSelectedStrategy] = useState<AITradingStrategy | null>(null);
  const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(null);
  const [isBacktesting, setIsBacktesting] = useState(false);
  
  // Strategy functions
  const addStrategy = (strategy: AITradingStrategy) => {
    setStrategies(prev => [...prev, {
      ...strategy,
      id: strategy.id || uuidv4()
    }]);
  };
  
  const updateStrategy = (strategy: AITradingStrategy) => {
    setStrategies(prev => prev.map(s => s.id === strategy.id ? strategy : s));
  };
  
  const deleteStrategy = (strategyId: string) => {
    setStrategies(prev => prev.filter(s => s.id !== strategyId));
  };
  
  const selectStrategy = (strategyId: string | null) => {
    if (!strategyId) {
      setSelectedStrategy(null);
      return;
    }
    
    const strategy = strategies.find(s => s.id === strategyId);
    setSelectedStrategy(strategy || null);
  };
  
  // Account functions
  const addAccount = (account: TradingAccount) => {
    const newAccount = {
      ...account,
      id: account.id || uuidv4(),
      trades: account.trades || [],
      createdAt: account.createdAt || new Date().toISOString(),
      performance: account.performance || {
        daily: 0,
        weekly: 0,
        monthly: 0,
        allTime: 0
      }
    };
    
    setTradingAccounts(prev => [...prev, newAccount]);
    
    // Select the account if it's the first one
    if (tradingAccounts.length === 0) {
      setSelectedAccount(newAccount);
    }
  };
  
  const updateAccount = (account: TradingAccount) => {
    setTradingAccounts(prev => prev.map(a => a.id === account.id ? account : a));
    
    // Update selected account if it's the one being updated
    if (selectedAccount && selectedAccount.id === account.id) {
      setSelectedAccount(account);
    }
  };
  
  const deleteAccount = (accountId: string) => {
    setTradingAccounts(prev => prev.filter(a => a.id !== accountId));
    
    // Unselect the account if it's being deleted
    if (selectedAccount && selectedAccount.id === accountId) {
      setSelectedAccount(tradingAccounts.length > 1 ? 
        tradingAccounts.find(a => a.id !== accountId) || null : null);
    }
  };
  
  const selectAccount = (accountId: string | null) => {
    if (!accountId) {
      setSelectedAccount(null);
      return;
    }
    
    const account = tradingAccounts.find(a => a.id === accountId);
    setSelectedAccount(account || null);
  };
  
  // Trading functions
  const executeAiTrade = async (
    strategyId: string, 
    accountId: string
  ): Promise<Trade | null> => {
    const strategy = strategies.find(s => s.id === strategyId);
    const account = tradingAccounts.find(a => a.id === accountId);
    
    if (!strategy || !account) {
      console.error("Strategy or account not found");
      return null;
    }
    
    // Simulate trade execution delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find a coin to trade
    const coin = strategy.assets && strategy.assets.length > 0 ? 
      strategy.assets[Math.floor(Math.random() * strategy.assets.length)] : 
      'bitcoin';
      
    // Determine if buy or sell
    const isBuy = Math.random() > 0.5;
    
    // Calculate amount (limited by account balance for buys)
    const price = 30000 + (Math.random() * 5000 - 2500);
    const maxAmount = isBuy ? account.balance / price : 0;
    
    // For buys, use up to 10% of available balance
    const amount = isBuy ? 
      Math.min(maxAmount, account.balance * 0.1 / price) : 
      0.1; // Fixed sale amount for simplicity
    
    if (isBuy && amount <= 0) {
      console.error("Insufficient balance for trade");
      return null;
    }
    
    const total = price * amount;
    
    // Simulate profit (for demo purposes)
    const profitPercentage = (Math.random() * 10) - 5; // -5% to +5%
    const profit = (total * profitPercentage) / 100;
    
    // Create the trade
    const trade: Trade = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      type: isBuy ? "buy" : "sell",
      price,
      amount,
      total,
      profit,
      profitPercentage,
      coin,
      coinId: coin,
      coinName: coin.charAt(0).toUpperCase() + coin.slice(1),
      coinSymbol: coin.substring(0, 3).toUpperCase(),
      currency: account.currency,
      totalValue: total + profit
    };
    
    // Update the account
    const updatedAccount = { ...account };
    
    // Update balance
    if (isBuy) {
      updatedAccount.balance -= total;
    } else {
      updatedAccount.balance += total + profit;
    }
    
    // Add the trade to history
    updatedAccount.trades = [...updatedAccount.trades, trade];
    
    // Add/update position (for buys)
    if (isBuy) {
      const existingPositionIndex = updatedAccount.positions.findIndex(p => p.coinId === coin);
      
      if (existingPositionIndex >= 0) {
        const existingPosition = updatedAccount.positions[existingPositionIndex];
        const totalAmount = existingPosition.amount + amount;
        const averageEntryPrice = 
          ((existingPosition.entryPrice * existingPosition.amount) + (price * amount)) / totalAmount;
          
        updatedAccount.positions[existingPositionIndex] = {
          ...existingPosition,
          amount: totalAmount,
          entryPrice: averageEntryPrice,
          currentPrice: price,
          value: totalAmount * price,
          profitLoss: (price - averageEntryPrice) * totalAmount,
          profitLossPercentage: ((price / averageEntryPrice) - 1) * 100
        };
      } else {
        updatedAccount.positions.push({
          id: uuidv4(),
          coinId: coin,
          coinName: coin.charAt(0).toUpperCase() + coin.slice(1),
          coinSymbol: coin.substring(0, 3).toUpperCase(),
          amount,
          entryPrice: price,
          currentPrice: price,
          value: amount * price,
          profitLoss: 0,
          profitLossPercentage: 0,
          openedAt: new Date().toISOString()
        });
      }
    }
    // For sells, we would need to find the position and reduce amount or remove it
    // Not implemented for simplicity
    
    // Update the account
    updateAccount(updatedAccount);
    
    return trade;
  };
  
  const handleBacktest = async (
    strategyId: string, 
    asset: string, 
    timeframe: string, 
    startDate: string, 
    endDate: string
  ): Promise<BacktestResult> => {
    const strategy = strategies.find(s => s.id === strategyId);
    
    if (!strategy) {
      throw new Error("Strategy not found");
    }
    
    // Set loading state
    setIsBacktesting(true);
    
    try {
      // Call the backtest service
      const result = await runBacktest(
        strategy,
        startDate,
        endDate,
        10000,
        asset
      );
      
      // Update context state
      setBacktestResults(result);
      
      return result;
    } finally {
      // Clear loading state
      setIsBacktesting(false);
    }
  };
  
  const updatePosition = (accountId: string, positionId: string, updates: Partial<Position>) => {
    setTradingAccounts(prev => {
      return prev.map(account => {
        if (account.id !== accountId) return account;
        
        return {
          ...account,
          positions: account.positions.map(position => 
            position.id === positionId ? { ...position, ...updates } : position
          )
        };
      });
    });
  };
  
  const closePosition = (accountId: string, positionId: string) => {
    const account = tradingAccounts.find(a => a.id === accountId);
    if (!account) return;
    
    const position = account.positions.find(p => p.id === positionId);
    if (!position) return;
    
    // Create a sell trade for this position
    const profit = position.profitLoss;
    const total = position.currentPrice * position.amount;
    
    const trade: Trade = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      type: "sell",
      price: position.currentPrice,
      amount: position.amount,
      total,
      profit,
      profitPercentage: position.profitLossPercentage,
      coin: position.coinId,
      coinId: position.coinId,
      coinName: position.coinName,
      coinSymbol: position.coinSymbol,
      currency: account.currency,
      totalValue: total + profit
    };
    
    // Update account
    const updatedAccount = { ...account };
    updatedAccount.balance += total + profit;
    updatedAccount.positions = account.positions.filter(p => p.id !== positionId);
    updatedAccount.trades = [...updatedAccount.trades, trade];
    
    // Update the account
    updateAccount(updatedAccount);
  };
  
  // Provide the context
  const contextValue: AiTradingContextType = {
    strategies,
    tradingAccounts,
    selectedAccount,
    selectedStrategy,
    backtestResults,
    isBacktesting,
    addStrategy,
    updateStrategy,
    deleteStrategy,
    selectStrategy,
    addAccount,
    updateAccount,
    deleteAccount,
    selectAccount,
    executeAiTrade,
    runBacktest: handleBacktest,
    updatePosition,
    closePosition
  };
  
  return (
    <AiTradingContext.Provider value={contextValue}>
      {children}
    </AiTradingContext.Provider>
  );
};

export const useAiTrading = (): AiTradingContextType => {
  const context = useContext(AiTradingContext);
  if (context === undefined) {
    throw new Error('useAiTrading must be used within an AiTradingProvider');
  }
  return context;
};

export default AiTradingContext;
