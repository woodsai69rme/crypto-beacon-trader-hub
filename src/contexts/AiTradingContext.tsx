import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { AITradingStrategy, TradingAccount, Trade } from "@/types/trading";

interface AiTradingContextType {
  isLoading: boolean;
  strategies: AITradingStrategy[];
  activeStrategyId: string | null;
  setActiveStrategyId: (id: string | null) => void;
  addStrategy: (strategy: AITradingStrategy) => Promise<void>;
  updateStrategy: (id: string, updates: Partial<AITradingStrategy>) => Promise<void>;
  deleteStrategy: (id: string) => Promise<void>;
  startStrategy: (id: string) => Promise<void>;
  stopStrategy: (id: string) => Promise<void>;
  addOrder: (order: Partial<Trade>) => Promise<void>;
  aiTradingStats: {
    totalAlgos: number;
    activeAlgos: number;
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    netPnl: number;
  };
  aiTradingAccounts: TradingAccount[];
  createAiTradingAccount: (name: string, initialBalance: number) => Promise<void>;
  deleteAiTradingAccount: (id: string) => Promise<void>;
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string | null) => void;
  getFundingAccount: () => TradingAccount | null;
}

const AiTradingContext = createContext<AiTradingContextType | undefined>(undefined);

export function AiTradingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [strategies, setStrategies] = useState<AITradingStrategy[]>([]);
  const [activeStrategyId, setActiveStrategyId] = useState<string | null>(null);
  const [aiTradingAccounts, setAiTradingAccounts] = useState<TradingAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const savedStrategies = localStorage.getItem('ai-trading-strategies');
      const savedActiveStrategy = localStorage.getItem('ai-trading-active-strategy');
      const savedAccounts = localStorage.getItem('ai-trading-accounts');
      const savedSelectedAccount = localStorage.getItem('ai-trading-selected-account');

      if (savedStrategies) {
        try {
          setStrategies(JSON.parse(savedStrategies));
        } catch (e) {
          console.error('Error parsing strategies from localStorage:', e);
        }
      } else {
        // Initialize with default strategies
        setStrategies([
          {
            id: 'strategy-1',
            name: 'BTC Trend Follower',
            description: 'AI-powered trend following strategy for Bitcoin',
            type: 'trend-following',
            timeframe: '1h',
            parameters: {
              fastEMA: 12,
              slowEMA: 26,
              signalLine: 9
            },
            indicators: ['ema', 'macd', 'rsi'],
            performance: {
              winRate: 62.5,
              profitFactor: 1.8,
              sharpeRatio: 1.4,
              trades: 48,
              profitLoss: 2450,
              drawdown: 12.3,
              returns: 18.7
            }
          },
          {
            id: 'strategy-2',
            name: 'ETH Breakout',
            description: 'Volatility breakout strategy for Ethereum',
            type: 'breakout',
            timeframe: '4h',
            parameters: {
              volatilityPeriod: 20,
              breakoutFactor: 2.5
            },
            indicators: ['bollinger', 'atr', 'volume'],
            performance: {
              winRate: 58.2,
              profitFactor: 1.6,
              sharpeRatio: 1.2,
              trades: 67,
              profitLoss: 1850,
              drawdown: 15.7,
              returns: 14.2
            }
          }
        ]);
      }

      if (savedActiveStrategy) {
        setActiveStrategyId(savedActiveStrategy);
      }

      if (savedAccounts) {
        try {
          setAiTradingAccounts(JSON.parse(savedAccounts));
        } catch (e) {
          console.error('Error parsing accounts from localStorage:', e);
        }
      } else {
        // Initialize with a default account
        const defaultAccount: TradingAccount = {
          id: 'ai-account-1',
          name: 'AI Trading Account',
          balance: 10000,
          initialBalance: 10000,
          trades: [],
          currency: 'USD',
          createdAt: new Date().toISOString(),
          type: 'ai'
        };
        setAiTradingAccounts([defaultAccount]);
      }

      if (savedSelectedAccount) {
        setSelectedAccountId(savedSelectedAccount);
      } else if (aiTradingAccounts.length > 0) {
        setSelectedAccountId(aiTradingAccounts[0].id);
      }
    };

    loadData();
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (strategies.length > 0) {
      localStorage.setItem('ai-trading-strategies', JSON.stringify(strategies));
    }
    if (activeStrategyId) {
      localStorage.setItem('ai-trading-active-strategy', activeStrategyId);
    }
    if (aiTradingAccounts.length > 0) {
      localStorage.setItem('ai-trading-accounts', JSON.stringify(aiTradingAccounts));
    }
    if (selectedAccountId) {
      localStorage.setItem('ai-trading-selected-account', selectedAccountId);
    }
  }, [strategies, activeStrategyId, aiTradingAccounts, selectedAccountId]);

  // Add a new strategy
  const addStrategy = async (strategy: AITradingStrategy): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStrategies([...strategies, strategy]);
      
      toast({
        title: "Strategy Added",
        description: `${strategy.name} has been added to your strategies`,
      });
      
    } catch (error) {
      console.error("Error adding strategy:", error);
      toast({
        title: "Error",
        description: "Failed to add strategy",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing strategy
  const updateStrategy = async (id: string, updates: Partial<AITradingStrategy>): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedStrategies = strategies.map(strategy => {
        if (strategy.id === id) {
          return { ...strategy, ...updates };
        }
        return strategy;
      });
      
      setStrategies(updatedStrategies);
      
      toast({
        title: "Strategy Updated",
        description: "Your strategy has been updated",
      });
      
    } catch (error) {
      console.error("Error updating strategy:", error);
      toast({
        title: "Error",
        description: "Failed to update strategy",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a strategy
  const deleteStrategy = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const filteredStrategies = strategies.filter(strategy => strategy.id !== id);
      setStrategies(filteredStrategies);
      
      if (activeStrategyId === id) {
        setActiveStrategyId(null);
      }
      
      toast({
        title: "Strategy Deleted",
        description: "The strategy has been removed",
      });
      
    } catch (error) {
      console.error("Error deleting strategy:", error);
      toast({
        title: "Error",
        description: "Failed to delete strategy",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Start a strategy
  const startStrategy = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setActiveStrategyId(id);
      
      toast({
        title: "Strategy Started",
        description: "Your AI trading strategy is now active",
      });
      
    } catch (error) {
      console.error("Error starting strategy:", error);
      toast({
        title: "Error",
        description: "Failed to start strategy",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Stop a strategy
  const stopStrategy = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (activeStrategyId === id) {
        setActiveStrategyId(null);
      }
      
      toast({
        title: "Strategy Stopped",
        description: "Your AI trading strategy has been deactivated",
      });
      
    } catch (error) {
      console.error("Error stopping strategy:", error);
      toast({
        title: "Error",
        description: "Failed to stop strategy",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add an order/trade from AI
  const addOrder = async (orderDetails: Partial<Trade>): Promise<void> => {
    if (!selectedAccountId) {
      toast({
        title: "No Account Selected",
        description: "Please select an AI trading account first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const account = aiTradingAccounts.find(acc => acc.id === selectedAccountId);
      
      if (!account) {
        throw new Error("Account not found");
      }
      
      // Create a new trade with unique ID
      const createTrade = (coinId: string, coinName: string, coinSymbol: string, type: 'buy' | 'sell', amount: number, price: number, strategyId: string) => {
        const trade: Trade = {
          id: `bot-trade-${Date.now()}`,
          coinId,
          coinName,
          coinSymbol,
          type,
          amount,
          price,
          totalValue: amount * price,
          timestamp: new Date().toISOString(),
          currency: 'USD',
          botGenerated: true,
          strategyId,
          total: amount * price // Added the required total property
        };
        return trade;
      };
      
      const newTrade = createTrade(orderDetails.coinId || "bitcoin", orderDetails.coinName || "Bitcoin", orderDetails.coinSymbol || "BTC", orderDetails.type || "buy", orderDetails.amount || 0.1, orderDetails.price || 60000, activeStrategyId || undefined);
      
      // Update account with new trade and adjust balance
      const updatedAccounts = aiTradingAccounts.map(acc => {
        if (acc.id === selectedAccountId) {
          const updatedBalance = newTrade.type === "buy" 
            ? acc.balance - newTrade.totalValue 
            : acc.balance + newTrade.totalValue;
          
          return {
            ...acc,
            balance: updatedBalance,
            trades: [...acc.trades, newTrade]
          };
        }
        return acc;
      });
      
      setAiTradingAccounts(updatedAccounts);
      
      toast({
        title: `${newTrade.type === "buy" ? "Buy" : "Sell"} Order Executed`,
        description: `${newTrade.type === "buy" ? "Purchased" : "Sold"} ${newTrade.amount} ${newTrade.coinSymbol} at $${newTrade.price}`,
      });
      
    } catch (error) {
      console.error("Error adding order:", error);
      toast({
        title: "Error",
        description: "Failed to execute order",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new AI trading account
  const createAiTradingAccount = async (name: string, initialBalance: number): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAccount: TradingAccount = {
        id: `ai-account-${Date.now()}`,
        name,
        balance: initialBalance,
        initialBalance,
        trades: [],
        currency: "USD",
        createdAt: new Date().toISOString(),
        type: "ai"
      };
      
      setAiTradingAccounts([...aiTradingAccounts, newAccount]);
      setSelectedAccountId(newAccount.id);
      
      toast({
        title: "Account Created",
        description: `${name} has been created with ${initialBalance} USD`,
      });
      
    } catch (error) {
      console.error("Error creating account:", error);
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an AI trading account
  const deleteAiTradingAccount = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const filteredAccounts = aiTradingAccounts.filter(account => account.id !== id);
      setAiTradingAccounts(filteredAccounts);
      
      if (selectedAccountId === id) {
        setSelectedAccountId(filteredAccounts.length > 0 ? filteredAccounts[0].id : null);
      }
      
      toast({
        title: "Account Deleted",
        description: "The AI trading account has been removed",
      });
      
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get the currently selected funding account
  const getFundingAccount = (): TradingAccount | null => {
    if (!selectedAccountId) return null;
    return aiTradingAccounts.find(account => account.id === selectedAccountId) || null;
  };

  // Calculate AI trading statistics based on accounts and trades
  const calculateAiTradingStats = () => {
    let totalTrades = 0;
    let winningTrades = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let netPnl = 0;
    
    const activeStrategiesCount = activeStrategyId ? 1 : 0;
    
    // Calculate stats from all AI trading accounts
    aiTradingAccounts.forEach(account => {
      account.trades.forEach(trade => {
        if (!trade.botGenerated) return; // Skip manual trades
        
        totalTrades++;
        
        // For completed trades with profitLoss calculated
        if (trade.profitLoss !== undefined) {
          if (trade.profitLoss >= 0) {
            winningTrades++;
            grossProfit += trade.profitLoss;
          } else {
            grossLoss += Math.abs(trade.profitLoss);
          }
          netPnl += trade.profitLoss;
        }
      });
    });
    
    // Calculate win rate and profit factor
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;
    
    return {
      totalAlgos: strategies.length,
      activeAlgos: activeStrategiesCount,
      totalTrades,
      winRate,
      profitFactor,
      netPnl
    };
  };

  const aiTradingStats = calculateAiTradingStats();

  return (
    <AiTradingContext.Provider
      value={{
        isLoading,
        strategies,
        activeStrategyId,
        setActiveStrategyId,
        addStrategy,
        updateStrategy,
        deleteStrategy,
        startStrategy,
        stopStrategy,
        addOrder,
        aiTradingStats,
        aiTradingAccounts,
        createAiTradingAccount,
        deleteAiTradingAccount,
        selectedAccountId,
        setSelectedAccountId,
        getFundingAccount
      }}
    >
      {children}
    </AiTradingContext.Provider>
  );
}

export function useAiTrading() {
  const context = useContext(AiTradingContext);
  if (context === undefined) {
    throw new Error("useAiTrading must be used within an AiTradingProvider");
  }
  return context;
}
